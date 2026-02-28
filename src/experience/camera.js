// src/experience/camera.js
import * as THREE from 'three'

export function createCamera() {
  // Create a PerspectiveCamera
  const camera = new THREE.PerspectiveCamera(
    75,                                // FOV
    window.innerWidth / window.innerHeight, // aspect ratio
    0.1,                               // near plane
    100                                // far plane
  )

  camera.position.set(0, 2, 6)        // initial position
  camera.lookAt(0, 1, 0)              // look at center of room
  return camera
}