/**
 * Canvas2DRenderer — renders entity state each tick.
 * Completely decoupled from simulation logic.
 */
export class Canvas2DRenderer {
  constructor (canvas) {
    this.canvas = canvas
    this.ctx    = canvas.getContext('2d')
    this._trails = new Map()   // ballId → [{x,y}]
    this.showTrails  = true
    this.showMetrics = true
    this.trailLength = 18
  }

  /**
   * @param {import('../core/EntityManager.js').EntityManager} entities
   * @param {number} time
   * @param {object} metrics
   */
  render (entities, time, metrics) {
    const { ctx, canvas } = this
    const W = canvas.width, H = canvas.height

    // Clear
    ctx.fillStyle = 'rgba(10, 10, 20, 0.92)'
    ctx.fillRect(0, 0, W, H)

    // Translate origin to canvas center
    ctx.save()
    ctx.translate(W / 2, H / 2)

    this._drawCircles(entities.getCircles())
    if (this.showTrails) this._drawTrails(entities.getBalls())
    this._drawBalls(entities.getBalls())

    ctx.restore()

    if (this.showMetrics && metrics) this._drawHUD(metrics, entities, time)
  }

  _drawCircles (circles) {
    const { ctx } = this
    for (const circle of circles.values()) {
      this._drawCircleBoundary(circle)
    }
  }

  _drawCircleBoundary (circle) {
    const { ctx } = this
    const TAU = Math.PI * 2
    const segStep = 0.008

    ctx.lineWidth   = circle.thickness
    ctx.lineCap     = 'round'

    // Collect gap ranges in local (rotation-subtracted) space
    const gapRanges = circle.gaps.map(g => {
      const s = ((g.startAngle) % TAU + TAU) % TAU
      const e = ((g.endAngle)   % TAU + TAU) % TAU
      return { s, e }
    })

    const inGap = (localAngle) => {
      const a = ((localAngle) % TAU + TAU) % TAU
      return gapRanges.some(({ s, e }) => s <= e ? (a >= s && a <= e) : (a >= s || a <= e))
    }

    let inArc = false
    let arcStart = 0

    for (let a = 0; a <= TAU + segStep; a += segStep) {
      const localAngle = ((a - circle.rotation) % TAU + TAU) % TAU
      const gap = inGap(localAngle)

      if (!gap && !inArc) {
        arcStart = a
        inArc = true
      }
      if ((gap || a >= TAU) && inArc) {
        // Draw segment
        const gradient = ctx.createLinearGradient(
          Math.cos(arcStart) * circle.radius, Math.sin(arcStart) * circle.radius,
          Math.cos(a) * circle.radius,        Math.sin(a) * circle.radius
        )
        gradient.addColorStop(0,   'rgba(148, 163, 184, 0.9)')
        gradient.addColorStop(0.5, 'rgba(226, 232, 240, 1)')
        gradient.addColorStop(1,   'rgba(148, 163, 184, 0.9)')

        ctx.beginPath()
        ctx.arc(circle.center.x, circle.center.y, circle.radius, arcStart, a)
        ctx.strokeStyle = gradient
        ctx.stroke()
        inArc = false
      }
    }

    // Gap indicator — subtle glow at gap edges
    for (const gap of circle.gaps) {
      for (const angle of [gap.startAngle + circle.rotation, gap.endAngle + circle.rotation]) {
        const gx = circle.center.x + Math.cos(angle) * circle.radius
        const gy = circle.center.y + Math.sin(angle) * circle.radius
        const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, 12)
        glow.addColorStop(0,   'rgba(99, 179, 237, 0.6)')
        glow.addColorStop(1,   'rgba(99, 179, 237, 0)')
        ctx.beginPath()
        ctx.arc(gx, gy, 12, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()
      }
    }
  }

  _drawTrails (balls) {
    const { ctx } = this

    // Update trail positions
    for (const ball of balls.values()) {
      if (!this._trails.has(ball.id)) this._trails.set(ball.id, [])
      const trail = this._trails.get(ball.id)
      trail.push({ x: ball.position.x, y: ball.position.y })
      if (trail.length > this.trailLength) trail.shift()
    }

    // Remove stale trails
    for (const [id] of this._trails) {
      if (!balls.has(id)) this._trails.delete(id)
    }

    // Draw trails
    for (const [id, trail] of this._trails) {
      if (trail.length < 2) continue
      const ball = balls.get(id)
      const color = ball ? this._stateColor(ball.state, true) : '100,150,255'

      for (let i = 1; i < trail.length; i++) {
        const alpha = (i / trail.length) * 0.35
        ctx.beginPath()
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y)
        ctx.lineTo(trail[i].x, trail[i].y)
        ctx.strokeStyle = `rgba(${color}, ${alpha})`
        ctx.lineWidth = (ball?.radius ?? 8) * (i / trail.length) * 0.5
        ctx.stroke()
      }
    }
  }

  _drawBalls (balls) {
    const { ctx } = this
    for (const ball of balls.values()) {
      const [r, g, b] = this._stateColorRGB(ball.state)

      // Glow
      const glow = ctx.createRadialGradient(
        ball.position.x, ball.position.y, 0,
        ball.position.x, ball.position.y, ball.radius * 2.5
      )
      glow.addColorStop(0,   `rgba(${r},${g},${b},0.25)`)
      glow.addColorStop(1,   `rgba(${r},${g},${b},0)`)
      ctx.beginPath()
      ctx.arc(ball.position.x, ball.position.y, ball.radius * 2.5, 0, Math.PI * 2)
      ctx.fillStyle = glow
      ctx.fill()

      // Ball body
      const grad = ctx.createRadialGradient(
        ball.position.x - ball.radius * 0.3,
        ball.position.y - ball.radius * 0.3,
        ball.radius * 0.1,
        ball.position.x,
        ball.position.y,
        ball.radius
      )
      grad.addColorStop(0,   `rgba(${Math.min(255,r+60)},${Math.min(255,g+60)},${Math.min(255,b+60)},1)`)
      grad.addColorStop(0.6, `rgba(${r},${g},${b},1)`)
      grad.addColorStop(1,   `rgba(${Math.max(0,r-40)},${Math.max(0,g-40)},${Math.max(0,b-40)},1)`)

      ctx.beginPath()
      ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, Math.PI * 2)
      ctx.fillStyle   = grad
      ctx.fill()
      ctx.strokeStyle = `rgba(255,255,255,0.15)`
      ctx.lineWidth   = 1
      ctx.stroke()
    }
  }

  _stateColorRGB (state) {
    switch (state) {
      case 'charged':  return [251, 191,  36]
      case 'decaying': return [239,  68,  68]
      case 'heavy':    return [167, 139, 250]
      default:         return [ 96, 165, 250]
    }
  }

  _stateColor (state, asString = false) {
    const [r, g, b] = this._stateColorRGB(state)
    return asString ? `${r},${g},${b}` : `rgb(${r},${g},${b})`
  }

  _drawHUD (metrics, entities, time) {
    const { ctx, canvas } = this
    const lines = [
      `balls    ${metrics.ballCount}`,
      `energy   ${metrics.totalKineticEnergy.toFixed(0)}`,
      `t        ${time.toFixed(1)}s`,
    ]
    const stateEntries = Object.entries(metrics.ballsPerState)
    for (const [state, count] of stateEntries) {
      if (count > 0) lines.push(`${state.padEnd(8)} ${count}`)
    }

    ctx.save()
    ctx.font      = '11px "Courier New", monospace'
    ctx.fillStyle = 'rgba(148,163,184,0.8)'
    ctx.textAlign = 'left'
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], 14, 20 + i * 16)
    }
    ctx.restore()
  }

  resize (w, h) {
    this.canvas.width  = w
    this.canvas.height = h
  }
}
