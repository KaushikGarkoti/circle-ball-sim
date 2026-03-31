import { PhysicsEngine }    from './PhysicsEngine.js'
import { EventBus }         from './EventBus.js'
import { RuleEngine }       from './RuleEngine.js'
import { EntityManager }    from './EntityManager.js'
import { CommandQueue }     from './CommandQueue.js'
import { SpatialIndex }     from './SpatialIndex.js'
import { MonitorRegistry }  from './MonitorRegistry.js'
import { createRNG, uuid }  from './utils.js'

/**
 * SimulationLoop — the single orchestrator.
 *
 * Each tick:
 *   1. integrate     — physics moves entities
 *   2. rebuild       — spatial index updated
 *   3. detect        — physics enqueues collision/escape events
 *   4. monitors      — system monitors enqueue aggregate events
 *   5. TIME_TICK     — enqueued
 *   6. flush         — bus dispatches all → rules react → commands accumulate
 *   7. apply         — entity manager processes commands (may enqueue SPAWN/REMOVE events)
 *   8. flush again   — one more pass for spawn/remove reactions
 *   9. render        — renderer draws current state
 */
export class SimulationLoop {
  constructor (config) {
    this.config   = config
    this.tick     = 0
    this.time     = 0
    this.running  = false
    this._frameId = null
    this._rng     = createRNG(config.seed ?? 42)

    this.physics  = new PhysicsEngine(config.physics)
    this.bus      = new EventBus()
    this.rules    = new RuleEngine()
    this.entities = new EntityManager()
    this.commands = new CommandQueue()
    this.spatial  = new SpatialIndex(config.spatialCellSize ?? 60)
    this.monitors = new MonitorRegistry()

    /** @type {object | null} — set by caller */
    this.renderer = null

    // Expose metrics for HUD
    this.lastMetrics = null
  }

  /** Load a preset — replaces all entities and rules. */
  loadPreset (preset) {
    this.stop()
    this.entities.reset()
    this.rules.reset()
    this.bus.reset()
    this.monitors.reset()
    this.tick = 0
    this.time = 0
    this._rng = createRNG(preset.seed ?? 42)

    if (preset.physics) {
      this.physics.cfg = { ...this.physics.cfg, ...preset.physics }
    }

    // Spawn initial entities
    this.entities.apply(
      preset.entities.circles.map(spec => ({ type: 'SPAWN_CIRCLE', spec })),
      this.bus, 0, 0
    )
    this.entities.apply(
      preset.entities.balls.map(spec => ({ type: 'SPAWN_BALL', spec })),
      this.bus, 0, 0
    )
    this.bus.flush(() => {})  // consume spawn confirmation events without rules

    // Register rules
    this.rules.register(...preset.rules)

    // Register monitors
    for (const m of (preset.monitors ?? [])) this.monitors.register(m)
  }

  start () {
    if (this.running) return
    this.running  = true
    this._step()
  }

  stop () {
    this.running = false
    if (this._frameId) cancelAnimationFrame(this._frameId)
    this._frameId = null
  }

  /** Single step (for paused debugging) */
  stepOnce () {
    this._tick()
  }

  _step () {
    if (!this.running) return
    this._tick()
    this._frameId = requestAnimationFrame(() => this._step())
  }

  _tick () {
    const cfg = this.physics.cfg
    const dt  = cfg.timeStep * (cfg.timeScale ?? 1)

    const balls   = this.entities.ballArray()
    const circles = this.entities.circleArray()

    // 1 — Integrate
    this.physics.integrate(balls, dt)

    // 2 — Rebuild spatial index
    this.spatial.rebuild(balls, circles)

    // 3 — Detect collisions → enqueue events (depth 0)
    this.physics.detectAndEmit(balls, circles, this.bus, this.tick, this.time, this.spatial)

    // 4 — System monitors → enqueue aggregate events
    this.monitors.computeAndEmit(this.entities, this.bus, this.tick, this.time)
    this.lastMetrics = this.monitors.getLastMetrics()

    // 5 — TIME_TICK
    this.bus.enqueue({
      id: `tick-${this.tick}`, type: 'TIME_TICK',
      tick: this.tick, time: this.time, depth: 0,
      originId: `tick-${this.tick}`,
      context: { entities: [] }
    })

    // 6 — Flush → rules produce commands
    const api  = this._buildAPI()
    const cmds = this.commands
    this.bus.flush(event => this.rules.handle(event, api, cmds))

    // 7 — Apply commands (may enqueue SPAWN/REMOVE confirmations)
    this.entities.apply(cmds.drain(this.config.fieldResolution ?? {}), this.bus, this.tick, this.time)

    // 8 — Second flush for spawn/remove reactions (depth 1+)
    this.bus.flush(event => this.rules.handle(event, api, cmds))
    this.entities.apply(cmds.drain(this.config.fieldResolution ?? {}), this.bus, this.tick, this.time)

    // 9 — Render
    this.renderer?.render(this.entities, this.time, this.lastMetrics)

    this.tick++
    this.time += dt
  }

  _buildAPI () {
    const self = this
    return {
      get tick ()     { return self.tick },
      get time ()     { return self.time },
      get rng  ()     { return self._rng },
      get entities () { return self.entities },
      get metrics ()  { return self.lastMetrics },

      // Spatial queries forwarded
      queryNearby:       (pos, r)  => self.spatial.queryNearby(pos, r),
      queryInsideCircle: (circle)  => self.spatial.queryInsideCircle(circle),
      queryByTag:        (tag, near) => self.spatial.queryByTag(tag, near),
      queryByState:      (state)   => self.spatial.queryByState(state),

      // Direct entity lookups
      getBall:   (id) => self.entities.getBall(id),
      getCircle: (id) => self.entities.getCircle(id),

      // Config
      config: self.config
    }
  }
}
