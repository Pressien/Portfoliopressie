import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'

function blenderCamQuaternion(child) {
  return child.quaternion.clone()
}

export function loadRoom(scene) {
  return new Promise((resolve) => {
    const loader = new GLTFLoader()

    loader.load('/models/room.glb', (gltf) => {
      scene.add(gltf.scene)

      let laptop = null
      let contactMesh = null

      let laptopCamPosition = new THREE.Vector3()
      let laptopCamQuaternion = new THREE.Quaternion()
      let laptopCamFov = null

      let phoneCamPosition = new THREE.Vector3()
      let phoneCamQuaternion = new THREE.Quaternion()
      let phoneCamFov = null

      let roomCamPosition = new THREE.Vector3()
      let roomCamQuaternion = new THREE.Quaternion()
      let roomCamFov = null

      gltf.scene.traverse((child) => {
        if (child.name === "Laptop") laptop = child
        if (child.name === "contact") contactMesh = child

        if (child.name === "roomcam") {
          roomCamPosition.copy(child.position)
          roomCamQuaternion.copy(blenderCamQuaternion(child))
          if (child.fov) roomCamFov = child.fov
        }

        if (child.name === "laptopcam") {
          laptopCamPosition.copy(child.position)
          laptopCamQuaternion.copy(blenderCamQuaternion(child))
          if (child.fov) laptopCamFov = child.fov
        }

        if (child.name === "phonecam") {
          phoneCamPosition.copy(child.position)
          phoneCamQuaternion.copy(blenderCamQuaternion(child))
          if (child.fov) phoneCamFov = child.fov
        }
      })

      resolve({
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
      })
    })
  })
}
