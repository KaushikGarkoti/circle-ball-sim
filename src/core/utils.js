// ── Math & utility helpers ──────────────────────────────────────────────────

let _id = 0
export const uuid = () => `e${++_id}`

export const v2 = (x, y) => ({ x, y })
export const addV  = (a, b) => ({ x: a.x + b.x, y: a.y + b.y })
export const subV  = (a, b) => ({ x: a.x - b.x, y: a.y - b.y })
export const scaleV = (v, s) => ({ x: v.x * s, y: v.y * s })
export const dotV  = (a, b) => a.x * b.x + a.y * b.y
export const mag2  = (v) => v.x * v.x + v.y * v.y
export const mag   = (v) => Math.sqrt(mag2(v))
export const normV = (v) => { const m = mag(v); return m ? scaleV(v, 1 / m) : v2(0, 0) }
export const dist  = (a, b) => mag(subV(b, a))
export const midV  = (a, b) => v2((a.x + b.x) / 2, (a.y + b.y) / 2)
export const avg   = (ns) => ns.length ? ns.reduce((s, v) => s + v, 0) / ns.length : 0
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
export const lerpN = (a, b, t) => a + (b - a) * t

export const kineticEnergy = (mass, velocity) => 0.5 * mass * mag2(velocity)

/** Seeded PRNG — Mulberry32. Same seed = identical simulation. */
export const createRNG = (seed) => {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6D2B79F5) >>> 0
    let t = Math.imul(s ^ s >>> 15, 1 | s)
    t = (t + Math.imul(t ^ t >>> 7, 61 | t)) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

/**
 * Is `angle` inside the arc [startAngle, endAngle] after applying `rotation`?
 * All in radians.
 */
export const angleInArc = (angle, arc, rotation) => {
  const TAU = Math.PI * 2
  const a = ((angle - rotation) % TAU + TAU) % TAU
  const s = (arc.startAngle % TAU + TAU) % TAU
  const e = (arc.endAngle   % TAU + TAU) % TAU
  return s <= e ? (a >= s && a <= e) : (a >= s || a <= e)
}

/** Random velocity at a given speed, optionally biased toward a base angle. */
export const randomVelocity = (rng, speed, biasAngle = null, spread = Math.PI) => {
  const base  = biasAngle ?? rng() * Math.PI * 2
  const angle = base + (rng() - 0.5) * spread * 2
  return v2(Math.cos(angle) * speed, Math.sin(angle) * speed)
}

/** Dominant key in a Record<string, number>. */
export const dominantKey = (map) => {
  let best = null, bestVal = -Infinity
  for (const [k, v] of Object.entries(map)) {
    if (v > bestVal) { bestVal = v; best = k }
  }
  return best
}
