import { dist } from './utils.js'

/**
 * SpatialIndex — uniform grid for O(1) average-case nearby queries.
 * Rebuilt from scratch every tick (cheap for < 1000 entities).
 */
export class SpatialIndex {
  /** @param {number} [cellSize=60] */
  constructor (cellSize = 60) {
    this._cell = cellSize
    /** @type {Map<string, object[]>} */
    this._grid = new Map()
    this._balls   = []
    this._circles = []
  }

  /**
   * Rebuild index from current entity state.
   * @param {object[]} balls
   * @param {object[]} circles
   */
  rebuild (balls, circles) {
    this._grid.clear()
    this._balls   = balls
    this._circles = circles
    for (const b of balls)   this._insert(b,      b.position)
    for (const c of circles) this._insert(c, c.center)
  }

  /**
   * All entities within `radius` pixels of `position`.
   * @param {{ x: number, y: number }} position
   * @param {number} radius
   * @returns {object[]}
   */
  queryNearby (position, radius) {
    const results = new Set()
    const cells   = this._cellsInRadius(position, radius)
    for (const key of cells) {
      for (const e of (this._grid.get(key) ?? [])) {
        const pos = e.position ?? e.center
        if (dist(pos, position) <= radius) results.add(e)
      }
    }
    return [...results]
  }

  /**
   * Nearby balls only; uses squared distance checks to avoid sqrt cost.
   * @param {{ x: number, y: number }} position
   * @param {number} radius
   * @returns {object[]}
   */
  queryNearbyBalls (position, radius) {
    const radiusSq = radius * radius
    const results = new Set()
    const cells = this._cellsInRadius(position, radius)
    for (const key of cells) {
      for (const e of (this._grid.get(key) ?? [])) {
        if (e.type !== 'BALL') continue
        const dx = e.position.x - position.x
        const dy = e.position.y - position.y
        if ((dx * dx + dy * dy) <= radiusSq) results.add(e)
      }
    }
    return [...results]
  }

  /**
   * All balls currently inside `circle`.
   * @param {object} circle
   * @returns {object[]}
   */
  queryInsideCircle (circle) {
    return this.queryNearby(circle.center, circle.radius)
      .filter(e => e.type === 'BALL')
  }

  /**
   * All entities with a given tag, optionally within a proximity.
   * @param {string} tag
   * @param {{ position: object, radius: number }} [near]
   * @returns {object[]}
   */
  queryByTag (tag, near = null) {
    const pool = near
      ? this.queryNearby(near.position, near.radius)
      : [...this._balls, ...this._circles]
    return pool.filter(e => e.tags?.has(tag))
  }

  /**
   * All balls in a given state.
   * @param {string} state
   * @returns {object[]}
   */
  queryByState (state) {
    return this._balls.filter(b => b.state === state)
  }

  _insert (entity, pos) {
    const key = this._key(pos)
    if (!this._grid.has(key)) this._grid.set(key, [])
    this._grid.get(key).push(entity)
  }

  _key ({ x, y }) {
    return `${Math.floor(x / this._cell)},${Math.floor(y / this._cell)}`
  }

  _cellsInRadius (pos, radius) {
    const keys = []
    const span = Math.ceil(radius / this._cell)
    const cx   = Math.floor(pos.x / this._cell)
    const cy   = Math.floor(pos.y / this._cell)
    for (let dx = -span; dx <= span; dx++) {
      for (let dy = -span; dy <= span; dy++) {
        keys.push(`${cx + dx},${cy + dy}`)
      }
    }
    return keys
  }
}
