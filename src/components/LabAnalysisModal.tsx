import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { Artifact } from '../types';
import ArtifactShapeSVG from './ArtifactShapes';
import styles from '../styles/LabAnalysisModal.module.css';

interface Props {
  artifact: Artifact;
  onClose: () => void;
}

export default function LabAnalysisModal({ artifact, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo(contentRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, delay: 0.1, ease: 'power2.out' }
    );

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div ref={overlayRef} className={styles.overlay} onClick={handleOverlayClick}>
      <div ref={contentRef} className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.labLabel}>LAB ANALYSIS REPORT</span>
            <h2 className={styles.title}>{artifact.name}</h2>
          </div>
          <div className={styles.headerShape}>
            <ArtifactShapeSVG shape={artifact.shape} />
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.body}>
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>SPECIMEN CATALOG ENTRY</h4>
            <p className={styles.catalogText}>{artifact.catalogEntry}</p>
          </div>

          <div className={styles.gridSection}>
            <div className={styles.dataField}>
              <span className={styles.dataLabel}>MATERIAL COMPOSITION</span>
              <span className={styles.dataValue}>{artifact.materialComposition}</span>
            </div>
            <div className={styles.dataField}>
              <span className={styles.dataLabel}>PRIMARY LANGUAGE</span>
              <span className={styles.dataValue}>{artifact.language}</span>
            </div>
            <div className={styles.dataField}>
              <span className={styles.dataLabel}>CONDITION ASSESSMENT</span>
              <span className={styles.dataValue}>{artifact.conditionRating}</span>
            </div>
            <div className={styles.dataField}>
              <span className={styles.dataLabel}>EXCAVATION DATE</span>
              <span className={styles.dataValue}>{artifact.excavationDate}</span>
            </div>
            <div className={styles.dataField}>
              <span className={styles.dataLabel}>RECOVERY DEPTH</span>
              <span className={styles.dataValue}>{artifact.depth}</span>
            </div>
            <div className={styles.dataField}>
              <span className={styles.dataLabel}>SITE DESIGNATION</span>
              <span className={styles.dataValue}>DEAD RECKONING</span>
            </div>
          </div>

          {artifact.topics.length > 0 && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>ASSOCIATED MARKERS</h4>
              <div className={styles.topics}>
                {artifact.topics.map((topic) => (
                  <span key={topic} className={styles.topicTag}>{topic}</span>
                ))}
              </div>
            </div>
          )}

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>ARCHIVE LOCATION</h4>
            <a
              href={artifact.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.archiveLink}
            >
              {artifact.url} ↗
            </a>
          </div>
        </div>

        <div className={styles.footer}>
          <span>DEAD RECKONING ARCHAEOLOGICAL SURVEY</span>
          <span>CLASSIFICATION: UNRESTRICTED</span>
        </div>
      </div>
    </div>
  );
}
