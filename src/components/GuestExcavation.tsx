import { useState, useRef } from 'react';
import { fetchRepos, fetchReadme, getMaterialComposition } from '../services/github';
import { generateCatalogEntry } from '../services/claude';
import styles from '../styles/GuestExcavation.module.css';

interface GuestArtifact {
  name: string;
  language: string;
  catalogEntry: string;
  url: string;
  description: string;
  content: string;
}

function parseUsername(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/github\.com\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  return trimmed.replace(/^@/, '');
}

export default function GuestExcavation() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [artifacts, setArtifacts] = useState<GuestArtifact[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseUsername(input);
    if (!parsed) return;

    setLoading(true);
    setError(null);
    setArtifacts([]);
    setUsername(parsed);

    try {
      const repos = await fetchRepos(parsed);
      if (repos.length === 0) {
        setError(`No public repositories found at site "${parsed}". Field team returning empty-handed.`);
        setLoading(false);
        return;
      }

      const top = repos.slice(0, 5);
      const results: GuestArtifact[] = [];

      for (const repo of top) {
        const readme = await fetchReadme(repo.name, parsed);
        const content = readme || repo.description || repo.name;
        const catalogEntry = await generateCatalogEntry(repo.name, content);
        results.push({
          name: repo.name,
          language: repo.language || 'Unknown',
          catalogEntry,
          url: repo.html_url,
          description: repo.description || '',
          content,
        });
      }

      setArtifacts(results);
    } catch {
      setError('Field survey failed. Site may be inaccessible or coordinates invalid.');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setArtifacts([]);
    setUsername(null);
    setError(null);
    setInput('');
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>OPEN FIELD SURVEY</span>
        <span className={styles.sectionSub}>Submit any GitHub site for remote analysis</span>
      </div>

      {!username && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="guest-username">
              SITE COORDINATES
            </label>
            <div className={styles.inputRow}>
              <input
                ref={inputRef}
                id="guest-username"
                className={styles.input}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="github username or profile URL"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                className={styles.submitBtn}
                type="submit"
                disabled={!input.trim() || loading}
              >
                INITIATE SURVEY
              </button>
            </div>
          </div>
        </form>
      )}

      {loading && (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner} />
          <span>Deploying field team to site <strong>{username}</strong>...</span>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <span className={styles.errorLabel}>SURVEY FAILURE</span>
          <p>{error}</p>
          <button className={styles.retryBtn} onClick={handleReset}>
            NEW SURVEY
          </button>
        </div>
      )}

      {artifacts.length > 0 && (
        <div className={styles.report}>
          <div className={styles.reportHeader}>
            <span className={styles.reportLabel}>FIELD REPORT — SITE: {username?.toUpperCase()}</span>
            <span className={styles.reportCount}>{artifacts.length} SPECIMENS RECOVERED</span>
          </div>

          <div className={styles.artifactList}>
            {artifacts.map((artifact, i) => (
              <div key={artifact.name} className={styles.artifactRow}>
                <div className={styles.artifactIndex}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className={styles.artifactBody}>
                  <div className={styles.artifactMeta}>
                    <a
                      href={artifact.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.artifactName}
                    >
                      {artifact.name} ↗
                    </a>
                    <span className={styles.artifactLang}>
                      {getMaterialComposition(artifact.language, artifact.content)}
                    </span>
                  </div>
                  <p className={styles.artifactEntry}>{artifact.catalogEntry}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.reportFooter}>
            <button className={styles.retryBtn} onClick={handleReset}>
              SURVEY NEW SITE
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
