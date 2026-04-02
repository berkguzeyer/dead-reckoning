const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

const SYSTEM_PROMPT = `You are a dry, overly serious archaeological field researcher writing specimen catalog entries. Given a software project README, rewrite the description as if it were an excavated ancient artifact being catalogued. Use formal academic prose. Keep it to 2 sentences max. Never mention code, software, or programming directly — instead use archaeological metaphors (e.g. "structural composition", "ceremonial purpose", "civilization-scale ambition", "material culture"). Be subtly funny through extreme seriousness.`;

function generateLocalCatalogEntry(repoName: string, content: string): string {
  const lower = content.toLowerCase();
  const name = repoName.toLowerCase();

  // the-court / jury / verdict / advice
  if (name.includes('court') || lower.includes('jury') || lower.includes('verdict') || lower.includes('tribunal')) {
    return 'A deliberation chamber of considerable civic-judicial architecture, its mechanisms designed to receive anonymous petitioners and subject their personal crises to collective verdict by distributed jury. The AI-powered tribunal inscriptions and testimony walls suggest a civilization that systematically outsourced moral authority to the crowd, achieving a form of algorithmic jurisprudence.';
  }

  // decision / simulation / monte carlo / probability
  if (lower.includes('monte carlo') || (lower.includes('decision') && lower.includes('simulat'))) {
    return 'An oracular computation device of formidable precision, engineered to model the long-arc consequences of civilizational choices across multiple existential dimensions — wealth, stress, temporal freedom, and stability. Its iterative projection engine, running hundreds of parallel futures, implies a culture that treated fate not as fixed destiny but as a probability distribution to be interrogated and negotiated.';
  }

  // chatbot / conversation / messaging
  if (name.includes('chat') || lower.includes('chatbot') || lower.includes('conversation')) {
    return 'A rudimentary dialogue apparatus recovered in functional condition, its inner mechanism suggesting early attempts at simulated discourse between organic and synthetic agents. The specimen\'s compartmentalized architecture indicates a builder who understood the importance of separation of concerns, though the conversational engine itself depended on external oracular dependencies of unknown provenance.';
  }

  // ecommerce / shop / cart / marketplace
  if (name.includes('ecommerce') || name.includes('shop') || lower.includes('cart') || lower.includes('marketplace')) {
    return 'A commercial exchange apparatus of remarkable completeness, its catalogue chambers and transaction corridors suggesting a civilization deeply invested in the ritualized transfer of material goods across digital strata. The specimen\'s structural organization reflects a merchant culture that reduced the ancient chaos of commerce to an orderly series of ceremonial selections and confirmations.';
  }

  // testing / automation / selenium / cucumber / QA
  if (lower.includes('selenium') || lower.includes('cucumber') || lower.includes('automation') || name.includes('test') || name.includes('project')) {
    return 'A verification apparatus recovered from the quality-assurance stratum, its test chambers and assertion mechanisms suggesting a civilization preoccupied with ritual confirmation of system behavior. The specimen\'s structured scenario descriptions indicate a culture that encoded expected reality into formal scripts, then dispatched automated agents to validate that reality had cooperated.';
  }

  // personal website / portfolio
  if (name.includes('personal') || name.includes('website') || name.includes('portfolio') || lower.includes('personal site') || lower.includes('portfolio')) {
    return 'A self-referential monument erected by the subject to announce their own existence to passing travelers on the information thoroughfare. Structurally sound, its ceremonial purpose appears largely performative — a digital cairn marking territory in an otherwise featureless expanse, its primary function the projection of professional identity to prospective patrons.';
  }

  // API / backend / server
  if (lower.includes('api') || lower.includes('backend') || lower.includes('server') || lower.includes('endpoint')) {
    return `A communication relay apparatus recovered from the interface stratum, its endpoints and response schemas suggesting a civilization that invested heavily in structured protocols for inter-system dialogue. The specimen designated ${repoName} appears to have served as a diplomatic intermediary — translating raw requests from outer systems into the internal language of its host civilization.`;
  }

  // Generic fallback with repo name interpolated
  const descriptors = [
    'notable structural intentionality',
    'considerable organizational sophistication',
    'systematic architectural ambition',
    'deliberate compositional complexity',
  ];
  const descriptor = descriptors[repoName.length % descriptors.length];
  return `Specimen recovered from site ${repoName}, presenting evidence of ${descriptor} across its recovered strata. Preliminary analysis suggests the artifact served a specialized ceremonial function within its originating civilization, though the full scope of its operational purpose remains under active investigation.`;
}

export async function generateCatalogEntry(
  repoName: string,
  readmeContent: string
): Promise<string> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (apiKey) {
    try {
      const proxyUrl = import.meta.env.VITE_CLAUDE_PROXY_URL;
      const url = proxyUrl || CLAUDE_API_URL;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 200,
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: 'user',
              content: `Here is the README for a project called ${repoName}: ${readmeContent.slice(0, 3000)}. Write the specimen catalog entry.`,
            },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.content[0].text;
      }
    } catch {
      // fall through to local generation
    }
  }

  return generateLocalCatalogEntry(repoName, readmeContent);
}
