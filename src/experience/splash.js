// src/experience/splash.js

export function initSplash() {
  return new Promise((resolve) => {
    const splash = document.getElementById('splash')
    const barFill = document.getElementById('splashBarFill')
    const loadingText = document.getElementById('splashLoadingText')
    const enterBtn = document.getElementById('splashEnter')
    const aboutPanel = document.getElementById('aboutPanel')
    const instructions = document.getElementById('instructions')

    // Skip splash if returning from projects/contact page
    const params = new URLSearchParams(window.location.search)
    if (params.get('skip') === 'true') {
      splash.style.display = 'none'
      if (aboutPanel) aboutPanel.style.display = 'block'
      if (instructions) instructions.style.display = 'flex'
      resolve()
      return
    }

    const messages = [
      'LOADING ASSETS...',
      'BUILDING ROOM...',
      'CALIBRATING LIGHTS...',
      'INITIALIZING CAMERAS...',
      'READY.',
    ]

    let progress = 0
    let msgIndex = 0

    const interval = setInterval(() => {
      progress += Math.random() * 12
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        barFill.style.width = '100%'
        loadingText.textContent = 'READY.'
        setTimeout(() => {
          enterBtn.style.display = 'inline-block'
        }, 400)
      } else {
        barFill.style.width = progress + '%'
        const newIndex = Math.floor((progress / 100) * messages.length)
        if (newIndex !== msgIndex && newIndex < messages.length) {
          msgIndex = newIndex
          loadingText.textContent = messages[msgIndex]
        }
      }
    }, 120)

    enterBtn.addEventListener('click', () => {
      splash.classList.add('hidden')
      setTimeout(() => {
        splash.style.display = 'none'
        if (aboutPanel) aboutPanel.style.display = 'block'
        if (instructions) instructions.style.display = 'flex'
        resolve()
      }, 800)
    })
  })
}
