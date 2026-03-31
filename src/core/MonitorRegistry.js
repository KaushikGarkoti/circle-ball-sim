import { uuid, avg, dominantKey, mag2 } from './utils.js'

/**
 * MonitorRegistry — observes aggregate system metrics each tick and emits
 * system-level events when thresholds are crossed.
 *
 * Monitors only fire on TRANSITIONS (crossing a threshold), not on steady state.
 */
export class MonitorRegistry {
  constructor () {
    /** @type {Map<string, object>} */
    this._monitors = new Map()
    /** @type {object | null} */
    this._prevMetrics = null
  }

  /** @param {object} monitor  — { id, check(metrics, prev) → SimEvent[] } */
  register (monitor) {
    this._monitors.set(monitor.id, monitor)
  }

  remove (id) { this._monitors.delete(id) }

  reset () {
    this._monitors.clear()
    this._prevMetrics = null
  }

  /**
   * Compute metrics, run all monitors, enqueue any produced events.
   * @param {import('./EntityManager.js').EntityManager} entities
   * @param {import('./EventBus.js').EventBus} bus
   * @param {number} tick
   * @param {number} time
   */
  computeAndEmit (entities, bus, tick, time) {
    const metrics = this._compute(entities, tick, time)
    const prev    = this._prevMetrics ?? { ...metrics }

    for (const monitor of this._monitors.values()) {
      let events
      try { events = monitor.check(metrics, prev) }
      catch (e) { console.warn(`[Monitor:${monitor.id}]`, e); continue }

      for (const event of (events ?? [])) {
        bus.enqueue({ tick, time, depth: 0, originId: `monitor-${monitor.id}`, ...event })
      }
    }

    this._prevMetrics = metrics
  }

  getLastMetrics () { return this._prevMetrics }

  _compute (entities, tick, time) {
    const balls  = entities.ballArray()
    const speeds = balls.map(b => Math.sqrt(mag2(b.velocity)))
    const stateMap = {}
    for (const ball of balls) {
      stateMap[ball.state] = (stateMap[ball.state] ?? 0) + 1
    }
    return {
      ballCount:           balls.length,
      totalKineticEnergy:  balls.reduce((s, b) => s + 0.5 * b.mass * mag2(b.velocity), 0),
      avgSpeed:            avg(speeds),
      maxSpeed:            balls.length ? Math.max(...speeds) : 0,
      ballsPerState:       stateMap,
      dominantState:       dominantKey(stateMap) ?? 'normal',
      totalMass:           balls.reduce((s, b) => s + b.mass, 0),
      tick,
      time
    }
  }
}

// ─── Built-in monitors (register these in your preset) ─────────────────────

export const overloadMonitor = (maxBalls = 80) => {
  const monitor = {
    id: 'overload',
    cfg: { maxBalls },
    guiSchema: [
      { key: 'maxBalls', label: 'Ball Limit', min: 10, max: 300, step: 5 }
    ],
    check (m, prev) {
      if (m.ballCount > monitor.cfg.maxBalls && prev.ballCount <= monitor.cfg.maxBalls) {
        return [{ id: uuid(), type: 'SYSTEM_OVERLOAD', context: { entities: [], ballCount: m.ballCount } }]
      }
      return []
    }
  }
  return monitor
}

export const energyMonitor = (highThreshold = 8000, lowThreshold = 200) => {
  const monitor = {
    id: 'energy',
    cfg: { highThreshold, lowThreshold },
    guiSchema: [
      { key: 'highThreshold', label: 'High Energy', min: 500, max: 20000, step: 500 },
      { key: 'lowThreshold', label: 'Low Energy', min: 0, max: 1000, step: 10 }
    ],
    check (m, prev) {
      const events = []
      if (m.totalKineticEnergy > monitor.cfg.highThreshold && prev.totalKineticEnergy <= monitor.cfg.highThreshold) {
        events.push({ id: uuid(), type: 'HIGH_ENERGY_STATE', context: { entities: [], energy: m.totalKineticEnergy } })
      }
      if (m.totalKineticEnergy < monitor.cfg.lowThreshold && prev.totalKineticEnergy >= monitor.cfg.lowThreshold) {
        events.push({ id: uuid(), type: 'LOW_ENERGY_STATE', context: { entities: [], energy: m.totalKineticEnergy } })
      }
      return events
    }
  }
  return monitor
}

export const phaseTransitionMonitor = () => {
  const monitor = {
    id: 'phase-transition',
    cfg: {},
    guiSchema: [],
    check (m, prev) {
      if (m.dominantState !== prev.dominantState) {
        return [{
          id: uuid(),
          type: 'PHASE_TRANSITION',
          context: { entities: [], fromState: prev.dominantState, toState: m.dominantState }
        }]
      }
      return []
    }
  }
  return monitor
}
