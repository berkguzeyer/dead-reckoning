import { useEffect, useState, useRef } from 'react';
import styles from '../styles/DepthMeter.module.css';

interface Props {
  onEasterEgg: () => void;
}

const STRATA_LABELS = [
  { depth: 'SURFACE', offset: 0 },
  { depth: '0.3m', offset: 15 },
  { depth: '0.8m', offset: 30 },
  { depth: '1.5m', offset: 45 },
  { depth: '2.4m', offset: 60 },
  { depth: '3.8m', offset: 75 },
  { depth: '5.2m', offset: 90 },
];

export default function DepthMeter({ onEasterEgg }: Props) {
  const [scrollPercent, setScrollPercent] = useState(0);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      setScrollPercent(Math.min(percent, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    clickCountRef.current += 1;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      onEasterEgg();
      return;
    }

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1500);
  };

  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.rail}>
        <div className={styles.track}>
          {/* Tick marks */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={styles.tick}
              style={{ top: `${(i / 19) * 100}%` }}
            />
          ))}

          {/* Depth indicator */}
          <div
            className={styles.indicator}
            style={{ top: `${scrollPercent}%` }}
          >
            <div className={styles.indicatorDot} />
            <span className={styles.indicatorLabel}>
              {scrollPercent < 5 ? 'SURFACE' :
               `${(scrollPercent * 0.055).toFixed(1)}m`}
            </span>
          </div>
        </div>

        {/* Stratum labels on the right */}
        <div className={styles.labels}>
          {STRATA_LABELS.map((stratum) => (
            <div
              key={stratum.depth}
              className={styles.stratumLabel}
              style={{ top: `${stratum.offset}%` }}
            >
              <span className={styles.stratumLine} />
              <span className={styles.stratumText}>{stratum.depth}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.gaugeLabel}>DEPTH</div>
    </div>
  );
}
