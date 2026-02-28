// src/main.js
import './style.css'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

import { createScene } from './experience/scene'
import { createCamera } from './experience/camera'
import { createRenderer } from './experience/renderer'
import { createControls } from './experience/controls'
import { loadRoom } from './experience/loader'
import { setupInteraction } from './experience/interaction'
import { setupUI } from './experience/ui'
import { initSplash } from './experience/splash'

// Scene
const { scene, deskGlow, dollLight } = createScene()

// Camera
const camera = createCamera()

// Renderer
const renderer = createRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Controls
const controls = createControls(camera, renderer)
controls.enableDamping = true

// Clock
const clock = new THREE.Clock()

// Postprocessing
const composer = new EffectComposer(renderer)
composer.setSize(window.innerWidth, window.innerHeight)
composer.addPass(new RenderPass(scene, camera))

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.1, 0.2, 0.9
)
composer.addPass(bloomPass)

// Load room
async function init() {
  const {
    laptop,
    contactMesh,
    laptopCamPosition,
    laptopCamQuaternion,
    laptopCamFov,
    phoneCamPosition,
    phoneCamQuaternion,
    phoneCamFov,
    roomCamPosition,
    roomCamQuaternion,
    roomCamFov
  } = await loadRoom(scene)

  // Set initial view from Blender's roomcam
  if (roomCamPosition) {
    camera.position.copy(roomCamPosition)
    camera.quaternion.copy(roomCamQuaternion)

    if (roomCamFov) {
      camera.fov = roomCamFov
      camera.updateProjectionMatrix()
    }

    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(roomCamQuaternion)
    controls.target.copy(roomCamPosition).addScaledVector(forward, 3)
    controls.update()
  }

  // Wait for splash screen [ ENTER ] click before showing room
  await initSplash()

  if (laptop) {
    setupInteraction(
      camera,
      scene,
      laptop,
      contactMesh,
      laptopCamPosition,
      laptopCamQuaternion,
      laptopCamFov,
      phoneCamPosition,
      phoneCamQuaternion,
      phoneCamFov,
      controls
    )
  } else {
    console.warn("Room not fully loaded — interactions disabled")
  }
}

init()

// UI
setupUI(controls, camera)

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth, window.innerHeight)
})

// Animate loop
function animate() {
  requestAnimationFrame(animate)

  const t = clock.getElapsedTime()

  if (deskGlow) deskGlow.intensity = 1.0 + Math.sin(t * 3) * 0.2
  if (dollLight) dollLight.intensity = 1.8 + Math.sin(t * 5 + 1) * 0.2

  controls.update()
  composer.render()
}

animate()
