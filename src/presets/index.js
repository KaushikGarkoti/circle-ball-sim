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

// ─── Preset: Explosive Chaos ─────────────────────────────────────────────────
// Aggressive growth + split reactions. Designed for fast escalation.

export const explosiveChaosPreset = {
  name: 'Explosive Chaos',
  description: 'High-growth chain reactions with stronger split and escape spawning.',
  seed: 99,
  physics: { gravity: 0, drag: 0.0005, timeStep: 1 / 60, timeScale: 1.15 },
  entities: {
    circles: [{
      center: { x: 0, y: 0 },
      radius: 280,
      rotationSpeed: 0.005,
      gaps: [{ startAngle: -0.18, endAngle: 0.18 }],
      thickness: 5
    }],
    balls: [
      { position: { x: -80, y: -20 }, velocity: { x: 7.2, y: 3.8 }, radius: 20, mass: 1.6, restitution: 0.96 },
      { position: { x: 85, y: 15 }, velocity: { x: -6.8, y: -4.2 }, radius: 19, mass: 1.5, restitution: 0.96 },
      { position: { x: 0, y: -95 }, velocity: { x: 2.5, y: 7.4 }, radius: 18, mass: 1.3, restitution: 0.96 }
    ]
  },
  rules: [
    spawnOnEscape(3, 0.78, 140),
    splitOnCollision(170, 5),
    chargeOnCollision(120),
    chargedEmitsEnergy(170),
    decayToNormal(150),
    growGapOnEscape(0.06, 1.8),
    shrinkOnOverload(6, 90)
  ],
  monitors: [overloadMonitor(120), energyMonitor(14000, 120), phaseTransitionMonitor()]
}

// ─── Preset: Particle Bloom ──────────────────────────────────────────────────
// Starts sparse, then blooms rapidly via escape spawning and gap growth.

export const particleBloomPreset = {
  name: 'Particle Bloom',
  description: 'Swarm bloom with escalating escape-driven multiplication.',
  seed: 111,
  physics: { gravity: 0, drag: 0.0006, timeStep: 1 / 60, timeScale: 1.1 },
  entities: {
    circles: [{
      center: { x: 0, y: 0 },
      radius: 285,
      rotationSpeed: 0.008,
      gaps: [{ startAngle: -0.14, endAngle: 0.14 }],
      thickness: 5
    }],
    balls: [
      { position: { x: -25, y: -90 }, velocity: { x: 6.8, y: 3.2 }, radius: 16, mass: 1.0, restitution: 0.97 }
    ]
  },
  rules: [
    spawnOnEscape(4, 0.74, 170),
    growGapOnEscape(0.07, 2.1),
    shrinkOnOverload(7, 95)
  ],
  monitors: [overloadMonitor(145), energyMonitor(11000, 110)]
}

// ─── Preset: Fission Reactor ─────────────────────────────────────────────────
// Collision-heavy chain fission with charged pulses.

export const fissionReactorPreset = {
  name: 'Fission Reactor',
  description: 'Collision fission chains with high-energy charged pulses.',
  seed: 222,
  physics: { gravity: 0, drag: 0.0004, timeStep: 1 / 60, timeScale: 1.2 },
  entities: {
    circles: [{
      center: { x: 0, y: 0 },
      radius: 275,
      rotationSpeed: 0.004,
      gaps: [],
      thickness: 5
    }],
    balls: [
      { position: { x: -95, y: 0 }, velocity: { x: 8.4, y: 1.2 }, radius: 21, mass: 1.9, restitution: 0.95 },
      { position: { x: 95, y: 0 }, velocity: { x: -8.1, y: -1.4 }, radius: 21, mass: 1.9, restitution: 0.95 },
      { position: { x: 0, y: -70 }, velocity: { x: 0.7, y: 8.2 }, radius: 18, mass: 1.4, restitution: 0.95 }
    ]
  },
  rules: [
    splitOnCollision(130, 4),
    chargeOnCollision(90),
    chargedEmitsEnergy(190),
    decayToNormal(180),
    shrinkOnOverload(6, 90)
  ],
  monitors: [overloadMonitor(150), energyMonitor(17000, 120), phaseTransitionMonitor()]
}

// ─── Preset: Pulse Breather ──────────────────────────────────────────────────
// Alternates between expansion and correction with strong threshold transitions.

export const pulseBreatherPreset = {
  name: 'Pulse Breather',
  description: 'Expands in bursts, then self-corrects through overload pressure.',
  seed: 333,
  physics: { gravity: 10, drag: 0.0012, timeStep: 1 / 60, timeScale: 1.05 },
  entities: {
    circles: [{
      center: { x: 0, y: 0 },
      radius: 270,
      rotationSpeed: 0.006,
      gaps: [{ startAngle: Math.PI - 0.12, endAngle: Math.PI + 0.12 }],
      thickness: 5
    }],
    balls: [
      { position: { x: -40, y: -95 }, velocity: { x: 6.5, y: 4.0 }, radius: 17, mass: 1.1, restitution: 0.95 },
      { position: { x: 45, y: -85 }, velocity: { x: -6.2, y: 3.7 }, radius: 17, mass: 1.1, restitution: 0.95 }
    ]
  },
  rules: [
    spawnOnEscape(3, 0.76, 150),
    splitOnCollision(160, 5),
    growGapOnEscape(0.05, 1.7),
    shrinkOnOverload(12, 105),
    decayToNormal(140)
  ],
  monitors: [overloadMonitor(120), energyMonitor(9000, 160), phaseTransitionMonitor()]
}

// ─── Preset: Singularity Ring ────────────────────────────────────────────────
// Gravity-heavy orbital chaos with a narrow escape slit.

export const singularityRingPreset = {
  name: 'Singularity Ring',
  description: 'Strong gravity ring with rare escapes and violent rebounds.',
  seed: 444,
  physics: { gravity: 260, drag: 0.0018, timeStep: 1 / 60, timeScale: 1 },
  entities: {
    circles: [{
      center: { x: 0, y: 0 },
      radius: 250,
      rotationSpeed: 0.013,
      gaps: [{ startAngle: -0.08, endAngle: 0.08 }],
      thickness: 6
    }],
    balls: [
      { position: { x: -20, y: -70 }, velocity: { x: 9.2, y: 0.3 }, radius: 15, mass: 1.0, restitution: 0.97 },
      { position: { x: 30, y: -60 }, velocity: { x: -8.8, y: 0.9 }, radius: 15, mass: 1.0, restitution: 0.97 }
    ]
  },
  rules: [
    spawnOnEscape(2, 0.82, 120),
    chargeOnCollision(110),
    chargedEmitsEnergy(160),
    decayToNormal(120),
    growGapOnEscape(0.03, 1.1),
    shrinkOnOverload(8, 92)
  ],
  monitors: [overloadMonitor(95), energyMonitor(13000, 90), phaseTransitionMonitor()]
}

// ─── Preset: Entropy Sink ────────────────────────────────────────────────────
// Dramatic starts but heavily damped; charged states burn out quickly.

export const entropySinkPreset = {
  name: 'Entropy Sink',
  description: 'Fast chaotic start that damps into low-energy churn.',
  seed: 555,
  physics: { gravity: 0, drag: 0.0045, timeStep: 1 / 60, timeScale: 1.05 },
  entities: {
    circles: [{
      center: { x: 0, y: 0 },
      radius: 280,
      rotationSpeed: 0.003,
      gaps: [{ startAngle: Math.PI / 2 - 0.1, endAngle: Math.PI / 2 + 0.1 }],
      thickness: 5
    }],
    balls: [
      { position: { x: -70, y: -20 }, velocity: { x: 7.0, y: 4.2 }, radius: 19, mass: 1.5, restitution: 0.9 },
      { position: { x: 70, y: 20 }, velocity: { x: -6.8, y: -4.1 }, radius: 19, mass: 1.5, restitution: 0.9 },
      { position: { x: 0, y: -110 }, velocity: { x: 0.6, y: 7.8 }, radius: 17, mass: 1.2, restitution: 0.9 }
    ]
  },
  rules: [
    splitOnCollision(150, 5),
    chargeOnCollision(100),
    chargedEmitsEnergy(120),
    decayToNormal(70),
    removeOnLowEnergy(2200)
  ],
  monitors: [overloadMonitor(120), energyMonitor(7000, 220), phaseTransitionMonitor()]
}

// ─── Preset: Escape Conveyor ─────────────────────────────────────────────────
// Rotationally driven one-way escape stream around the ring.

export const escapeConveyorPreset = {
  name: 'Escape Conveyor',
  description: 'Fast rotating gap creates directional escape conveyor streams.',
  seed: 666,
  physics: { gravity: 0, drag: 0.0008, timeStep: 1 / 60, timeScale: 1.15 },
  entities: {
    circles: [{
      center: { x: 0, y: 0 },
      radius: 275,
      rotationSpeed: 0.02,
      gaps: [{ startAngle: -0.11, endAngle: 0.11 }],
      thickness: 5
    }],
    balls: [
      { position: { x: -35, y: -90 }, velocity: { x: 7.8, y: 2.4 }, radius: 16, mass: 1.0, restitution: 0.96 },
      { position: { x: 25, y: -70 }, velocity: { x: 6.9, y: 3.4 }, radius: 16, mass: 1.0, restitution: 0.96 }
    ]
  },
  rules: [
    spawnOnEscape(3, 0.75, 160),
    growGapOnEscape(0.045, 1.5),
    chargeOnCollision(105),
    chargedEmitsEnergy(145),
    decayToNormal(110),
    shrinkOnOverload(8, 95)
  ],
  monitors: [overloadMonitor(130), energyMonitor(12500, 120)]
}

// ─── Preset: Critical Mass ───────────────────────────────────────────────────
// Lives near overload boundary and oscillates around the limit.

export const criticalMassPreset = {
  name: 'Critical Mass',
  description: 'Hovers near overload threshold with unstable population swings.',
  seed: 777,
  physics: { gravity: 0, drag: 0.001, timeStep: 1 / 60, timeScale: 1.1 },
  entities: {
    circles: [{
      center: { x: 0, y: 0 },
      radius: 270,
      rotationSpeed: 0.005,
      gaps: [{ startAngle: -0.13, endAngle: 0.13 }],
      thickness: 5
    }],
    balls: [
      { position: { x: -80, y: -10 }, velocity: { x: 7.2, y: 2.8 }, radius: 18, mass: 1.3, restitution: 0.95 },
      { position: { x: 80, y: 12 }, velocity: { x: -7.1, y: -2.6 }, radius: 18, mass: 1.3, restitution: 0.95 }
    ]
  },
  rules: [
    spawnOnEscape(3, 0.79, 180),
    splitOnCollision(170, 5),
    chargeOnCollision(115),
    chargedEmitsEnergy(150),
    decayToNormal(130),
    shrinkOnOverload(11, 100)
  ],
  monitors: [overloadMonitor(135), energyMonitor(12000, 110), phaseTransitionMonitor()]
}

// ─── Preset: Aftershock Mode ─────────────────────────────────────────────────
// Collision shocks propagate outward through repeated charged emissions.

export const aftershockModePreset = {
  name: 'Aftershock Mode',
  description: 'Collision aftershocks cascade through charged pulse propagation.',
  seed: 888,
  physics: { gravity: 0, drag: 0.0007, timeStep: 1 / 60, timeScale: 1.2 },
  entities: {
    circles: [{
      center: { x: 0, y: 0 },
      radius: 285,
      rotationSpeed: 0.004,
      gaps: [],
      thickness: 5
    }],
    balls: [
      { position: { x: -100, y: 0 }, velocity: { x: 8.9, y: 0 }, radius: 21, mass: 1.8, restitution: 0.96 },
      { position: { x: 100, y: 0 }, velocity: { x: -8.9, y: 0 }, radius: 21, mass: 1.8, restitution: 0.96 },
      { position: { x: 0, y: -95 }, velocity: { x: 0.4, y: 8.6 }, radius: 17, mass: 1.2, restitution: 0.96 }
    ]
  },
  rules: [
    splitOnCollision(120, 4),
    chargeOnCollision(80),
    chargedEmitsEnergy(220),
    decayToNormal(170),
    shrinkOnOverload(6, 92)
  ],
  monitors: [overloadMonitor(160), energyMonitor(18000, 120), phaseTransitionMonitor()]
}

// ─── Preset: Metastable Twin-Ring ────────────────────────────────────────────
// Nested rings exchange population; inner escapes feed outer congestion.

export const metastableTwinRingPreset = {
  name: 'Metastable Twin-Ring',
  description: 'Nested rings transfer escaping balls into congested outer flow.',
  seed: 999,
  physics: { gravity: 120, drag: 0.0016, timeStep: 1 / 60, timeScale: 1.05 },
  entities: {
    circles: [
      {
        center: { x: 0, y: 0 },
        radius: 155,
        rotationSpeed: 0.014,
        gaps: [{ startAngle: -0.12, endAngle: 0.12 }],
        thickness: 4
      },
      {
        center: { x: 0, y: 0 },
        radius: 300,
        rotationSpeed: -0.006,
        gaps: [{ startAngle: Math.PI - 0.16, endAngle: Math.PI + 0.16 }],
        thickness: 5
      }
    ],
    balls: [
      { position: { x: 0, y: -55 }, velocity: { x: 7.5, y: 0.9 }, radius: 14, mass: 1.0, restitution: 0.93 },
      { position: { x: -25, y: -40 }, velocity: { x: 6.3, y: 2.4 }, radius: 14, mass: 1.0, restitution: 0.93 }
    ]
  },
  rules: [
    spawnOnEscape(2, 0.86, 145),
    splitOnCollision(180, 5),
    chargeOnCollision(120),
    chargedEmitsEnergy(150),
    decayToNormal(140),
    growGapOnEscape(0.035, 1.25),
    shrinkOnOverload(9, 100)
  ],
  monitors: [overloadMonitor(125), energyMonitor(13000, 130), phaseTransitionMonitor()]
}

// ─── Preset: Auto-Reset Arena ────────────────────────────────────────────────
// Repeated life-cycle runs: growth, collapse, extinction, seeded restart.

export const autoResetArenaPreset = {
  name: 'Auto-Reset Arena',
  description: 'Cycles from explosive growth into wipe-and-reseed resets.',
  seed: 1234,
  physics: { gravity: 0, drag: 0.0015, timeStep: 1 / 60, timeScale: 1.1 },
  entities: {
    circles: [{
      center: { x: 0, y: 0 },
      radius: 270,
      rotationSpeed: 0.007,
      gaps: [{ startAngle: Math.PI / 3 - 0.14, endAngle: Math.PI / 3 + 0.14 }],
      thickness: 5
    }],
    balls: [
      { position: { x: -20, y: -85 }, velocity: { x: 7.3, y: 2.8 }, radius: 17, mass: 1.2, restitution: 0.95 }
    ]
  },
  rules: [
    spawnOnEscape(4, 0.73, 165),
    splitOnCollision(150, 5),
    chargeOnCollision(95),
    chargedEmitsEnergy(170),
    decayToNormal(110),
    growGapOnEscape(0.05, 1.6),
    removeOnLowEnergy(1800)
  ],
  monitors: [overloadMonitor(140), energyMonitor(15000, 260), phaseTransitionMonitor()]
}

export const allPresets = [
  escapistPreset,
  chaosPreset,
  gravityPreset,
  explosiveChaosPreset,
  particleBloomPreset,
  fissionReactorPreset,
  pulseBreatherPreset,
  singularityRingPreset,
  entropySinkPreset,
  escapeConveyorPreset,
  criticalMassPreset,
  aftershockModePreset,
  metastableTwinRingPreset,
  autoResetArenaPreset
]
