import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from '../styles/EntryAnimation.module.css';

interface Props {
  onComplete: () => void;
}

export default function EntryAnimation({ onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const layers = container.querySelectorAll(`.${styles.soilLayer}`);
    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
        onComplete();
      },
    });

    // Initial state
    gsap.set(layers, { y: 0 });

    // Stagger peel away from top
    tl.to(layers, {
      y: '-110%',
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.inOut',
    }, 0.8);

    // Add subtle horizontal shake to each layer as it peels
    layers.forEach((layer, i) => {
      tl.to(layer, {
        x: (i % 2 === 0 ? 1 : -1) * 8,
        duration: 0.3,
        ease: 'power1.inOut',
      }, 0.8 + i * 0.15);
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={`${styles.soilLayer} ${styles.layer1}`}>
        <div className={styles.soilTexture} />
      </div>
      <div className={`${styles.soilLayer} ${styles.layer2}`}>
        <div className={styles.soilTexture} />
      </div>
      <div className={`${styles.soilLayer} ${styles.layer3}`}>
        <div className={styles.soilTexture} />
      </div>
      <div className={`${styles.soilLayer} ${styles.layer4}`}>
        <div className={styles.soilTexture} />
      </div>
      <div className={`${styles.soilLayer} ${styles.layer5}`}>
        <div className={styles.soilTexture} />
      </div>
      <div className={styles.loadingText}>
        <span className={styles.brushing}>BRUSHING AWAY OVERBURDEN</span>
        <span className={styles.dots}>...</span>
      </div>
    </div>
  );
}
