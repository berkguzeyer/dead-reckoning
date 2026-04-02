import styles from '../styles/CurrentlyExcavating.module.css';

export default function CurrentlyExcavating() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Caution tape SVGs */}
        <div className={styles.cautionTape}>
          <svg viewBox="0 0 800 30" className={styles.tapeStrip}>
            {Array.from({ length: 20 }).map((_, i) => (
              <g key={i}>
                <rect
                  x={i * 40}
                  y="0"
                  width="20"
                  height="30"
                  fill="#FF6600"
                  opacity="0.9"
                />
                <rect
                  x={i * 40 + 20}
                  y="0"
                  width="20"
                  height="30"
                  fill="#1A0F05"
                  opacity="0.9"
                />
              </g>
            ))}
            <text
              x="400"
              y="20"
              textAnchor="middle"
              fill="#F5F0E1"
              fontSize="12"
              fontFamily="Courier Prime, monospace"
              letterSpacing="6"
            >
              ACTIVE EXCAVATION SITE — DO NOT CROSS
            </text>
          </svg>
        </div>

        <div className={styles.digSite}>
          {/* Raw soil texture */}
          <div className={styles.soilArea}>
            <div className={styles.soilTexture} />
            <div className={styles.partialArtifact}>
              <svg viewBox="0 0 100 60" className={styles.partialSVG}>
                <path
                  d="M10 50 Q20 30 35 25 Q50 20 60 30"
                  fill="none"
                  stroke="#8B6914"
                  strokeWidth="1.5"
                  strokeDasharray="3 4"
                  opacity="0.6"
                />
                <text
                  x="15"
                  y="55"
                  fill="rgba(196, 163, 90, 0.4)"
                  fontSize="6"
                  fontFamily="Courier Prime, monospace"
                >
                  INCOMPLETE
                </text>
              </svg>
            </div>
          </div>

          <div className={styles.siteInfo}>
            <div className={styles.amberLight}>
              <div className={styles.amberDot} />
            </div>
            <h3 className={styles.siteTitle}>Active site. Do not disturb.</h3>
            <p className={styles.siteText}>
              Excavation in progress. Preliminary analysis suggests significant
              structural complexity. Full assessment pending completion of
              stratigraphic removal.
            </p>
            <span className={styles.siteLabel}>
              DEPTH: UNKNOWN — SURVEY ONGOING
            </span>
          </div>
        </div>

        <div className={styles.cautionTapeBottom}>
          <svg viewBox="0 0 800 30" className={styles.tapeStrip}>
            {Array.from({ length: 20 }).map((_, i) => (
              <g key={i}>
                <rect
                  x={i * 40}
                  y="0"
                  width="20"
                  height="30"
                  fill="#FF6600"
                  opacity="0.9"
                />
                <rect
                  x={i * 40 + 20}
                  y="0"
                  width="20"
                  height="30"
                  fill="#1A0F05"
                  opacity="0.9"
                />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
