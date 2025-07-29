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
    text: 'Hello Three.js'
}

// GUI controls
gui.add(textConfig, 'text').name('Text').onChange(() => {
    createText()
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
const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

for(let i = 0; i < 100; i++)
    {
        const donut = new THREE.Mesh(donutGeometry, textMaterial)
        
        // Create a more attractive distribution around the text
        const angle = Math.random() * Math.PI * 2
        const radius = Math.random() * 8 + 2 // Distance from center (2-10 units)
        const height = (Math.random() - 0.5) * 6 // Height variation
        
        donut.position.x = Math.cos(angle) * radius
        donut.position.y = height
        donut.position.z = Math.sin(angle) * radius - 3 // Keep behind text
        
        donut.rotation.x = Math.random() * Math.PI
        donut.rotation.y = Math.random() * Math.PI
        donut.rotation.z = Math.random() * Math.PI
        
        const scale = Math.random() * 0.8 + 0.3 // Scale between 0.3 and 1.1
        donut.scale.set(scale, scale, scale)
        
        scene.add(donut)
    }

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