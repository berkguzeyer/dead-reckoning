import { useEffect, useState } from 'react';
import { fetchUserProfile } from '../services/github';
import styles from '../styles/ResearcherProfile.module.css';

export default function ResearcherProfile() {
  const [profile, setProfile] = useState<{
    fieldExperience: number;
    specializations: string[];
  }>({
    fieldExperience: 5,
    specializations: ['TypeScript', 'JavaScript', 'React', 'Python'],
  });

  useEffect(() => {
    fetchUserProfile().then((data) => {
      if (data) {
        const created = new Date(data.createdAt);
        const years = Math.floor(
          (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
        );
        setProfile({
          fieldExperience: years,
          specializations: data.languages.length > 0 ? data.languages : profile.specializations,
        });
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className={styles.section}>
      <div className={styles.dossier}>
        <div className={styles.header}>
          <span className={styles.label}>FIELD RESEARCHER DOSSIER</span>
          <span className={styles.classification}>CLASSIFICATION: PUBLIC</span>
        </div>

        <div className={styles.divider} />

        <div className={styles.content}>
          <div className={styles.row}>
            <span className={styles.fieldName}>NAME</span>
            <span className={styles.fieldValue}>
              <span className={styles.primaryName}>Berk Guzeyer</span>
            </span>
          </div>

          <div className={styles.row}>
            <span className={styles.fieldName}>CLASSIFICATION</span>
            <span className={styles.fieldValue}>Frontend Software Engineer</span>
          </div>

          <div className={styles.row}>
            <span className={styles.fieldName}>FIELD EXPERIENCE</span>
            <span className={styles.fieldValue}>
              {profile.fieldExperience} years active fieldwork
            </span>
          </div>

          <div className={styles.row}>
            <span className={styles.fieldName}>KNOWN SPECIALIZATIONS</span>
            <div className={styles.specList}>
              {profile.specializations.map((spec) => (
                <span key={spec} className={styles.specTag}>{spec}</span>
              ))}
            </div>
          </div>

          <div className={styles.row}>
            <span className={styles.fieldName}>CURRENT ASSIGNMENT</span>
            <span className={styles.fieldValue}>
              DEAD RECKONING — Archaeological Digital Survey
            </span>
          </div>

          <div className={styles.row}>
            <span className={styles.fieldName}>STATUS</span>
            <span className={`${styles.fieldValue} ${styles.statusActive}`}>
              <span className={styles.statusDot} />
              ACTIVE IN FIELD
            </span>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Hand-drawn style signature */}
        <div className={styles.signatureBlock}>
          <svg viewBox="0 0 300 60" className={styles.signature}>
            <path
              d="M20 40 C30 20, 40 20, 50 35 C55 42, 60 38, 65 30 Q70 22, 80 28 C90 35, 85 42, 95 38 L100 36 M110 25 C115 22, 120 28, 118 35 C116 42, 125 42, 130 38 M140 30 Q145 22, 150 30 Q155 38, 160 30 M165 25 L165 42 M165 32 L175 32 M180 25 L180 42 M185 30 Q190 22, 195 30 Q200 38, 205 30 M210 25 C215 22, 220 28, 218 35 C216 42, 225 42, 230 38 M240 28 Q245 22, 248 30 L250 42 L255 28"
              fill="none"
              stroke="#3B2F2F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.7"
            />
          </svg>
          <span className={styles.signatureLabel}>AUTHORIZED SIGNATURE</span>
        </div>
      </div>
    </section>
  );
}
