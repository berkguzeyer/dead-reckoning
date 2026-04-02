import styles from '../styles/StrataLabels.module.css';

const LABELS = [
  { name: 'SURFACE HORIZON', era: 'PRESENT DAY', top: '2%' },
  { name: 'ALLUVIAL DEPOSIT A', era: 'RECENT WORKS', top: '18%' },
  { name: 'CULTURAL LAYER I', era: 'ACTIVE DEVELOPMENT', top: '35%' },
  { name: 'OCCUPATION FLOOR', era: 'ESTABLISHED PRACTICE', top: '52%' },
  { name: 'FOUNDATION STRATUM', era: 'EARLY FORMATION', top: '70%' },
  { name: 'BEDROCK', era: 'ORIGIN LAYER', top: '88%' },
];

export default function StrataLabels() {
  return (
    <div className={styles.container}>
      {LABELS.map((label) => (
        <div
          key={label.name}
          className={styles.label}
          style={{ top: label.top }}
        >
          <span className={styles.line} />
          <div className={styles.text}>
            <span className={styles.name}>{label.name}</span>
            <span className={styles.era}>{label.era}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
