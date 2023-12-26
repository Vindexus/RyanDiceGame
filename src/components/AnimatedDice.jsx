import * as THREE from 'three';
import { useEffect, useRef } from 'react';

export default function AnimatedDice () {
  const canvasRef = useRef();

  useEffect(() => {
    const sizes = {
      width: canvasRef.current.clientWidth,
      height: canvasRef.current.clientHeight
    };

    const handleResize = () => {
      // Update sizes
      sizes.width = canvasRef.current.clientWidth;
      sizes.height = canvasRef.current.clientHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    };

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 25);
    camera.position.y = 2.5;
    camera.position.z = 2;
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    canvasRef.current.appendChild(renderer.domElement);

    window.addEventListener('resize', handleResize);

    /**
     * Textures
     */
    // const textureLoader = new THREE.TextureLoader();
    // const fireTexture = textureLoader.load('/textures/fire.png');
    // const iceTexture = textureLoader.load('/textures/ice.png');
    // const shockTexture = textureLoader.load('/textures/earth.png');
    // const earthTexture = textureLoader.load('/textures/shock.png');
    // const deathTexture = textureLoader.load('/textures/magic.png');
    // const magicTexture = textureLoader.load('/textures/death.png');

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
    const floorMaterial = new THREE.MeshBasicMaterial({ color: '#5A4A46' });

    // Constructing the die out of individual Planes
    const die = new THREE.Group();

    const dieSide1 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial());
    const dieSide2 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial());
    const dieSide3 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial());
    const dieSide4 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial());
    const dieSide5 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial());
    const dieSide6 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial());

    // Postition the planes to create a cube
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
    // die.rotation.y = Math.PI; // dieSide2
    // die.rotation.y = Math.PI * 0.5; // dieSide3
    // die.rotation.y = Math.PI * 2; // dieSide4
    // die.rotation.y = - Math.PI * 0.5; // dieSide5
    // die.rotation.x = Math.PI * 0.5; // dieSide6

    scene.add(die);

    /**
     * Floor
     */

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(floorWidth, floorWidth), floorMaterial);

    floor.position.y = -1;
    floor.rotation.x = - Math.PI * 0.5;

    scene.add(floor);

    const animate = () => {
      // const elapsedTime = clock.getElapsedTime()

      // Render
      renderer.render(scene, camera)

      // Call animate again on the next frame
      window.requestAnimationFrame(animate)
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div style={{height: '200px'}}ref={canvasRef} />;
}
