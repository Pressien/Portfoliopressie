// src/experience/ui.js
export function setupUI(controls, camera) {
  const backBtn = document.getElementById('backBtn')
  const contactBackBtn = document.getElementById('contactBackBtn')

  function goBack() {
    // Hide both UIs
    const projectUI = document.getElementById('projectUI')
    const contactUI = document.getElementById('contactUI')

    if (projectUI) projectUI.style.display = 'none'
    if (contactUI) contactUI.style.display = 'none'

    // Re-enable controls
    controls.enabled = true

    // Return camera to initial room position
    if (camera) {
      camera.position.set(0, 2, 6)
      camera.lookAt(0, 1, 0)
    }
  }

  if (backBtn) backBtn.addEventListener('click', goBack)
  if (contactBackBtn) contactBackBtn.addEventListener('click', goBack)
}