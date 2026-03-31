/**
 * RuleEngine — dispatches SimEvents to matching Rules and collects Commands.
 *
 * A Rule is a plain object:
 * {
 *   id:         string
 *   triggers:   EventType[]
 *   condition?: (event, api) => boolean
 *   action:     (event, api, commands) => void
 *   priority?:  number          (higher fires first)
 *   enabled:    boolean
 *   maxFires?:  number
 *   cooldownMs?: number
 * }
 */
export class RuleEngine {
  constructor () {
    /** @type {Map<string, object>} */
    this._rules      = new Map()
    this._fireCounts = new Map()
    this._lastFired  = new Map()
  }

  register (...rules) {
    for (const r of rules) {
      this._rules.set(r.id, r)
    }
  }

  remove (id) { this._rules.delete(id) }

  enable  (id) { const r = this._rules.get(id); if (r) r.enabled = true  }
  disable (id) { const r = this._rules.get(id); if (r) r.enabled = false }

  /**
   * Handle one event — find matching rules, check guards, fire actions.
   * @param {object} event
   * @param {object} api   — SimAPI (state + spatial queries)
   * @param {import('./CommandQueue.js').CommandQueue} commands
   */
  handle (event, api, commands) {
    const candidates = [...this._rules.values()]
      .filter(r =>
        r.enabled &&
        r.triggers.includes(event.type) &&
        this._cooldownOk(r, api.time) &&
        this._maxFiresOk(r) &&
        (!r.condition || r.condition(event, api))
      )
      .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))

    for (const rule of candidates) {
      try {
        rule.action(event, api, commands)
      } catch (e) {
        console.warn(`[Rule:${rule.id}]`, e)
      }
      const count = (this._fireCounts.get(rule.id) ?? 0) + 1
      this._fireCounts.set(rule.id, count)
      this._lastFired.set(rule.id, api.time)
      if (rule.maxFires && count >= rule.maxFires) rule.enabled = false
    }
  }

  getFireCount (id) { return this._fireCounts.get(id) ?? 0 }

  reset () {
    this._fireCounts.clear()
    this._lastFired.clear()
    for (const r of this._rules.values()) {
      r.enabled = r._initialEnabled ?? true
    }
  }

  _cooldownOk (rule, now) {
    if (!rule.cooldownMs) return true
    const last = this._lastFired.get(rule.id) ?? -Infinity
    return (now - last) * 1000 >= rule.cooldownMs
  }

  _maxFiresOk (rule) {
    if (!rule.maxFires) return true
    return (this._fireCounts.get(rule.id) ?? 0) < rule.maxFires
  }
}
