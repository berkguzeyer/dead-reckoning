import type { GitHubRepo, PinnedRepo, Artifact, ArtifactShape } from '../types';

const GITHUB_USERNAME = 'berkguzeyer';
const EXCLUDED_REPOS = ['personal-website', 'guzeyer.com'];
const MAX_ARTIFACTS = 6;

const ARTIFACT_SHAPES: ArtifactShape[] = [
  'ceramic-shard', 'fossil', 'tool-fragment', 'tablet', 'vessel', 'bone'
];

const DEPTHS = ['0.3m', '0.8m', '1.5m', '2.4m', '3.8m', '5.2m'];

export function getMaterialComposition(language: string | null, content: string = ''): string {
  const lower = content.toLowerCase();

  if (lower.includes('next.js') || lower.includes('nextjs')) return 'Next.js Full-Stack Compound';
  if (lower.includes('react') && (lower.includes('typescript') || lower.includes('.tsx'))) return 'React + TypeScript Stratum';
  if (lower.includes('react') && lower.includes('vite')) return 'React + Vite Formation';
  if (lower.includes('react')) return 'React Component Stratum';
  if (lower.includes('vue')) return 'Vue.js Reactive Layer';
  if (lower.includes('angular')) return 'Angular Composite, Dependency-Injected';
  if (lower.includes('svelte')) return 'Svelte Compiled Formation';
  if (lower.includes('django')) return 'Python/Django Sedimentary Layer';
  if (lower.includes('fastapi')) return 'Python FastAPI Deposit';
  if (lower.includes('flask')) return 'Python Flask Stratum, Micro-Grade';
  if (lower.includes('rails') || lower.includes('ruby on rails')) return 'Ruby on Rails Formation';
  if (lower.includes('spring boot') || lower.includes('spring framework')) return 'Java Spring Limestone Compound';
  if (lower.includes('express') || lower.includes('node.js') || lower.includes('nodejs')) return 'Node.js Runtime Formation';
  if (lower.includes('pytorch') || lower.includes('tensorflow') || lower.includes('keras')) return 'Neural Inference Composite';
  if (lower.includes('flutter')) return 'Flutter Cross-Platform Stratum';
  if (lower.includes('tailwind')) return 'Tailwind CSS Utility Layer';
  if (lower.includes('supabase') || lower.includes('firebase') || lower.includes('postgres')) return 'Cloud-Persisted Data Compound';

  switch (language) {
    case 'TypeScript': return 'Compressed Logic Stratum, Type IV';
    case 'JavaScript': return 'Unrefined Script Sediment';
    case 'Python': return 'Serpentine Logic Formation';
    case 'Rust': return 'Memory-Safe Iron Formation';
    case 'Go': return 'Go Concurrent Alloy';
    case 'Java': return 'Java Bytecode Limestone';
    case 'Ruby': return 'Ruby Gem-Studded Formation';
    case 'Swift': return 'Swift Native Apple Stratum';
    case 'Kotlin': return 'Kotlin JVM Composite';
    case 'C': return 'C Primitive Bedrock';
    case 'C++': return 'C++ Stratified Alloy';
    case 'C#': return '.NET Composite, Microsoft-Grade';
    case 'PHP': return 'PHP Sediment, Legacy-Adjacent';
    case 'Shell': return 'Shell Script Formation';
    default: return 'Composite Unknown Material';
  }
}

function getConditionRating(stars: number): string {
  if (stars >= 20) return 'Excellent — Museum Quality';
  if (stars >= 5) return 'Good';
  if (stars >= 1) return 'Fair';
  return 'Fragmentary';
}

function formatExcavationDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function fetchPinnedRepos(): Promise<PinnedRepo[]> {
  try {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (!token) return [];

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{
          user(login: "${GITHUB_USERNAME}") {
            pinnedItems(first: 6, types: REPOSITORY) {
              nodes {
                ... on Repository {
                  name
                  description
                  url
                  primaryLanguage { name }
                  stargazerCount
                  updatedAt
                  repositoryTopics(first: 5) {
                    nodes { topic { name } }
                  }
                }
              }
            }
          }
        }`,
      }),
    });

    if (!response.ok) return [];
    const data = await response.json();
    return data.data?.user?.pinnedItems?.nodes || [];
  } catch {
    return [];
  }
}

export async function fetchRepos(username: string = GITHUB_USERNAME): Promise<GitHubRepo[]> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (token) headers['Authorization'] = `token ${token}`;

    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=15`,
      { headers }
    );
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

export async function fetchReadme(repoName: string, username: string = GITHUB_USERNAME): Promise<string | null> {
  for (const branch of ['main', 'master']) {
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/${username}/${repoName}/${branch}/README.md`
      );
      if (response.ok) return await response.text();
    } catch {
      continue;
    }
  }
  return null;
}

export async function fetchUserProfile(): Promise<{
  createdAt: string;
  avatarUrl: string;
  languages: string[];
} | null> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (token) headers['Authorization'] = `token ${token}`;

    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}`,
      { headers }
    );
    if (!response.ok) return null;
    const user = await response.json();

    // Fetch language stats from repos
    const reposResponse = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=30&sort=updated`,
      { headers }
    );
    const repos: GitHubRepo[] = reposResponse.ok ? await reposResponse.json() : [];
    const langCounts: Record<string, number> = {};
    for (const repo of repos) {
      if (repo.language) {
        langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
      }
    }
    const languages = Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([lang]) => lang);

    return {
      createdAt: user.created_at,
      avatarUrl: user.avatar_url,
      languages,
    };
  } catch {
    return null;
  }
}

export async function buildArtifacts(
  generateDescription: (repoName: string, content: string) => Promise<string>
): Promise<Artifact[]> {
  const [pinnedRepos, allRepos] = await Promise.all([
    fetchPinnedRepos(),
    fetchRepos(),
  ]);

  // Build combined list: pinned first, then by updated
  const pinnedNames = new Set(pinnedRepos.map(r => r.name));
  const artifacts: Artifact[] = [];

  // Add pinned repos first
  for (const repo of pinnedRepos) {
    if (EXCLUDED_REPOS.includes(repo.name)) continue;
    if (artifacts.length >= MAX_ARTIFACTS) break;

    const readme = await fetchReadme(repo.name);
    const contentForClaude = readme || repo.description || repo.name;
    let catalogEntry: string;
    try {
      catalogEntry = await generateDescription(repo.name, contentForClaude);
    } catch {
      catalogEntry = `Specimen recovered from site ${repo.name}. Analysis pending.`;
    }

    artifacts.push({
      id: repo.name,
      name: repo.name,
      description: repo.description || '',
      catalogEntry,
      url: repo.url,
      language: repo.primaryLanguage?.name || 'Unknown',
      materialComposition: getMaterialComposition(repo.primaryLanguage?.name || null, contentForClaude),
      stars: repo.stargazerCount,
      conditionRating: getConditionRating(repo.stargazerCount),
      updatedAt: repo.updatedAt,
      excavationDate: formatExcavationDate(repo.updatedAt),
      topics: repo.repositoryTopics.nodes.map(n => n.topic.name),
      isPinned: true,
      readmeContent: readme || undefined,
      shape: ARTIFACT_SHAPES[artifacts.length % ARTIFACT_SHAPES.length],
      depth: DEPTHS[artifacts.length],
    });
  }

  // Fill remaining slots with non-pinned repos
  for (const repo of allRepos) {
    if (artifacts.length >= MAX_ARTIFACTS) break;
    if (EXCLUDED_REPOS.includes(repo.name)) continue;
    if (pinnedNames.has(repo.name)) continue;

    const readme = await fetchReadme(repo.name);
    const contentForClaude = readme || repo.description || repo.name;
    let catalogEntry: string;
    try {
      catalogEntry = await generateDescription(repo.name, contentForClaude);
    } catch {
      catalogEntry = `Specimen recovered from site ${repo.name}. Analysis pending.`;
    }

    artifacts.push({
      id: repo.name,
      name: repo.name,
      description: repo.description || '',
      catalogEntry,
      url: repo.html_url,
      language: repo.language || 'Unknown',
      materialComposition: getMaterialComposition(repo.language || null, contentForClaude),
      stars: repo.stargazers_count,
      conditionRating: getConditionRating(repo.stargazers_count),
      updatedAt: repo.updated_at,
      excavationDate: formatExcavationDate(repo.updated_at),
      topics: repo.topics || [],
      isPinned: false,
      readmeContent: readme || undefined,
      shape: ARTIFACT_SHAPES[artifacts.length % ARTIFACT_SHAPES.length],
      depth: DEPTHS[artifacts.length] || `${(artifacts.length * 1.3 + 0.3).toFixed(1)}m`,
    });
  }

  return artifacts;
}

// Seed data fallback
export function getSeedArtifacts(): Artifact[] {
  return [
    {
      id: 'the-court',
      name: 'the-court',
      description: 'Crowdsourced life advice platform',
      catalogEntry: 'A deliberation chamber of considerable civic-judicial architecture, its mechanisms designed to receive anonymous petitioners and subject their personal crises to collective verdict by distributed jury. The AI-powered tribunal inscriptions and testimony walls suggest a civilization that systematically outsourced moral authority to the crowd, achieving a form of algorithmic jurisprudence.',
      url: 'https://github.com/berkguzeyer/the-court',
      language: 'TypeScript',
      materialComposition: 'Compressed Logic Stratum, Type IV',
      stars: 0,
      conditionRating: 'Fragmentary',
      updatedAt: '2024-01-15T00:00:00Z',
      excavationDate: 'January 15, 2024',
      topics: ['community', 'advice', 'voting'],
      isPinned: true,
      shape: 'tablet',
      depth: '0.3m',
    },
    {
      id: 'decision-simulator',
      name: 'decision-simulator',
      description: 'Life decision modeling engine',
      catalogEntry: 'An oracular computation device of formidable precision, engineered to model the long-arc consequences of civilizational choices across multiple existential dimensions — wealth, stress, temporal freedom, and stability. Its iterative projection engine, running hundreds of parallel futures, implies a culture that treated fate not as fixed destiny but as a probability distribution to be interrogated and negotiated.',
      url: 'https://github.com/berkguzeyer/decision-simulator',
      language: 'TypeScript',
      materialComposition: 'Compressed Logic Stratum, Type IV',
      stars: 0,
      conditionRating: 'Fragmentary',
      updatedAt: '2024-02-20T00:00:00Z',
      excavationDate: 'February 20, 2024',
      topics: ['simulation', 'decision-making', 'monte-carlo'],
      isPinned: true,
      shape: 'fossil',
      depth: '0.8m',
    },
    {
      id: 'guzeyer-dot-com',
      name: 'guzeyer.com',
      description: 'Current personal site',
      catalogEntry: 'A self-referential monument erected by the subject to announce their own existence to passing travelers on the information thoroughfare. Structurally sound, its ceremonial purpose appears largely performative — a digital cairn marking territory in an otherwise featureless expanse, its primary function the projection of professional identity to prospective patrons.',
      url: 'https://github.com/berkguzeyer/guzeyer.com',
      language: 'TypeScript',
      materialComposition: 'Compressed Logic Stratum, Type IV',
      stars: 0,
      conditionRating: 'Fragmentary',
      updatedAt: '2024-03-10T00:00:00Z',
      excavationDate: 'March 10, 2024',
      topics: ['personal', 'website'],
      isPinned: false,
      shape: 'ceramic-shard',
      depth: '1.5m',
    },
  ];
}
