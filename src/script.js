import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'



// Create cube render target


/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace
const fontLoader = new FontLoader()
const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

// Text configuration
const textConfig = {
    text: 'Hello Three.js',
    donutsCount: 100
}

// GUI controls
gui.add(textConfig, 'text').name('Text').onChange(() => {
    createText()
})
gui.add(textConfig, 'donutsCount', 0, 200, 1).name('Donuts Count').onChange(() => {
    createDonuts()
})

let textMesh = null

let font = null

const createText = () => {
    if (!font) return
    
    if (textMesh) {
        scene.remove(textMesh)
        textMesh.geometry.dispose()
    }
    
    const textGeometry = new TextGeometry(
        textConfig.text,
        {
            font: font,
            size: 0.5,
            depth: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
        }
    )
    textGeometry.computeBoundingBox()
    textGeometry.center()
    
    textMesh = new THREE.Mesh(textGeometry, textMaterial)
    scene.add(textMesh)
}

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (loadedFont) =>
    {
        font = loadedFont
        createText()
    }
)


const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
let donuts = []

const createDonuts = () => {
    // Remove existing donuts
    donuts.forEach(donut => {
        scene.remove(donut)
    })
    donuts = []
    
    // Create new donuts
    for(let i = 0; i < textConfig.donutsCount; i++) {
        const donut = new THREE.Mesh(donutGeometry, textMaterial)
        
        // Create attractive distribution in layers around the text
        const layer = Math.floor(i / (textConfig.donutsCount / 3)) // 3 layers
        const angle = (i * 137.5) * Math.PI / 180 // Golden angle for spiral distribution
        
        // Different radius ranges for each layer to avoid text overlap
        let radius
        if (layer === 0) {
            radius = Math.random() * 3 + 4 // Inner ring: 4-7 units from center
        } else if (layer === 1) {
            radius = Math.random() * 4 + 7 // Middle ring: 7-11 units
        } else {
            radius = Math.random() * 5 + 11 // Outer ring: 11-16 units
        }
        
        // Height variation with some clustering
        const heightCluster = Math.sin(angle * 3) * 2 // Create height waves
        const height = heightCluster + (Math.random() - 0.5) * 3
        
        // Position donuts in 3D space
        donut.position.x = Math.cos(angle) * radius
        donut.position.y = height
        donut.position.z = Math.sin(angle) * radius
        
        // Add some depth variation to make it more 3D
        donut.position.z += (Math.random() - 0.5) * 8
        
        // Random rotations
        donut.rotation.x = Math.random() * Math.PI
        donut.rotation.y = Math.random() * Math.PI
        donut.rotation.z = Math.random() * Math.PI
        
        // Varied scaling based on distance (closer = smaller, farther = larger)
        const distanceFromCenter = Math.sqrt(donut.position.x ** 2 + donut.position.z ** 2)
        const scale = Math.random() * 0.5 + 0.3 + (distanceFromCenter * 0.02)
        donut.scale.set(scale, scale, scale)
        
        scene.add(donut)
        donuts.push(donut)
    }
}

// Create initial donuts
createDonuts()

/**
 * Object
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

// scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 5
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**ð
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x000000, 1)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
    

/**c
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // cube.position.x = elapsedTime
    cube.rotation.y = elapsedTime
    

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame    
    window.requestAnimationFrame(tick)
}

tick()