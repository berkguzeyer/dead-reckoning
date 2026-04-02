export interface Artifact {
  id: string;
  name: string;
  description: string;
  catalogEntry: string;
  url: string;
  language: string;
  materialComposition: string;
  stars: number;
  conditionRating: string;
  updatedAt: string;
  excavationDate: string;
  topics: string[];
  isPinned: boolean;
  readmeContent?: string;
  shape: ArtifactShape;
  depth: string;
}

export type ArtifactShape = 'ceramic-shard' | 'fossil' | 'tool-fragment' | 'tablet' | 'vessel' | 'bone';

export interface ResearcherProfile {
  name: string;
  classification: string;
  fieldExperience: number;
  specializations: string[];
  avatarUrl: string;
  accountCreated: string;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  topics?: string[];
}

export interface PinnedRepo {
  name: string;
  description: string | null;
  url: string;
  primaryLanguage: { name: string } | null;
  stargazerCount: number;
  updatedAt: string;
  repositoryTopics: {
    nodes: { topic: { name: string } }[];
  };
}
