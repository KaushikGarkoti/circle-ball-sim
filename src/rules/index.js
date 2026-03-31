import { uuid, randomVelocity, mag2 } from '../core/utils.js'

// ─── Helper ─────────────────────────────────────────────────────────────────

const mkEvent = (type, context, parent) => ({
  id: uuid(), type, depth: (parent?.depth ?? 0) + 1,
  originId: parent?.originId ?? uuid(),
  parentId: parent?.id,
  tick: parent?.tick ?? 0, time: parent?.time ?? 0,
  context: { entities: [], ...context }
})

// ─── Rule: spawn children when ball escapes ─────────────────────────────────

export const spawnOnEscape = (count = 2, radiusScale = 0.7, maxBalls = 60) => ({
  id: 'spawn-on-escape',
  triggers: ['BALL_ESCAPE_CIRCLE'],
  enabled: true,
  action (event, api, commands) {
    const { ball, circle } = event.context
    if (!ball || !circle) return
    if (api.entities.getBalls().size >= maxBalls) {
      commands.push({ type: 'REMOVE_BALL', id: ball.id })
      return
    }
    commands.push({ type: 'REMOVE_BALL', id: ball.id })
    const speed = Math.sqrt(mag2(ball.velocity))
    for (let i = 0; i < count; i++) {
      const angle = api.rng() * Math.PI * 2
      const spd   = speed * (0.6 + api.rng() * 0.6)
      commands.push({
        type: 'SPAWN_BALL',
        spec: {
          position:    { x: circle.center.x + (api.rng() - 0.5) * circle.radius * 0.5,
                         y: circle.center.y + (api.rng() - 0.5) * circle.radius * 0.5 },
          velocity:    { x: Math.cos(angle) * spd, y: Math.sin(angle) * spd },
          radius:      Math.max(5, ball.radius * radiusScale),
          mass:        ball.mass * (radiusScale ** 2),
          restitution: ball.restitution,
          tags:        new Set(ball.tags),
          state:       'normal'
        }
      })
    }
  }
})

// ─── Rule: split on high-energy collision ───────────────────────────────────

export const splitOnCollision = (energyThreshold = 300, minRadius = 6) => ({
  id: 'split-on-collision',
  triggers: ['BALL_BALL_COLLISION'],
  enabled: true,
  condition: (event) => (event.context.energy ?? 0) > energyThreshold,
  action (event, api, commands) {
    const { ballA, ballB } = event.context
    for (const ball of [ballA, ballB]) {
      if (!ball || ball.radius < minRadius) continue
      commands.push({ type: 'REMOVE_BALL', id: ball.id })
      for (let i = 0; i < 2; i++) {
        const angle = api.rng() * Math.PI * 2
        const speed = Math.sqrt(mag2(ball.velocity)) * 0.75
        commands.push({
          type: 'SPAWN_BALL',
          spec: {
            position:    { x: ball.position.x + Math.cos(angle) * ball.radius * 0.6,
                           y: ball.position.y + Math.sin(angle) * ball.radius * 0.6 },
            velocity:    { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
            radius:      ball.radius * 0.65,
            mass:        ball.mass * 0.5,
            restitution: ball.restitution,
            tags:        new Set(ball.tags),
            state:       'normal'
          }
        })
      }
    }
  }
})

// ─── Rule: charge state on collision above threshold ────────────────────────

export const chargeOnCollision = (energyThreshold = 150) => ({
  id: 'charge-on-collision',
  triggers: ['BALL_BALL_COLLISION'],
  enabled: true,
  condition: (event) => (event.context.energy ?? 0) > energyThreshold,
  action (event, api, commands) {
    for (const ball of [event.context.ballA, event.context.ballB]) {
      if (!ball) continue
      commands.push({ type: 'MODIFY_BALL', id: ball.id, patch: { state: 'charged' }, mode: 'override', priority: 0 })
    }
  }
})

// ─── Rule: charged balls emit energy pulses → nearby balls get boosted ──────

export const chargedEmitsEnergy = (emitRadius = 120) => ({
  id: 'charged-emit-energy',
  triggers: ['BALL_WALL_COLLISION'],
  enabled: true,
  condition: (event) => event.context.ball?.state === 'charged',
  action (event, api, commands) {
    const { ball } = event.context
    if (!ball) return
    const nearby = api.queryNearby(ball.position, emitRadius)
      .filter(e => e.type === 'BALL' && e.id !== ball.id)
    for (const target of nearby) {
      const dx = target.position.x - ball.position.x
      const dy = target.position.y - ball.position.y
      const d  = Math.sqrt(dx * dx + dy * dy) || 1
      const force = 0.8 * (1 - d / emitRadius)
      commands.push({
        type: 'MODIFY_BALL', id: target.id,
        patch: { velocity: { x: (dx / d) * force, y: (dy / d) * force } },
        mode: 'merge-add', priority: 0
      })
    }
    // Charged ball decays after emitting
    commands.push({ type: 'MODIFY_BALL', id: ball.id, patch: { state: 'decaying' }, mode: 'override', priority: 0 })
  }
})

// ─── Rule: decay → normal over time ─────────────────────────────────────────

export const decayToNormal = (ticksDecaying = 120) => ({
  id: 'decay-to-normal',
  triggers: ['TIME_TICK'],
  enabled: true,
  action (event, api, commands) {
    for (const ball of api.entities.getBalls().values()) {
      if (ball.state !== 'decaying') continue
      if (!ball._decayTick) ball._decayTick = event.tick
      if (event.tick - ball._decayTick > ticksDecaying) {
        delete ball._decayTick
        commands.push({ type: 'MODIFY_BALL', id: ball.id, patch: { state: 'normal' }, mode: 'override', priority: 0 })
      }
    }
  }
})

// ─── Rule: gap grows slightly on each escape ─────────────────────────────────

export const growGapOnEscape = (deltaRad = 0.04, maxGapRad = 1.2) => ({
  id: 'grow-gap-on-escape',
  triggers: ['BALL_ESCAPE_CIRCLE'],
  enabled: true,
  action (event, api, commands) {
    const { circle, gap } = event.context
    if (!circle || !gap) return
    const newGaps = circle.gaps.map(g =>
      g === gap
        ? {
            startAngle: g.startAngle - Math.min(deltaRad, (maxGapRad - (g.endAngle - g.startAngle)) / 2),
            endAngle:   g.endAngle   + Math.min(deltaRad, (maxGapRad - (g.endAngle - g.startAngle)) / 2)
          }
        : g
    )
    commands.push({ type: 'MODIFY_CIRCLE', id: circle.id, patch: { gaps: newGaps }, mode: 'override', priority: 0 })
  }
})

// ─── Rule: shrink arena on system overload ───────────────────────────────────

export const shrinkOnOverload = (shrinkAmount = 8, minRadius = 80) => ({
  id: 'shrink-on-overload',
  triggers: ['SYSTEM_OVERLOAD'],
  enabled: true,
  action (event, api, commands) {
    for (const [id, circle] of api.entities.getCircles()) {
      if (circle.radius <= minRadius) continue
      commands.push({
        type: 'MODIFY_CIRCLE', id,
        patch: { radius: Math.max(minRadius, circle.radius - shrinkAmount) },
        mode: 'override', priority: 0
      })
    }
  }
})

// ─── Rule: remove all balls when LOW_ENERGY_STATE — reset ───────────────────

export const removeOnLowEnergy = () => ({
  id: 'remove-on-low-energy',
  triggers: ['LOW_ENERGY_STATE'],
  enabled: true,
  cooldownMs: 3000,
  action (event, api, commands) {
    for (const [id] of api.entities.getBalls()) {
      commands.push({ type: 'REMOVE_BALL', id })
    }
    // Spawn a fresh ball
    const circle = api.entities.circleArray()[0]
    if (!circle) return
    commands.push({
      type: 'SPAWN_BALL',
      spec: {
        position:    { x: 0, y: -circle.radius * 0.4 },
        velocity:    { x: 4 + api.rng() * 3, y: 2 + api.rng() * 2 },
        radius:      18,
        mass:        1.5,
        restitution: 0.95
      }
    })
  }
})
