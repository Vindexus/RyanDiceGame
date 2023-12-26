import * as THREE from 'three';
import { useEffect, useRef } from 'react';

export default function AnimatedDice () {
  const canvasRef = useRef();

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 25);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    canvasRef.current.appendChild(renderer.domElement);
  }, []);
};
