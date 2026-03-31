import { uuid, mag2, dist, kineticEnergy, angleInArc, v2 } from './utils.js'

/**
 * PhysicsEngine — integrates motion and DETECTS events.
 * It never decides outcomes. It only emits raw collision/escape events.
 *
 * @typedef {{ gravity: number, drag: number, timeStep: number, timeScale: number }} PhysicsConfig
 */
export class PhysicsEngine {
  /** @param {PhysicsConfig} cfg */
  constructor (cfg) {
    this.cfg = cfg
  }

  /**
   * Integrate velocity and position for all balls.
   * @param {object[]} balls
   * @param {number} dt  — seconds
   */
  integrate (balls, dt) {
    const { gravity, drag } = this.cfg
    for (const b of balls) {
      b.velocity.y += gravity * dt
      const dragFactor = Math.max(0, 1 - drag * dt)
      b.velocity.x *= dragFactor
      b.velocity.y *= dragFactor
      b.position.x += b.velocity.x * dt
      b.position.y += b.velocity.y * dt
    }
  }

  /**
   * Detect collisions and escapes; enqueue events onto the bus.
   * @param {object[]} balls
   * @param {object[]} circles
   * @param {import('./EventBus.js').EventBus} bus
   * @param {number} tick
   * @param {number} time
   */
  detectAndEmit (balls, circles, bus, tick, time, spatial = null) {
    this._ballBall(balls, bus, tick, time, spatial)
    this._ballCircle(balls, circles, bus, tick, time)
    this._rotateCircles(circles)
  }

  _ballBall (balls, bus, tick, time, spatial) {
    const indexById = new Map()
    let maxRadius = 0
    for (let i = 0; i < balls.length; i++) {
      indexById.set(balls[i].id, i)
      maxRadius = Math.max(maxRadius, balls[i].radius)
    }

    for (let i = 0; i < balls.length; i++) {
      const a = balls[i]
      const candidates = spatial
        ? spatial.queryNearbyBalls(a.position, a.radius + maxRadius)
        : balls

      for (const b of candidates) {
        if (b.id === a.id) continue
        const j = indexById.get(b.id)
        if (j <= i) continue
        const dx = b.position.x - a.position.x
        const dy = b.position.y - a.position.y
        const d  = Math.sqrt(dx * dx + dy * dy)
        const minD = a.radius + b.radius
        if (d >= minD || d === 0) continue

        const nx = dx / d, ny = dy / d

        // Push apart (positional correction)
        const overlap = (minD - d) * 0.52
        a.position.x -= nx * overlap
        a.position.y -= ny * overlap
        b.position.x += nx * overlap
        b.position.y += ny * overlap

        // Impulse-based velocity resolution
        const dvx   = b.velocity.x - a.velocity.x
        const dvy   = b.velocity.y - a.velocity.y
        const vDotN = dvx * nx + dvy * ny
        if (vDotN > 0) continue  // already separating

        const e = Math.min(a.restitution, b.restitution)
        const jMag = -(1 + e) * vDotN / (1 / a.mass + 1 / b.mass)

        a.velocity.x -= (jMag / a.mass) * nx
        a.velocity.y -= (jMag / a.mass) * ny
        b.velocity.x += (jMag / b.mass) * nx
        b.velocity.y += (jMag / b.mass) * ny

        const energy = kineticEnergy(a.mass, a.velocity) + kineticEnergy(b.mass, b.velocity)

        bus.enqueue({
          id: uuid(), type: 'BALL_BALL_COLLISION', tick, time, depth: 0,
          originId: `col-${a.id}-${b.id}`,
          context: {
            entities: [a, b], ballA: a, ballB: b,
            energy,
            impulse: v2(nx * jMag, ny * jMag),
            position: { x: (a.position.x + b.position.x) / 2, y: (a.position.y + b.position.y) / 2 }
          }
        })
      }
    }
  }

  _ballCircle (balls, circles, bus, tick, time) {
    for (const ball of balls) {
      for (const circle of circles) {
        const dx = ball.position.x - circle.center.x
        const dy = ball.position.y - circle.center.y
        const d  = Math.sqrt(dx * dx + dy * dy)
        const wallDist = circle.radius - ball.radius

        if (d < wallDist * 0.99) continue  // comfortably inside

        const angle = Math.atan2(dy, dx)
        const inGap = circle.gaps.some(g => angleInArc(angle, g, circle.rotation))

        if (inGap) {
          // Ball reaches the gap — it can escape
          if (d > circle.radius - ball.radius * 0.5) {
            bus.enqueue({
              id: uuid(), type: 'BALL_ESCAPE_CIRCLE', tick, time, depth: 0,
              originId: `escape-${ball.id}`,
              context: {
                entities: [ball, circle], ball, circle,
                gap: circle.gaps.find(g => angleInArc(angle, g, circle.rotation)),
                position: { ...ball.position },
                speed: Math.sqrt(mag2(ball.velocity))
              }
            })
          }
        } else {
          // Reflect off inner wall
          const nx = dx / d, ny = dy / d
          const vDotN = ball.velocity.x * nx + ball.velocity.y * ny
          if (vDotN > 0) {  // moving outward — reflect
            ball.velocity.x -= 2 * vDotN * nx * ball.restitution
            ball.velocity.y -= 2 * vDotN * ny * ball.restitution
          }
          // Clamp inside
          ball.position.x = circle.center.x + nx * wallDist * 0.98
          ball.position.y = circle.center.y + ny * wallDist * 0.98

          bus.enqueue({
            id: uuid(), type: 'BALL_WALL_COLLISION', tick, time, depth: 0,
            originId: `wall-${ball.id}`,
            context: {
              entities: [ball, circle], ball, circle,
              energy: kineticEnergy(ball.mass, ball.velocity),
              position: { x: circle.center.x + nx * circle.radius, y: circle.center.y + ny * circle.radius },
              normal: v2(nx, ny)
            }
          })
        }
      }
    }
  }

  _rotateCircles (circles) {
    for (const c of circles) {
      c.rotation = (c.rotation + c.rotationSpeed) % (Math.PI * 2)
    }
  }
}
