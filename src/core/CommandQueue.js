/**
 * CommandQueue — accumulates commands from rules, resolves field conflicts,
 * then drains to EntityManager once per tick.
 *
 * Conflict resolution per field:
 *   'override'   — last writer (highest priority) wins
 *   'merge-add'  — Vector2 or number summed across all writers
 *   'merge-min'  — lowest value wins
 *   'merge-max'  — highest value wins
 *   'merge-avg'  — average of all values
 */
export class CommandQueue {
  constructor () {
    /** @type {Array} */
    this._queue = []
    /** @type {Map<string, Array>} */
    this._modifyBatch = new Map()
  }

  /** @param {import('./types.js').Command} cmd */
  push (cmd) {
    if (cmd.type === 'MODIFY_BALL' || cmd.type === 'MODIFY_CIRCLE') {
      const key = `${cmd.type}::${cmd.id}`
      if (!this._modifyBatch.has(key)) this._modifyBatch.set(key, [])
      this._modifyBatch.get(key).push(cmd)
      return
    }
    this._queue.push(cmd)
  }

  /**
   * Resolve all batched MODIFY commands and return everything.
   * @param {Record<string, string>} [fieldConfig] — per-field patch mode overrides
   * @returns {Array}
   */
  drain (fieldConfig = {}) {
    const resolved = []

    for (const [, cmds] of this._modifyBatch) {
      const base = cmds[0]
      const merged = this._resolve(cmds, fieldConfig)
      resolved.push({ type: base.type, id: base.id, patch: merged, mode: 'override', priority: 0 })
    }
    this._modifyBatch.clear()

    const all = [...this._queue.splice(0), ...resolved]
    return all
  }

  /**
   * Promote a rule-emitted EMIT_EVENT command into a full child event.
   * @param {object} base
   * @param {import('./types.js').SimEvent} parent
   * @returns {import('./types.js').SimEvent}
   */
  makeChildEvent (base, parent) {
    return {
      ...base,
      id:       `${parent.id}-c-${Math.random().toString(36).slice(2, 7)}`,
      depth:    parent.depth + 1,
      originId: parent.originId ?? parent.id,
      parentId: parent.id
    }
  }

  _resolve (cmds, fieldConfig) {
    const allFields = new Set(cmds.flatMap(c => Object.keys(c.patch)))
    const result = {}

    for (const field of allFields) {
      const mode   = fieldConfig[field] ?? cmds[0].mode ?? 'override'
      const values = cmds
        .filter(c => field in c.patch)
        .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
        .map(c => c.patch[field])

      result[field] = applyMode(values, mode)
    }
    return result
  }
}

function applyMode (values, mode) {
  if (values.length === 1) return values[0]
  switch (mode) {
    case 'override':  return values.at(-1)
    case 'merge-add': {
      const first = values[0]
      if (typeof first === 'object' && first !== null && 'x' in first) {
        return values.reduce((s, v) => ({ x: s.x + v.x, y: s.y + v.y }), { x: 0, y: 0 })
      }
      return values.reduce((s, v) => s + v, 0)
    }
    case 'merge-min': return Math.min(...values)
    case 'merge-max': return Math.max(...values)
    case 'merge-avg': return values.reduce((s, v) => s + v, 0) / values.length
    default:          return values.at(-1)
  }
}
