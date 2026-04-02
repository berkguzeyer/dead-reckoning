import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import styles from '../styles/EasterEgg.module.css';

interface Props {
  onClose: () => void;
}

export default function EasterEgg({ onClose }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    // Three.js particle explosion
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Particle system
    const particleCount = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities: number[] = [];
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.5) * Math.PI;
      const speed = 0.5 + Math.random() * 2;
      velocities.push(
        Math.cos(angle) * Math.cos(elevation) * speed,
        Math.sin(elevation) * speed,
        Math.sin(angle) * Math.cos(elevation) * speed
      );

      // Orange/amber/sienna particles
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.4; colors[i * 3 + 2] = 0;
      } else if (colorChoice < 0.7) {
        colors[i * 3] = 0.8; colors[i * 3 + 1] = 0.55; colors[i * 3 + 2] = 0.15;
      } else {
        colors[i * 3] = 0.6; colors[i * 3 + 1] = 0.35; colors[i * 3 + 2] = 0.1;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 1,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let frame = 0;
    const maxFrames = 120;

    const animate = () => {
      if (frame >= maxFrames) {
        renderer.dispose();
        return;
      }

      frame++;
      const progress = frame / maxFrames;
      material.opacity = 1 - progress;

      const posAttr = geometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        posAttr.setX(i, posAttr.getX(i) + velocities[i * 3] * 0.02);
        posAttr.setY(i, posAttr.getY(i) + velocities[i * 3 + 1] * 0.02 - 0.001 * frame);
        posAttr.setZ(i, posAttr.getZ(i) + velocities[i * 3 + 2] * 0.02);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Animate in the classified content
    gsap.fromTo(overlayRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, delay: 0.3, ease: 'back.out(1.5)' }
    );

    return () => {
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div ref={canvasRef} className={styles.particleCanvas} />
      <div ref={overlayRef} className={styles.classified} onClick={(e) => e.stopPropagation()}>
        <div className={styles.topSecret}>
          <span className={styles.stampRotated}>CLASSIFIED</span>
        </div>

        <h3 className={styles.title}>PROJECT ████████</h3>

        <div className={styles.redactedContent}>
          <p>
            Recovered from stratum ████ at coordinates ██.████°N, ██.████°W.
            Initial analysis suggests ████████████ of unprecedented
            ████████████ complexity.
          </p>
          <p>
            The specimen exhibits properties consistent with ████████
            ████████████, though its true purpose remains
            ████████████████████████.
          </p>
          <p className={styles.warning}>
            ⚠ CLEARANCE LEVEL: OMEGA-7 REQUIRED
          </p>
        </div>

        <div className={styles.footer}>
          <span>FILE: DR-████-██</span>
          <span>STATUS: [REDACTED]</span>
        </div>

        <button className={styles.closeBtn} onClick={onClose}>
          SEAL FILE
        </button>
      </div>
    </div>
  );
}
