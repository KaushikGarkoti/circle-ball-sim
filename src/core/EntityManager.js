import { uuid } from './utils.js'

/**
 * EntityManager — the ONLY place entities are created, modified, or destroyed.
 * Applies Command objects produced by rules. Emits confirmation events back
 * onto the bus for SPAWN and REMOVE operations.
 */
export class EntityManager {
  constructor () {
    /** @type {Map<string, object>} */
    this._balls   = new Map()
    /** @type {Map<string, object>} */
    this._circles = new Map()
  }

  getBalls   () { return this._balls }
  getCircles () { return this._circles }

  getBall   (id) { return this._balls.get(id) }
  getCircle (id) { return this._circles.get(id) }

  /**
   * @param {Array} commands
   * @param {import('./EventBus.js').EventBus} bus
   * @param {number} tick
   * @param {number} time
   */
  apply (commands, bus, tick, time) {
    for (const cmd of commands) {
      switch (cmd.type) {
        case 'SPAWN_BALL': {
          const ball = this._makeBall(cmd.spec)
          this._balls.set(ball.id, ball)
          bus.enqueue({
            id: uuid(), type: 'BALL_SPAWN', tick, time, depth: 0,
            originId: ball.id,
            context: { entities: [ball], ball }
          })
          break
        }
        case 'REMOVE_BALL': {
          const ball = this._balls.get(cmd.id)
          if (!ball) break
          this._balls.delete(cmd.id)
          bus.enqueue({
            id: uuid(), type: 'BALL_REMOVE', tick, time, depth: 0,
            originId: cmd.id,
            context: { entities: [ball], ball }
          })
          break
        }
        case 'MODIFY_BALL': {
          const ball = this._balls.get(cmd.id)
          if (!ball) break
          this._applyPatch(ball, cmd.patch, cmd.mode ?? 'override')
          // State transition side-effect
          if (cmd.patch.state && cmd.patch.state !== ball._prevState) {
            bus.enqueue({
              id: uuid(), type: 'ENTITY_STATE_CHANGE', tick, time, depth: 0,
              originId: cmd.id,
              context: {
                entities: [ball], ball,
                fromState: ball._prevState ?? 'normal',
                toState:   cmd.patch.state
              }
            })
            ball._prevState = cmd.patch.state
          }
          break
        }
        case 'SPAWN_CIRCLE': {
          const circle = this._makeCircle(cmd.spec)
          this._circles.set(circle.id, circle)
          bus.enqueue({
            id: uuid(), type: 'CIRCLE_SPAWN', tick, time, depth: 0,
            originId: circle.id,
            context: { entities: [circle], circle }
          })
          break
        }
        case 'REMOVE_CIRCLE': {
          const circle = this._circles.get(cmd.id)
          if (!circle) break
          this._circles.delete(cmd.id)
          bus.enqueue({
            id: uuid(), type: 'CIRCLE_REMOVE', tick, time, depth: 0,
            originId: cmd.id,
            context: { entities: [circle], circle }
          })
          break
        }
        case 'MODIFY_CIRCLE': {
          const circle = this._circles.get(cmd.id)
          if (circle) this._applyPatch(circle, cmd.patch, cmd.mode ?? 'override')
          break
        }
      }
    }
  }

  _applyPatch (target, patch, mode) {
    for (const key of Object.keys(patch)) {
      const a = target[key], b = patch[key]
      if (mode === 'merge-add') {
        if (typeof a === 'object' && a !== null && 'x' in a) {
          target[key] = { x: a.x + b.x, y: a.y + b.y }
        } else if (typeof a === 'number') {
          target[key] = a + b
        } else {
          target[key] = b
        }
      } else if (mode === 'merge-min' && typeof a === 'number') {
        target[key] = Math.min(a, b)
      } else if (mode === 'merge-max' && typeof a === 'number') {
        target[key] = Math.max(a, b)
      } else {
        target[key] = b
      }
    }
  }

  _makeBall (spec) {
    return {
      id:          uuid(),
      type:        'BALL',
      tags:        spec.tags   ?? new Set(),
      state:       spec.state  ?? 'normal',
      _prevState:  spec.state  ?? 'normal',
      position:    { x: spec.position.x, y: spec.position.y },
      velocity:    { x: spec.velocity.x, y: spec.velocity.y },
      radius:      spec.radius,
      mass:        spec.mass,
      restitution: spec.restitution ?? 0.95,
      charge:      spec.charge      ?? 0
    }
  }

  _makeCircle (spec) {
    return {
      id:            uuid(),
      type:          'CIRCLE',
      tags:          spec.tags ?? new Set(),
      center:        { x: spec.center.x, y: spec.center.y },
      radius:        spec.radius,
      rotation:      spec.rotation       ?? 0,
      rotationSpeed: spec.rotationSpeed  ?? 0,
      gaps:          spec.gaps           ?? [],
      thickness:     spec.thickness      ?? 4
    }
  }

  /** Snapshot — plain arrays for physics iteration (avoids map iteration overhead). */
  ballArray   () { return [...this._balls.values()] }
  circleArray () { return [...this._circles.values()] }

  reset () {
    this._balls.clear()
    this._circles.clear()
  }
}
