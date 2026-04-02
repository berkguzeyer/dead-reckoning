import { useState, useCallback } from 'react';
import StrataBackground from './components/StrataBackground';
import EntryAnimation from './components/EntryAnimation';
import DepthMeter from './components/DepthMeter';
import StrataLabels from './components/StrataLabels';
import ArtifactCard from './components/ArtifactCard';
import ResearcherProfile from './components/ResearcherProfile';
import CurrentlyExcavating from './components/CurrentlyExcavating';
import EasterEgg from './components/EasterEgg';
import AmbientAudio from './components/AmbientAudio';
import { useArtifacts } from './hooks/useArtifacts';
import './App.css';

function App() {
  const [siteRevealed, setSiteRevealed] = useState(false);
  const [easterEggVisible, setEasterEggVisible] = useState(false);
  const { artifacts, loading } = useArtifacts();

  const handleEntryComplete = useCallback(() => {
    setSiteRevealed(true);
  }, []);

  return (
    <div className="dead-reckoning">
      {/* Three.js background */}
      <StrataBackground />

      {/* Grid paper overlay */}
      <div className="grid-overlay" />

      {/* Grain/noise texture */}
      <div className="noise-overlay" />

      {/* Entry animation */}
      <EntryAnimation onComplete={handleEntryComplete} />

      {/* Fixed UI elements */}
      {siteRevealed && (
        <>
          <DepthMeter onEasterEgg={() => setEasterEggVisible(true)} />
          <StrataLabels />
          <AmbientAudio />
        </>
      )}

      {/* Main content */}
      <main className={`site-content ${siteRevealed ? 'revealed' : ''}`}>
        {/* Site header */}
        <header className="site-header">
          <div className="header-stamp">
            <span className="header-label">ARCHAEOLOGICAL DIGITAL SURVEY</span>
            <h1 className="site-title">Dead Reckoning</h1>
            <span className="header-sub">
              FIELD SITE REPORT — ACTIVE EXCAVATION
            </span>
          </div>
          <div className="header-meta">
            <span>GRID REF: DR-2024-001</span>
            <span>PRINCIPAL INVESTIGATOR: B. GUZEYER</span>
            <span>STATUS: IN PROGRESS</span>
          </div>
        </header>

        {/* Researcher profile */}
        <ResearcherProfile />

        {/* Artifacts section */}
        <section className="artifacts-section">
          <div className="section-header">
            <span className="section-label">RECOVERED SPECIMENS</span>
            <span className="section-count">
              {loading ? 'CATALOGUING...' : `${artifacts.length} ITEMS`}
            </span>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <span className="loading-text">
                Brushing sediment from recovered artifacts...
              </span>
            </div>
          ) : (
            <div className="artifacts-list">
              {artifacts.map((artifact, index) => (
                <ArtifactCard
                  key={artifact.id}
                  artifact={artifact}
                  index={index}
                />
              ))}
            </div>
          )}
        </section>

        {/* Currently Excavating */}
        <CurrentlyExcavating />

        {/* Footer */}
        <footer className="site-footer">
          <div className="footer-inner">
            <div className="footer-stamp">
              <span className="footer-title">DEAD RECKONING</span>
              <span className="footer-sub">Archaeological Digital Survey</span>
            </div>
            <div className="footer-meta">
              <span>
                All specimens catalogued under open-source preservation protocols.
              </span>
              <span>
                Site maintained by Berk Guzeyer — Senior Software Engineer.
              </span>
            </div>
            <div className="footer-bottom">
              <span>© {new Date().getFullYear()} — FIELD OPERATIONS DIVISION</span>
            </div>
          </div>
        </footer>
      </main>

      {/* Easter egg modal */}
      {easterEggVisible && (
        <EasterEgg onClose={() => setEasterEggVisible(false)} />
      )}
    </div>
  );
}

export default App;
