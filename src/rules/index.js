import { mag2 } from '../core/utils.js'

export const spawnOnEscape = (count = 2, radiusScale = 0.7, maxBalls = 60) => {
  const rule = {
    id: 'spawn-on-escape',
    cfg: { count, radiusScale, maxBalls },
    guiSchema: [
      { key: 'count', label: 'Spawn Count', min: 1, max: 6, step: 1 },
      { key: 'radiusScale', label: 'Radius Scale', min: 0.3, max: 1.0, step: 0.01 },
      { key: 'maxBalls', label: 'Max Balls', min: 5, max: 5000, step: 5 }
    ],
    triggers: ['BALL_ESCAPE_CIRCLE'],
    enabled: true,
    action (event, api, commands) {
      const { count, radiusScale, maxBalls } = rule.cfg
      const { ball, circle } = event.context
      if (!ball || !circle) return
      if (api.entities.getBalls().size >= maxBalls) {
        commands.push({ type: 'REMOVE_BALL', id: ball.id })
        return
      }
      commands.push({ type: 'REMOVE_BALL', id: ball.id })
      const speed = Math.sqrt(mag2(ball.velocity))
      for (let i = 0; i < count; i++) {
        const angle = api.rng() * Math.PI * 2
        const spd = speed * (0.6 + api.rng() * 0.6)
        commands.push({
          type: 'SPAWN_BALL',
          spec: {
            position: {
              x: circle.center.x + (api.rng() - 0.5) * circle.radius * 0.5,
              y: circle.center.y + (api.rng() - 0.5) * circle.radius * 0.5
            },
            velocity: { x: Math.cos(angle) * spd, y: Math.sin(angle) * spd },
            radius: Math.max(5, ball.radius * radiusScale),
            mass: ball.mass * (radiusScale ** 2),
            restitution: ball.restitution,
            tags: new Set(ball.tags),
            state: 'normal'
          }
        })
      }
    }
  }
  return rule
}

export const splitOnCollision = (energyThreshold = 300, minRadius = 6) => {
  const rule = {
    id: 'split-on-collision',
    cfg: { energyThreshold, minRadius },
    guiSchema: [
      { key: 'energyThreshold', label: 'Energy Threshold', min: 10, max: 1000, step: 10 },
      { key: 'minRadius', label: 'Min Radius', min: 2, max: 25, step: 1 }
    ],
    triggers: ['BALL_BALL_COLLISION'],
    enabled: true,
    condition (event) {
      return (event.context.energy ?? 0) > rule.cfg.energyThreshold
    },
    action (event, api, commands) {
      const { minRadius } = rule.cfg
      const { ballA, ballB } = event.context
      for (const ball of [ballA, ballB]) {
        if (!ball || ball.radius < minRadius) continue
        commands.push({ type: 'REMOVE_BALL', id: ball.id })
        for (let i = 0; i < 2; i++) {
          const angle = api.rng() * Math.PI * 2
          const speed = Math.sqrt(mag2(ball.velocity)) * 0.75
          commands.push({
            type: 'SPAWN_BALL',
            spec: {
              position: {
                x: ball.position.x + Math.cos(angle) * ball.radius * 0.6,
                y: ball.position.y + Math.sin(angle) * ball.radius * 0.6
              },
              velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
              radius: ball.radius * 0.65,
              mass: ball.mass * 0.5,
              restitution: ball.restitution,
              tags: new Set(ball.tags),
              state: 'normal'
            }
          })
        }
      }
    }
  }
  return rule
}

export const chargeOnCollision = (energyThreshold = 150) => {
  const rule = {
    id: 'charge-on-collision',
    cfg: { energyThreshold },
    guiSchema: [
      { key: 'energyThreshold', label: 'Energy Threshold', min: 10, max: 500, step: 10 }
    ],
    triggers: ['BALL_BALL_COLLISION'],
    enabled: true,
    condition (event) {
      return (event.context.energy ?? 0) > rule.cfg.energyThreshold
    },
    action (event, api, commands) {
      for (const ball of [event.context.ballA, event.context.ballB]) {
        if (!ball) continue
        commands.push({
          type: 'MODIFY_BALL',
          id: ball.id,
          patch: { state: 'charged' },
          mode: 'override',
          priority: 0
        })
      }
    }
  }
  return rule
}

export const chargedEmitsEnergy = (emitRadius = 120) => {
  const rule = {
    id: 'charged-emit-energy',
    cfg: { emitRadius },
    guiSchema: [
      { key: 'emitRadius', label: 'Emit Radius', min: 20, max: 300, step: 5 }
    ],
    triggers: ['BALL_WALL_COLLISION'],
    enabled: true,
    condition (event) {
      return event.context.ball?.state === 'charged'
    },
    action (event, api, commands) {
      const { emitRadius } = rule.cfg
      const { ball } = event.context
      if (!ball) return
      const nearby = api.queryNearby(ball.position, emitRadius)
        .filter(e => e.type === 'BALL' && e.id !== ball.id)
      for (const target of nearby) {
        const dx = target.position.x - ball.position.x
        const dy = target.position.y - ball.position.y
        const d = Math.sqrt(dx * dx + dy * dy) || 1
        const force = 0.8 * (1 - d / emitRadius)
        commands.push({
          type: 'MODIFY_BALL',
          id: target.id,
          patch: { velocity: { x: (dx / d) * force, y: (dy / d) * force } },
          mode: 'merge-add',
          priority: 0
        })
      }
      commands.push({
        type: 'MODIFY_BALL',
        id: ball.id,
        patch: { state: 'decaying' },
        mode: 'override',
        priority: 0
      })
    }
  }
  return rule
}

export const decayToNormal = (ticksDecaying = 120) => {
  const rule = {
    id: 'decay-to-normal',
    cfg: { ticksDecaying },
    guiSchema: [
      { key: 'ticksDecaying', label: 'Decay Ticks', min: 10, max: 600, step: 10 }
    ],
    triggers: ['TIME_TICK'],
    enabled: true,
    action (event, api, commands) {
      const { ticksDecaying } = rule.cfg
      for (const ball of api.entities.getBalls().values()) {
        if (ball.state !== 'decaying') continue
        if (!ball._decayTick) ball._decayTick = event.tick
        if (event.tick - ball._decayTick > ticksDecaying) {
          delete ball._decayTick
          commands.push({
            type: 'MODIFY_BALL',
            id: ball.id,
            patch: { state: 'normal' },
            mode: 'override',
            priority: 0
          })
        }
      }
    }
  }
  return rule
}

export const growGapOnEscape = (deltaRad = 0.04, maxGapRad = 1.2) => {
  const rule = {
    id: 'grow-gap-on-escape',
    cfg: { deltaRad, maxGapRad },
    guiSchema: [
      { key: 'deltaRad', label: 'Growth/Escape (rad)', min: 0.005, max: 0.2, step: 0.005 },
      { key: 'maxGapRad', label: 'Max Gap (rad)', min: 0.1, max: 3.14, step: 0.05 }
    ],
    triggers: ['BALL_ESCAPE_CIRCLE'],
    enabled: true,
    action (event, api, commands) {
      const { deltaRad, maxGapRad } = rule.cfg
      const { circle, gap } = event.context
      if (!circle || !gap) return
      const newGaps = circle.gaps.map(g =>
        g === gap
          ? {
              startAngle: g.startAngle - Math.min(deltaRad, (maxGapRad - (g.endAngle - g.startAngle)) / 2),
              endAngle: g.endAngle + Math.min(deltaRad, (maxGapRad - (g.endAngle - g.startAngle)) / 2)
            }
          : g
      )
      commands.push({
        type: 'MODIFY_CIRCLE',
        id: circle.id,
        patch: { gaps: newGaps },
        mode: 'override',
        priority: 0
      })
    }
  }
  return rule
}

export const shrinkOnOverload = (shrinkAmount = 8, minRadius = 80) => {
  const rule = {
    id: 'shrink-on-overload',
    cfg: { shrinkAmount, minRadius },
    guiSchema: [
      { key: 'shrinkAmount', label: 'Shrink Amount', min: 1, max: 50, step: 1 },
      { key: 'minRadius', label: 'Min Radius (px)', min: 30, max: 200, step: 5 }
    ],
    triggers: ['SYSTEM_OVERLOAD'],
    enabled: true,
    action (event, api, commands) {
      const { shrinkAmount, minRadius } = rule.cfg
      for (const [id, circle] of api.entities.getCircles()) {
        if (circle.radius <= minRadius) continue
        commands.push({
          type: 'MODIFY_CIRCLE',
          id,
          patch: { radius: Math.max(minRadius, circle.radius - shrinkAmount) },
          mode: 'override',
          priority: 0
        })
      }
    }
  }
  return rule
}

export const removeOnLowEnergy = (cooldownMs = 3000) => {
  const rule = {
    id: 'remove-on-low-energy',
    cfg: { cooldownMs },
    guiSchema: [],
    triggers: ['LOW_ENERGY_STATE'],
    enabled: true,
    get cooldownMs () {
      return this.cfg.cooldownMs
    },
    action (event, api, commands) {
      for (const [id] of api.entities.getBalls()) {
        commands.push({ type: 'REMOVE_BALL', id })
      }
      const circle = api.entities.circleArray()[0]
      if (!circle) return
      commands.push({
        type: 'SPAWN_BALL',
        spec: {
          position: { x: 0, y: -circle.radius * 0.4 },
          velocity: { x: 4 + api.rng() * 3, y: 2 + api.rng() * 2 },
          radius: 18,
          mass: 1.5,
          restitution: 0.95
        }
      })
    }
  }
  return rule
}
