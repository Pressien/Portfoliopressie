// src/experience/interaction.js
import * as THREE from 'three'

export function setupInteraction(
  camera, scene, laptop, contactMesh,
  laptopCamPosition, laptopCamQuaternion, laptopCamFov,
  phoneCamPosition, phoneCamQuaternion, phoneCamFov,
  controls
) {
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  let isZooming = false
  let activeUI = null

  const targetPosition = new THREE.Vector3()
  const targetQuaternion = new THREE.Quaternion()
  let targetFov = null

  // --- Tooltip element ---
  const tooltip = document.createElement('div')
  tooltip.style.cssText = `
    position: fixed;
    background: rgba(10, 0, 20, 0.85);
    color: #ff2d78;
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 8px 16px;
    border: 1px solid #ff2d78;
    box-shadow: 0 0 14px rgba(255, 45, 120, 0.5);
    pointer-events: none;
    display: none;
    z-index: 999;
    transition: opacity 0.2s;
  `
  document.body.appendChild(tooltip)

  // --- Hover glow: store original emissive per mesh ---
  const originalEmissive = new Map()

  function setHoverGlow(object, on) {
    if (!object) return
    object.traverse((child) => {
      if (child.isMesh && child.material) {
        if (on) {
          if (!originalEmissive.has(child.uuid)) {
            originalEmissive.set(child.uuid, child.material.emissive?.clone() || new THREE.Color(0x000000))
          }
          child.material.emissive = new THREE.Color(0xff2d78)
          child.material.emissiveIntensity = 0.5
        } else {
          if (originalEmissive.has(child.uuid)) {
            child.material.emissive = originalEmissive.get(child.uuid)
            child.material.emissiveIntensity = 0
          }
        }
      }
    })
  }

  let hoveredObject = null

  // --- Mousemove: hover detection ---
  window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouse, camera)

    const clickables = [laptop, contactMesh].filter(Boolean)
    const intersects = raycaster.intersectObjects(clickables, true)

    if (intersects.length > 0) {
      const hit = intersects[0]
      let root = null
      if (laptop && laptop.getObjectById(hit.object.id)) root = laptop
      if (contactMesh && contactMesh.getObjectById(hit.object.id)) root = contactMesh

      if (root !== hoveredObject) {
        // Un-glow previous
        if (hoveredObject) setHoverGlow(hoveredObject, false)
        hoveredObject = root
        setHoverGlow(hoveredObject, true)
      }

      // Show tooltip
      document.body.style.cursor = 'pointer'
      tooltip.style.display = 'block'
      tooltip.style.left = (event.clientX + 16) + 'px'
      tooltip.style.top = (event.clientY - 10) + 'px'
      tooltip.textContent = root === laptop ? '[ View Projects ]' : '[ Contact Me ]'

    } else {
      if (hoveredObject) {
        setHoverGlow(hoveredObject, false)
        hoveredObject = null
      }
      document.body.style.cursor = 'default'
      tooltip.style.display = 'none'
    }
  })

  // --- Click ---
  window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouse, camera)

    // Laptop click → Projects page
    const intersectsLaptop = raycaster.intersectObject(laptop, true)
    if (intersectsLaptop.length > 0) {
      isZooming = true
      controls.enabled = false
      tooltip.style.display = 'none'
      targetPosition.copy(laptopCamPosition)
      targetQuaternion.copy(laptopCamQuaternion)
      targetFov = laptopCamFov
      activeUI = 'project'
    }

    // Contact click → Contact page
    if (contactMesh) {
      const intersectsContact = raycaster.intersectObject(contactMesh, true)
      if (intersectsContact.length > 0) {
        isZooming = true
        controls.enabled = false
        tooltip.style.display = 'none'
        targetPosition.copy(phoneCamPosition)
        targetQuaternion.copy(phoneCamQuaternion)
        targetFov = phoneCamFov
        activeUI = 'contact'
      }
    }
  })

  // --- Zoom animation ---
  function animateZoom() {
    if (isZooming) {
      camera.position.lerp(targetPosition, 0.05)
      camera.quaternion.slerp(targetQuaternion, 0.05)

      if (targetFov) {
        camera.fov += (targetFov - camera.fov) * 0.05
        camera.updateProjectionMatrix()
      }

      if (camera.position.distanceTo(targetPosition) < 0.05) {
        isZooming = false

        if (activeUI === 'project') {
          setTimeout(() => { window.location.href = '/projects.html' }, 800)
        }
        if (activeUI === 'contact') {
          setTimeout(() => { window.location.href = '/contact.html' }, 800)
        }

        activeUI = null
        targetFov = null
      }
    }

    requestAnimationFrame(animateZoom)
  }

  animateZoom()
}