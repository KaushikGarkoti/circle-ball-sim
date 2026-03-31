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

  stepOnce () { if (state.paused) sim.stepOnce() }
}

// Preset selector
const presetNames = allPresets.map(p => p.name)
gui.add(state, 'preset', presetNames).name('Preset').onChange(name => {
  const preset = allPresets.find(p => p.name === name)
  if (preset) loadPreset(preset)
})

// Physics controls
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

// Rendering controls
const renderFolder = gui.addFolder('Rendering')
renderFolder.add(state, 'trails').name('Trails').onChange(v => { renderer.showTrails  = v })
renderFolder.add(state, 'hud').name('HUD').onChange(v => { renderer.showMetrics = v })

// Playback controls
const playFolder = gui.addFolder('Playback')
playFolder.add(state, 'paused').name('Paused').onChange(v => {
  v ? sim.stop() : sim.start()
})
playFolder.add(state, 'stepOnce').name('Step Once')

// Reload current preset
gui.add({ reload: () => loadPreset(allPresets.find(p => p.name === state.preset)) }, 'reload').name('Reload Preset')

// ─── Load preset & start ─────────────────────────────────────────────────────

function loadPreset (preset) {
  sim.loadPreset(preset)
  // Sync GUI sliders to preset physics values
  state.gravity   = preset.physics?.gravity   ?? state.gravity
  state.drag      = preset.physics?.drag      ?? state.drag
  state.timeScale = preset.physics?.timeScale ?? state.timeScale
  sim.physics.cfg.timeScale = state.timeScale
  gui.controllersRecursive().forEach(c => c.updateDisplay())
  sim.start()
}

loadPreset(allPresets[0])
