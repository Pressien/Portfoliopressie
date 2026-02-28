import * as THREE from 'three'

export function createScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x050008)
  scene.fog = new THREE.FogExp2(0x0d0015, 0.06)

  // Ambient — pink base so everything has a tint
  const ambient = new THREE.AmbientLight(0xffaacc, 0.4)  // lighter pink, dimmer
  scene.add(ambient)

  // Main pink key light from above
  const pinkKey = new THREE.DirectionalLight(0xffaacc, 0.8)  // was 0xff007f, was 1.5

  pinkKey.position.set(-4, 8, 2)
  pinkKey.castShadow = true
  scene.add(pinkKey)

  // Second pink fill from the right so no dark corners
  const pinkFill = new THREE.DirectionalLight(0xffbbdd, 0.5) 
  pinkFill.position.set(4, 5, 3)
  scene.add(pinkFill)

  // Laptop specific light
  const laptopLight = new THREE.SpotLight(0xff00ff, 2, 6, Math.PI / 6, 0.5)
  laptopLight.position.set(0, 3, 2)
  laptopLight.target.position.set(0, 0, 0)
  scene.add(laptopLight)
  scene.add(laptopLight.target)

  // Doll light — moved to the RIGHT side of laptop
  const dollLight = new THREE.PointLight(0xff88dd, 2, 3, 2)
  dollLight.position.set(1.5, 1.2, 1)  // 👈 positive X = right side
  scene.add(dollLight)

  // Desk glow — much dimmer and raised higher
  const deskGlow = new THREE.PointLight(0xff00aa, 0.05, 3, 2)  // 👈 was 1.2, now 0.5
  deskGlow.position.set(0, 2.5, 1)  // 👈 raised even higher
  scene.add(deskGlow)

  // Purple/pink floor bounce
  const floorBounce = new THREE.PointLight(0xcc00ff, 0.8, 6, 2)
  floorBounce.position.set(0, -0.5, 0)
  scene.add(floorBounce)

  // Back wall pink so room feels full
  const backFill = new THREE.DirectionalLight(0xffaacc, 0.4)
  backFill.position.set(0, 4, -5)
  scene.add(backFill)

  return { scene, deskGlow, dollLight }
}