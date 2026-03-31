import {
  spawnOnEscape, splitOnCollision, chargeOnCollision,
  chargedEmitsEnergy, decayToNormal, growGapOnEscape,
  shrinkOnOverload, removeOnLowEnergy
} from '../rules/index.js'
import { overloadMonitor, energyMonitor, phaseTransitionMonitor } from '../core/MonitorRegistry.js'

// ─── Preset: The Escapist ────────────────────────────────────────────────────
// One ball, one rotating circle with a gap. Ball escapes → spawns 2 children.
// Gap grows with each escape. Exponential growth until overload shrinks arena.

export const escapistPreset = {
  name:        'The Escapist',
  description: 'Balls multiply on escape. Gap grows. Arena shrinks on overload.',
  seed:        42,
  physics: { gravity: 0, drag: 0.0008, timeStep: 1 / 60, timeScale: 1 },
  entities: {
    circles: [{
      center:        { x: 0, y: 0 },
      radius:        260,
      rotationSpeed: 0.007,
      gaps:          [{ startAngle: -0.12, endAngle: 0.12 }],
      thickness:     5
    }],
    balls: [{
      position:    { x: 0, y: -90 },
      velocity:    { x: 4.5, y: 2 },
      radius:      16,
      mass:        1,
      restitution: 0.97
    }]
  },
  rules:    [spawnOnEscape(2, 0.72, 60), growGapOnEscape(0.035, 1.0), shrinkOnOverload(10, 100)],
  monitors: [overloadMonitor(55), energyMonitor(6000, 100)]
}

// ─── Preset: Chaos Engine ───────────────────────────────────────────────────
// Multiple balls, no gravity. High-energy collisions split balls.
// Balls charge → emit energy pulses → decay → normal.

export const chaosPreset = {
  name:        'Chaos Engine',
  description: 'Balls split on high-energy collisions. Charged balls emit pulses.',
  seed:        7,
  physics: { gravity: 0, drag: 0.001, timeStep: 1 / 60, timeScale: 1 },
  entities: {
    circles: [{
      center:        { x: 0, y: 0 },
      radius:        270,
      rotationSpeed: 0.003,
      gaps:          [],
      thickness:     5
    }],
    balls: [
      { position: { x: -60, y: 0   }, velocity: { x: 5, y: 3    }, radius: 22, mass: 2, restitution: 0.92 },
      { position: { x:  60, y: 0   }, velocity: { x: -4, y: -3  }, radius: 20, mass: 2, restitution: 0.92 },
      { position: { x:   0, y: -80 }, velocity: { x: 2, y: 6    }, radius: 18, mass: 1.5, restitution: 0.92 }
    ]
  },
  rules:    [splitOnCollision(250, 6), chargeOnCollision(150), chargedEmitsEnergy(130), decayToNormal(100)],
  monitors: [overloadMonitor(80), energyMonitor(9000, 150), phaseTransitionMonitor()]
}

// ─── Preset: Gravity Well ────────────────────────────────────────────────────
// Strong gravity. Multiple circles, nested. Ball escapes inner → outer.

export const gravityPreset = {
  name:        'Gravity Well',
  description: 'Gravity + two nested circles. Inner escapees populate the outer.',
  seed:        13,
  physics: { gravity: 180, drag: 0.002, timeStep: 1 / 60, timeScale: 1 },
  entities: {
    circles: [
      {
        center:        { x: 0, y: 0 },
        radius:        150,
        rotationSpeed: 0.012,
        gaps:          [{ startAngle: Math.PI / 2 - 0.15, endAngle: Math.PI / 2 + 0.15 }],
        thickness:     4
      },
      {
        center:        { x: 0, y: 0 },
        radius:        290,
        rotationSpeed: -0.005,
        gaps:          [],
        thickness:     5
      }
    ],
    balls: [{
      position:    { x: 0, y: -60 },
      velocity:    { x: 6, y: 0 },
      radius:      14,
      mass:        1,
      restitution: 0.9
    }]
  },
  rules:    [spawnOnEscape(1, 0.9, 50), removeOnLowEnergy()],
  monitors: [overloadMonitor(45), energyMonitor(5000, 80)]
}

export const allPresets = [escapistPreset, chaosPreset, gravityPreset]
