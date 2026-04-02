import { useState, useRef } from 'react';
import gsap from 'gsap';
import type { Artifact } from '../types';
import ArtifactShapeSVG from './ArtifactShapes';
import LabAnalysisModal from './LabAnalysisModal';
import styles from '../styles/ArtifactCard.module.css';

interface Props {
  artifact: Artifact;
  index: number;
}

export default function ArtifactCard({ artifact, index }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [fieldNoteVisible, setFieldNoteVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setFieldNoteVisible(true);
    if (shapeRef.current) {
      gsap.to(shapeRef.current, {
        rotateX: -8,
        rotateY: 6,
        y: -12,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseLeave = () => {
    setFieldNoteVisible(false);
    if (shapeRef.current) {
      gsap.to(shapeRef.current, {
        rotateX: 0,
        rotateY: 0,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  };

  const isEven = index % 2 === 0;

  return (
    <>
      <div
        ref={cardRef}
        className={`${styles.card} ${isEven ? styles.cardLeft : styles.cardRight}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setModalOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setModalOpen(true)}
      >
        {/* Artifact shape illustration */}
        <div ref={shapeRef} className={styles.artifactShape}>
          <ArtifactShapeSVG shape={artifact.shape} />
        </div>

        {/* Specimen label */}
        <div className={styles.specimenLabel}>
          <div className={styles.labelHeader}>
            <span className={styles.specimenId}>
              SPEC. #{String(index + 1).padStart(3, '0')}
            </span>
            {artifact.isPinned && (
              <span className={styles.pinnedBadge}>★ PRIORITY</span>
            )}
          </div>

          <h3 className={styles.artifactName}>{artifact.name}</h3>

          <div className={styles.labelGrid}>
            <div className={styles.labelField}>
              <span className={styles.fieldLabel}>EXCAVATION DATE</span>
              <span className={styles.fieldValue}>{artifact.excavationDate}</span>
            </div>
            <div className={styles.labelField}>
              <span className={styles.fieldLabel}>CONDITION</span>
              <span className={styles.fieldValue}>{artifact.conditionRating}</span>
            </div>
            <div className={styles.labelField}>
              <span className={styles.fieldLabel}>MATERIAL</span>
              <span className={styles.fieldValue}>{artifact.materialComposition}</span>
            </div>
            <div className={styles.labelField}>
              <span className={styles.fieldLabel}>DEPTH</span>
              <span className={styles.fieldValue}>{artifact.depth}</span>
            </div>
          </div>

          <p className={styles.catalogEntry}>{artifact.catalogEntry}</p>

          <div className={styles.labelFooter}>
            <span className={styles.siteRef}>SITE: DEAD RECKONING</span>
            <span className={styles.clickHint}>↗ FULL ANALYSIS</span>
          </div>
        </div>

        {/* Field note slide-in */}
        <div className={`${styles.fieldNote} ${fieldNoteVisible ? styles.fieldNoteVisible : ''}`}>
          <div className={styles.fieldNoteContent}>
            <span className={styles.fieldNoteLabel}>FIELD NOTE</span>
            <p>
              {artifact.topics.length > 0
                ? `Associated markers: ${artifact.topics.join(', ')}`
                : 'No associated contextual markers recovered.'}
            </p>
            <p className={styles.fieldNoteLanguage}>
              Primary composition: {artifact.language}
            </p>
          </div>
        </div>
      </div>

      {modalOpen && (
        <LabAnalysisModal
          artifact={artifact}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
