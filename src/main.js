import GUI from 'lil-gui'
import { SimulationLoop }  from './core/SimulationLoop.js'
import { Canvas2DRenderer } from './rendering/Canvas2DRenderer.js'
import { allPresets }      from './presets/index.js'

// ─── Canvas setup ────────────────────────────────────────────────────────────

const canvas = document.createElement('canvas')
document.body.appendChild(canvas)

const resize = () => {
  canvas.width  = window.innerWidth
  canvas.height = window.innerHeight
}
resize()
window.addEventListener('resize', resize)

// ─── Simulation ──────────────────────────────────────────────────────────────

const sim = new SimulationLoop({
  seed:    42,
  physics: { gravity: 0, drag: 0, timeStep: 1 / 60, timeScale: 1 }
})

const renderer = new Canvas2DRenderer(canvas)
sim.renderer   = renderer

// ─── GUI ─────────────────────────────────────────────────────────────────────

const gui = new GUI({ title: 'Simulation' })
gui.domElement.style.cssText = 'position:fixed;top:8px;right:8px;z-index:100;'

const state = {
  preset:     allPresets[0].name,
  timeScale:  1,
  gravity:    0,
  drag:       0.001,
  trails:     true,
  hud:        true,
  paused:     false,
  stepOnce () { if (state.paused) sim.stepOnce() },
  reload () {
    const preset = allPresets.find(p => p.name === state.preset)
    if (preset) loadPreset(preset)
  }
}

const presetNames = allPresets.map(p => p.name)
gui.add(state, 'preset', presetNames).name('Preset').onChange(name => {
  const preset = allPresets.find(p => p.name === name)
  if (preset) loadPreset(preset)
})
gui.add(state, 'reload').name('Reload Preset')

const physicsFolder = gui.addFolder('Physics')
physicsFolder.add(state, 'timeScale', 0.1, 4, 0.1).name('Time Scale').onChange(v => {
  sim.physics.cfg.timeScale = v
})
physicsFolder.add(state, 'gravity', -500, 500, 10).name('Gravity').onChange(v => {
  sim.physics.cfg.gravity = v
})
physicsFolder.add(state, 'drag', 0, 0.02, 0.001).name('Drag').onChange(v => {
  sim.physics.cfg.drag = v
})

const renderFolder = gui.addFolder('Rendering')
renderFolder.add(state, 'trails').name('Trails').onChange(v => { renderer.showTrails  = v })
renderFolder.add(state, 'hud').name('HUD').onChange(v => { renderer.showMetrics = v })

const playFolder = gui.addFolder('Playback')
playFolder.add(state, 'paused').name('Paused').onChange(v => {
  v ? sim.stop() : sim.start()
})
playFolder.add(state, 'stepOnce').name('Step Once')

const RAD_TO_DEG = 180 / Math.PI
const DEG_TO_RAD = Math.PI / 180

let _dynamicFolders = []

function ensureTemplateSpeed (spec) {
  if (typeof spec._speed !== 'number') {
    spec._speed = Math.sqrt((spec.velocity?.x ?? 0) ** 2 + (spec.velocity?.y ?? 0) ** 2)
  }
}

function applyTemplateSpeedToVelocity (spec) {
  ensureTemplateSpeed(spec)
  const vx = spec.velocity?.x ?? 0
  const vy = spec.velocity?.y ?? 0
  const mag = Math.sqrt(vx * vx + vy * vy)
  if (mag > 1e-6) {
    const scale = spec._speed / mag
    spec.velocity.x = vx * scale
    spec.velocity.y = vy * scale
  } else {
    spec.velocity = { x: spec._speed, y: 0 }
  }
}

function syncTemplateVelocities (preset) {
  for (const spec of (preset.entities?.balls ?? [])) {
    applyTemplateSpeedToVelocity(spec)
  }
}

function buildDynamicGUI (preset) {
  _dynamicFolders.forEach(folder => folder.destroy())
  _dynamicFolders = []

  const circlesFolder = gui.addFolder('Circles')
  _dynamicFolders.push(circlesFolder)
  sim.entities.circleArray().forEach((circle, index) => {
    const circleFolder = circlesFolder.addFolder(`Circle ${index + 1}`)
    circleFolder.add(circle, 'radius', 30, 800, 1).name('Radius').onChange(v => { circle.radius = v })
    circleFolder.add(circle, 'rotationSpeed', -0.08, 0.08, 0.0005).name('Rotation Speed').onChange(v => { circle.rotationSpeed = v })
    circleFolder.add(circle, 'thickness', 1, 50, 1).name('Thickness').onChange(v => { circle.thickness = v })

    if (Array.isArray(circle.gaps) && circle.gaps.length > 0) {
      const gapFolder = circleFolder.addFolder('Gap')
      const gap = circle.gaps[0]
      const sizeProxy = { sizeDeg: (gap.endAngle - gap.startAngle) * RAD_TO_DEG }
      const centerProxy = { centerDeg: ((gap.startAngle + gap.endAngle) / 2) * RAD_TO_DEG }

      gapFolder.add(sizeProxy, 'sizeDeg', 1, 360, 1).name('Gap Size °').onChange(v => {
        const center = (gap.startAngle + gap.endAngle) / 2
        const halfRad = (v * DEG_TO_RAD) / 2
        gap.startAngle = center - halfRad
        gap.endAngle = center + halfRad
        centerProxy.centerDeg = ((gap.startAngle + gap.endAngle) / 2) * RAD_TO_DEG
      })

      gapFolder.add(centerProxy, 'centerDeg', -360, 360, 1).name('Gap Center °').onChange(v => {
        const size = gap.endAngle - gap.startAngle
        const center = v * DEG_TO_RAD
        gap.startAngle = center - size / 2
        gap.endAngle = center + size / 2
        sizeProxy.sizeDeg = (gap.endAngle - gap.startAngle) * RAD_TO_DEG
      })
    }
  })

  const ballTemplatesFolder = gui.addFolder('Ball Templates')
  _dynamicFolders.push(ballTemplatesFolder)
  ;(preset.entities?.balls ?? []).forEach((spec, index) => {
    ensureTemplateSpeed(spec)
    const ballFolder = ballTemplatesFolder.addFolder(`Ball ${index + 1}`)
    ballFolder.add(spec, 'radius', 2, 80, 1).name('Radius')
    ballFolder.add(spec, 'mass', 0.1, 20, 0.1).name('Mass')
    ballFolder.add(spec, 'restitution', 0, 1, 0.01).name('Restitution')
    ballFolder.add(spec, '_speed', 0, 40, 0.1).name('Speed')
    ballFolder.add({
      applyToLive: () => {
        applyTemplateSpeedToVelocity(spec)
        const commands = sim.entities.ballArray().map(ball => ({
          type: 'MODIFY_BALL',
          id: ball.id,
          patch: {
            radius: spec.radius,
            mass: spec.mass,
            restitution: spec.restitution
          },
          mode: 'override',
          priority: 0
        }))
        if (commands.length > 0) {
          sim.entities.apply(commands, sim.bus, sim.tick, sim.time)
        }
      }
    }, 'applyToLive').name('Apply to Live')
  })

  const rulesFolder = gui.addFolder('Rules')
  _dynamicFolders.push(rulesFolder)
  ;(preset.rules ?? [])
    .filter(rule => Array.isArray(rule.guiSchema) && rule.guiSchema.length > 0)
    .forEach(rule => {
      const ruleFolder = rulesFolder.addFolder(rule.id)
      ruleFolder.add(rule, 'enabled').name('Enabled')
      for (const param of rule.guiSchema) {
        ruleFolder
          .add(rule.cfg, param.key, param.min, param.max, param.step)
          .name(param.label)
      }
    })

  const monitorSources = (preset.monitors ?? [])
    .filter(monitor => Array.isArray(monitor.guiSchema) && monitor.guiSchema.length > 0)
  if (monitorSources.length > 0) {
    const monitorsFolder = gui.addFolder('Monitors')
    _dynamicFolders.push(monitorsFolder)
    monitorSources.forEach(monitor => {
      const monitorFolder = monitorsFolder.addFolder(monitor.id)
      for (const param of monitor.guiSchema) {
        monitorFolder
          .add(monitor.cfg, param.key, param.min, param.max, param.step)
          .name(param.label)
      }
    })
  }
}

// ─── Load preset & start ─────────────────────────────────────────────────────

function loadPreset (preset) {
  syncTemplateVelocities(preset)
  sim.loadPreset(preset)
  state.gravity = preset.physics?.gravity ?? 0
  state.drag = preset.physics?.drag ?? 0.001
  state.timeScale = preset.physics?.timeScale ?? 1
  sim.physics.cfg.timeScale = state.timeScale
  gui.controllersRecursive().forEach(c => c.updateDisplay())
  buildDynamicGUI(preset)
  sim.start()
}

loadPreset(allPresets[0])
