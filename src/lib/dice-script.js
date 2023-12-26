import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
// const gui = new GUI();

// Canvas
// const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const fireTexture = textureLoader.load('/textures/fire.png');
const iceTexture = textureLoader.load('/textures/ice.png');
const shockTexture = textureLoader.load('/textures/earth.png');
const earthTexture = textureLoader.load('/textures/shock.png');
const deathTexture = textureLoader.load('/textures/magic.png');
const magicTexture = textureLoader.load('/textures/death.png');

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 50);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

/**
 * OBJECTS
 */
// Constants
const floorWidth = 10;
const dieWidth = 1;

// const dieSides = 6;

/**
 * Dice
 */
// Geometries
const planeGeometry = new THREE.PlaneGeometry(dieWidth, dieWidth)

// Materials
const floorMaterial = new THREE.MeshBasicMaterial({ color: '#5A4A46', side: THREE.DoubleSide });

// Constructing the die out of individual Planes
const die = new THREE.Group();

const dieSide1 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({ map: fireTexture}));
const dieSide2 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({ map: iceTexture}));
const dieSide3 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({ map: earthTexture}));
const dieSide4 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({ map: shockTexture}));
const dieSide5 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({ map: magicTexture}));
const dieSide6 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({ map: deathTexture}));

dieSide1.rotation.x = Math.PI * 0.5;

dieSide2.position.y = dieWidth * 0.5;
dieSide2.position.z = - dieWidth * 0.5;
dieSide2.rotation.y = Math.PI;

dieSide3.position.y = dieWidth * 0.5;
dieSide3.position.z = dieWidth * 0.5;

dieSide4.position.y = dieWidth * 0.5;
dieSide4.position.x = - dieWidth * 0.5;
dieSide4.rotation.y = - Math.PI * 0.5;

dieSide5.position.y = dieWidth * 0.5;
dieSide5.position.x = dieWidth * 0.5;
dieSide5.rotation.y = Math.PI * 0.5;

dieSide6.position.y = dieWidth;
dieSide6.rotation.x = - Math.PI * 0.5;

die.add(dieSide1, dieSide2, dieSide3, dieSide4, dieSide5, dieSide6);

// Minimum roations to reach all sides FROM dieSide1:
// die.rotation.y = Math.PI; // Ice
// die.rotation.y = Math.PI * 0.5; // Earth
// die.rotation.y = Math.PI * 2; // Shock
// die.rotation.y = - Math.PI * 0.5; // Death
// die.rotation.x = Math.PI * 0.5; // Magic
// die.rotation.x = - Math.PI * 0.5; // Fire

scene.add(die);

/**
 * Floor
 */

const floor = new THREE.Mesh(new THREE.PlaneGeometry(floorWidth, floorWidth), floorMaterial);

floor.position.y = -1;
floor.rotation.x = - Math.PI * 0.5;

scene.add(floor);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

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
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// camera.position.x = 1
camera.position.y = 2.5
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
// const clock = new THREE.Clock()

const tick = () =>
{
    // const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
};

tick();

