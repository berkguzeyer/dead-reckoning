import { useState, useEffect } from 'react';
import type { Artifact } from '../types';
import { buildArtifacts, getSeedArtifacts } from '../services/github';
import { generateCatalogEntry } from '../services/claude';

export function useArtifacts() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await buildArtifacts(async (repoName, content) => {
          return await generateCatalogEntry(repoName, content);
        });

        if (!cancelled) {
          if (result.length > 0) {
            setArtifacts(result);
          } else {
            // Use seed data if API returned nothing
            setArtifacts(getSeedArtifacts());
          }
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load artifacts:', err);
          setError('Field site data unavailable. Loading cached specimens.');
          setArtifacts(getSeedArtifacts());
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { artifacts, loading, error };
}
