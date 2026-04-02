import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const STRATA_COLORS = [
  '#3B2F2F', // dark earth surface
  '#5C4033', // raw umber
  '#6B4423', // burnt sienna deep
  '#8B6914', // dark goldenrod
  '#4A3728', // deep brown
  '#2F1E0E', // very dark earth
  '#1A0F05', // abyssal depth
];

export default function StrataBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x1a0f05, 1);
    container.appendChild(renderer.domElement);

    // Ambient + directional light (overcast daylight feel)
    const ambientLight = new THREE.AmbientLight(0x8b7355, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xd4c5a9, 0.8);
    dirLight.position.set(2, 5, 3);
    scene.add(dirLight);

    // Create strata layers as wide planes at different depths
    const strataGroup = new THREE.Group();
    STRATA_COLORS.forEach((color, i) => {
      const geometry = new THREE.PlaneGeometry(20, 2.5, 32, 8);
      // Warp vertices for organic look
      const positions = geometry.attributes.position;
      for (let j = 0; j < positions.count; j++) {
        const x = positions.getX(j);
        const y = positions.getY(j);
        positions.setZ(j, Math.sin(x * 0.8 + i) * 0.15 + Math.cos(y * 1.2 + i * 0.5) * 0.1);
      }
      geometry.computeVertexNormals();

      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: 0.95,
        metalness: 0.05,
        flatShading: true,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = 4 - i * 2;
      mesh.position.z = -2 - i * 0.3;
      strataGroup.add(mesh);
    });
    scene.add(strataGroup);

    // Floating excavation tools
    const tools: THREE.Mesh[] = [];

    // Trowel
    const trowelGroup = new THREE.Group();
    const bladeGeom = new THREE.ConeGeometry(0.15, 0.5, 4);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.4, metalness: 0.7 });
    const blade = new THREE.Mesh(bladeGeom, bladeMat);
    blade.rotation.z = Math.PI;
    trowelGroup.add(blade);
    const handleGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.35, 8);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x5C4033, roughness: 0.8 });
    const handle = new THREE.Mesh(handleGeom, handleMat);
    handle.position.y = 0.4;
    trowelGroup.add(handle);
    trowelGroup.position.set(-3, 2, 1);
    trowelGroup.rotation.set(0.3, 0.2, -0.5);
    scene.add(trowelGroup);

    // Brush
    const brushGroup = new THREE.Group();
    const ferruleGeom = new THREE.CylinderGeometry(0.06, 0.08, 0.15, 8);
    const ferruleMat = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.3, metalness: 0.8 });
    const ferrule = new THREE.Mesh(ferruleGeom, ferruleMat);
    brushGroup.add(ferrule);
    const bristleGeom = new THREE.CylinderGeometry(0.08, 0.1, 0.2, 12);
    const bristleMat = new THREE.MeshStandardMaterial({ color: 0xC4A35A, roughness: 0.9 });
    const bristle = new THREE.Mesh(bristleGeom, bristleMat);
    bristle.position.y = -0.17;
    brushGroup.add(bristle);
    const brushHandleGeom = new THREE.CylinderGeometry(0.035, 0.04, 0.5, 8);
    const brushHandle = new THREE.Mesh(brushHandleGeom, handleMat.clone());
    brushHandle.position.y = 0.3;
    brushGroup.add(brushHandle);
    brushGroup.position.set(3.5, -1, 1.5);
    brushGroup.rotation.set(-0.2, 0.5, 0.8);
    scene.add(brushGroup);

    // Grid stake
    const stakeGeom = new THREE.CylinderGeometry(0.025, 0.015, 0.8, 6);
    const stakeMat = new THREE.MeshStandardMaterial({ color: 0xFF6600, roughness: 0.5, metalness: 0.3 });
    const stake = new THREE.Mesh(stakeGeom, stakeMat);
    stake.position.set(2, 3, 0.8);
    stake.rotation.set(0.4, 0, 0.3);
    scene.add(stake);

    // String between stakes
    const stringGeom = new THREE.CylinderGeometry(0.005, 0.005, 1.5, 4);
    const stringMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.9 });
    const string = new THREE.Mesh(stringGeom, stringMat);
    string.position.set(1.5, 3.1, 0.8);
    string.rotation.z = Math.PI / 2 + 0.1;
    scene.add(string);

    const stake2 = stake.clone();
    stake2.position.set(0.5, 3, 0.8);
    stake2.rotation.set(0.3, 0.2, -0.2);
    scene.add(stake2);

    tools.push(blade, ferrule, bristle, stake, stake2);

    // Floating particles (dust/soil particles)
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 150;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: 0xC4A35A,
      transparent: true,
      opacity: 0.4,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Scroll tracking
    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);

    // Animation
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Parallax on tools based on mouse
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      trowelGroup.rotation.x = 0.3 + my * 0.1;
      trowelGroup.rotation.y = 0.2 + mx * 0.15;
      trowelGroup.position.y = 2 + Math.sin(elapsed * 0.5) * 0.15;

      brushGroup.rotation.x = -0.2 + my * 0.08;
      brushGroup.rotation.y = 0.5 + mx * 0.12;
      brushGroup.position.y = -1 + Math.sin(elapsed * 0.4 + 1) * 0.12;

      stake.rotation.x = 0.4 + my * 0.05;
      stake2.rotation.x = 0.3 + my * 0.05;

      // Slow drift for strata based on scroll
      const scrollOffset = scrollY * 0.0005;
      strataGroup.position.y = scrollOffset * 2;

      // Particle drift
      particles.rotation.y = elapsed * 0.02;
      const positions = particleGeometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        const iy = positions.getY(i);
        positions.setY(i, iy + Math.sin(elapsed + i) * 0.001);
      }
      positions.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="strata-background" />;
}
