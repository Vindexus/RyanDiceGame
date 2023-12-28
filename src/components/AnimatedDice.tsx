import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {Texture} from "three";
import { ManaDie, ManaDieFace } from '../lib/mana';

type Face = {
	texture: Texture
}

export type Props = {
	die: ManaDie
}

export default function AnimatedDice (props: Props) {
	const icons = props.faces || ['fire', 'ice', 'shock', 'death', 'earth', 'magic']
  const [activeFace, setActiveFace] = useState<ManaDieFace>();

	while (icons.length < 6) {
		icons.push('uncertainty') // TODO: Get a blank one
	}

  const canvasRef = useRef<HTMLDivElement>();

  // Constants
  const defaultCameraX = 0;
  const defaultCameraY = 0;
  const defaultCameraZ = 1.5;
  // const floorWidth = 10;
  const dieWidth = 1;

  useEffect(() => {
    const div = canvasRef.current

    if (!div) {
      return
		}

    if (div.children.length > 0) {
      return;
    }

    const sizes = {
      width: div.clientWidth,
      height: div.clientHeight
    };

    const handleResize = () => {
      // Update sizes
      sizes.width = div.clientWidth;
      sizes.height = div.clientHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    };

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 25);
    camera.position.x = defaultCameraX;
    camera.position.y = defaultCameraY;
    camera.position.z = defaultCameraZ;
    scene.add(camera);

    // Controls
    const controls = new OrbitControls(camera, div);
    controls.enableDamping = true;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.setSize(div.clientWidth, div.clientHeight);
    div.appendChild(renderer.domElement);

    window.addEventListener('resize', handleResize);

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader();
		const faces : Face[] = icons.map((fd) : Face => {
			return {
				texture: textureLoader.load('/textures/' + fd + '.png'),
			}
		})

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

    /**
     * Dice
     */
    // Geometries
    const planeGeometry = new THREE.PlaneGeometry(dieWidth, dieWidth)

    // Materials
    // const floorMaterial = new THREE.MeshBasicMaterial({ color: '#5A4A46' });

    // Constructing the die out of individual Planes
    const die = new THREE.Group();

    const meshes = faces.map((face) => {
      const side = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({ map: face.texture}));
      return side
		})

    // Postition the planes to create a cube
    meshes[0].rotation.x = Math.PI * 0.5;

    meshes[1].position.y = dieWidth * 0.5;
    meshes[1].position.z = - dieWidth * 0.5;
    meshes[1].rotation.y = Math.PI;

    meshes[2].position.y = dieWidth * 0.5;
    meshes[2].position.z = dieWidth * 0.5;

    meshes[3].position.y = dieWidth * 0.5;
    meshes[3].position.x = - dieWidth * 0.5;
    meshes[3].rotation.y = - Math.PI * 0.5;

    meshes[4].position.y = dieWidth * 0.5;
    meshes[4].position.x = dieWidth * 0.5;
    meshes[4].rotation.y = Math.PI * 0.5;

    meshes[5].position.y = dieWidth;
    meshes[5].rotation.x = - Math.PI * 0.5;

    die.add(...meshes);

    die.position.y = -0.5;

    // Minimum roations to reach all sides FROM dieSide1:
    // die.rotation.y = Math.PI; // dieSide2
    // die.rotation.y = Math.PI * 0.5; // dieSide3
    // die.rotation.y = Math.PI * 2; // dieSide4
    // die.rotation.y = - Math.PI * 0.5; // dieSide5
    // die.rotation.x = Math.PI * 0.5; // dieSide6

    scene.add(die);

    /**
     * Rolling Animations
    /**


     * Floor
     */

    /*const floor = new THREE.Mesh(new THREE.PlaneGeometry(floorWidth, floorWidth), floorMaterial);

    floor.position.y = -1;
    floor.rotation.x = - Math.PI * 0.5;*/

    //scene.add(floor);

    const animate = () => {
      // const elapsedTime = clock.getElapsedTime()

      // Update controls
      controls.update()

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

  return <div style={{height: '100%', width: '100%'}} ref={canvasRef} />;
}
