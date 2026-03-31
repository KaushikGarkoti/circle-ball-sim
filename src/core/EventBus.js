/**
 * EventBus — pure pub/sub, queue-based.
 *
 * Physics enqueues events. At flush time all queued events are dispatched
 * to listeners in FIFO order. Depth > MAX_DEPTH events are dropped and a
 * CHAIN_DEPTH_EXCEEDED event is enqueued instead (rules can react to it).
 */
export class EventBus {
  constructor () {
    /** @type {Map<string, Set<Function>>} */
    this._listeners = new Map()
    /** @type {import('./types.js').SimEvent[]} */
    this._queue = []
    this.MAX_DEPTH    = 8
    this.MAX_PER_TICK = 2000
  }

  /**
   * Subscribe to an event type. Use '*' for all events.
   * @param {string} type
   * @param {Function} fn
   * @returns {Function} unsubscribe
   */
  on (type, fn) {
    if (!this._listeners.has(type)) this._listeners.set(type, new Set())
    this._listeners.get(type).add(fn)
    return () => this._listeners.get(type)?.delete(fn)
  }

  /** @param {import('./types.js').SimEvent} event */
  enqueue (event) {
    this._queue.push(event)
  }

  /**
   * Flush all queued events through the handler, then to persistent listeners.
   * @param {(event: import('./types.js').SimEvent) => void} handler
   */
  flush (handler) {
    const batch = this._queue.splice(0)
    let count = 0

    for (const event of batch) {
      if (++count > this.MAX_PER_TICK) {
        this.enqueue(this._sysEvent(event, 'CHAIN_DEPTH_EXCEEDED', { reason: 'per-tick limit' }))
        break
      }
      if (event.depth > this.MAX_DEPTH) {
        this.enqueue(this._sysEvent(event, 'CHAIN_DEPTH_EXCEEDED', {
          blockedType: event.type,
          depth: event.depth
        }))
        continue
      }

      handler(event)
      this._listeners.get(event.type)?.forEach(fn => fn(event))
      this._listeners.get('*')?.forEach(fn => fn(event))
    }
  }

  _sysEvent (parent, type, extra = {}) {
    return {
      id: `sys-${type}-${Date.now()}`,
      type,
      tick: parent.tick,
      time: parent.time,
      depth: 0,
      originId: parent.originId ?? parent.id,
      context: { entities: [], ...extra }
    }
  }

  /** Remove all listeners and clear queue. */
  reset () {
    this._listeners.clear()
    this._queue = []
  }
}
