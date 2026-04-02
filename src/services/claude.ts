const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

const SYSTEM_PROMPT = `You are a dry, overly serious archaeological field researcher writing specimen catalog entries. Given a software project README, rewrite the description as if it were an excavated ancient artifact being catalogued. Use formal academic prose. Keep it to 2 sentences max. Never mention code, software, or programming directly — instead use archaeological metaphors (e.g. "structural composition", "ceremonial purpose", "civilization-scale ambition", "material culture"). Be subtly funny through extreme seriousness.`;

// Pull the first readable sentence out of a README to use as raw material
function extractCoreSentence(content: string): string | null {
  const lines = content.split('\n');
  for (const line of lines) {
    const clean = line.replace(/[#*`_[\]!<>]/g, '').trim();
    if (
      clean.length > 40 &&
      !clean.startsWith('http') &&
      !clean.startsWith('badge') &&
      !/^\s*[-|]/.test(clean)
    ) {
      return clean.slice(0, 250);
    }
  }
  return null;
}

function generateLocalCatalogEntry(repoName: string, content: string): string {
  const lower = content.toLowerCase();
  const name = repoName.toLowerCase();

  // Jury / legal / advice platform
  if (name.includes('court') || lower.includes('jury') || lower.includes('verdict') || lower.includes('tribunal')) {
    return 'A civic-judicial platform for submitting personal dilemmas to anonymous crowd verdict — part confessional booth, part courtroom. Its AI case-framing and live split-verdict display suggest a culture that found comfort in outsourcing moral decisions to strangers on the internet.';
  }

  // Decision modeling / monte carlo / life simulation
  if (lower.includes('monte carlo') || (lower.includes('decision') && lower.includes('simulat'))) {
    return 'A life-decision modeling engine that runs 500 parallel futures to compare job offers, cities, and financial choices over 10–30 year horizons. The kind of tool you build when a spreadsheet feels too optimistic and a therapist feels too expensive.';
  }

  // OS / kernel / low-level systems
  if (lower.includes('linux kernel') || lower.includes('operating system') || lower.includes('kernel module')) {
    return `A foundational stratum governing the lowest ceremonial layers of computational civilization, accumulated over decades and maintained by thousands of anonymous contributors. The specimen ${repoName} represents infrastructure of such depth that most inhabitants of its host civilization use it daily without knowing it exists.`;
  }

  // Machine learning / AI / model training
  if (lower.includes('neural network') || lower.includes('machine learning') || lower.includes('deep learning') || lower.includes('model training') || lower.includes('pytorch') || lower.includes('tensorflow')) {
    return `A pattern-recognition apparatus trained to extract signal from data through iterative self-correction. The specimen appears to belong to a civilization that, having run out of explicit rules to write, began teaching machines to infer them from examples instead.`;
  }

  // Auth / login / identity
  if (lower.includes('authentication') || lower.includes('oauth') || lower.includes('jwt') || lower.includes('login system') || lower.includes('identity')) {
    return `An identity verification apparatus whose primary function is confirming that users are who they claim to be — a task that sounds simple and is not. Its token chambers and session corridors reflect a civilization perpetually anxious about unauthorized access.`;
  }

  // CLI / command-line tool
  if (lower.includes('command-line') || lower.includes('command line') || lower.includes('cli tool') || name.endsWith('-cli') || name.startsWith('cli-')) {
    return `A terminal invocation device designed for operators who prefer typed commands over graphical interfaces. Compact, opinionated, and deliberately hostile to anyone unwilling to read the documentation.`;
  }

  // Browser extension / plugin
  if (lower.includes('browser extension') || lower.includes('chrome extension') || lower.includes('firefox extension')) {
    return `A browser modification apparatus that inserts itself between the user and the web, altering or augmenting what the host civilization's citizens experience during their daily information retrieval rituals.`;
  }

  // Game / gameplay
  if (lower.includes('gameplay') || lower.includes('game engine') || lower.includes('player score') || lower.includes('pygame') || name.includes('game')) {
    return `A ludic engagement apparatus recovered in playable condition, its win conditions and interaction loops suggesting a civilization that encoded challenge and reward into structured systems for the purpose of voluntary leisure. The difficulty curve indicates a builder who has strong opinions about what constitutes fair.`;
  }

  // Real-time / websocket / live updates
  if (lower.includes('websocket') || lower.includes('real-time') || lower.includes('socket.io') || lower.includes('live updates')) {
    return `A live-synchronization apparatus built to push information to multiple recipients the moment it changes, rather than waiting to be asked. Its use implies a civilization that found periodic polling spiritually unsatisfying.`;
  }

  // Dashboard / analytics / metrics
  if (lower.includes('dashboard') || lower.includes('analytics') || lower.includes('metrics') || lower.includes('monitoring')) {
    return `A surveillance and reporting apparatus that converts raw operational data into legible visual summaries for decision-makers. Its chart chambers and filter mechanisms suggest a civilization that trusted numbers more than intuition, and wanted both on one screen.`;
  }

  // Compiler / parser / AST / interpreter
  if (lower.includes('compiler') || lower.includes('parser') || lower.includes('abstract syntax') || lower.includes('interpreter') || lower.includes('transpiler')) {
    return `A language-translation apparatus that reads text written in one formal notation and converts it into another, passing through several intermediate representations along the way. The specimen implies a builder who found existing languages insufficient and decided to make their own.`;
  }

  // Web scraper / crawler
  if (lower.includes('scraper') || lower.includes('crawler') || lower.includes('web scraping') || lower.includes('data extraction')) {
    return `An automated data-retrieval apparatus designed to traverse public information structures and extract their contents without being invited. Efficient, single-minded, and politely described as a "crawler" in its field notes.`;
  }

  // Chatbot / conversation
  if (name.includes('chat') || lower.includes('chatbot') || lower.includes('conversational')) {
    return `A dialogue apparatus simulating responsive communication between a human and a machine, its message-handling loops attempting to make the exchange feel more natural than it technically is. Recovered with the conversation history intact.`;
  }

  // Ecommerce / shop
  if (name.includes('ecommerce') || name.includes('shop') || lower.includes('shopping cart') || lower.includes('checkout')) {
    return `A commercial transaction apparatus organizing the ancient ritual of browsing, selecting, and purchasing into a sequence of structured UI states. Its cart and checkout corridors reflect a civilization that found buying things online normal enough to build the infrastructure themselves.`;
  }

  // Testing / QA / automation
  if (lower.includes('selenium') || lower.includes('cucumber') || lower.includes('test suite') || lower.includes('automated testing') || lower.includes('end-to-end')) {
    return `A behavioral verification apparatus that encodes expected system outcomes as executable scripts, then runs them on a schedule to confirm reality is still cooperating. Its scenario descriptions read like demands issued to the software, politely phrased.`;
  }

  // Personal website / portfolio
  if (name.includes('personal') || name.includes('portfolio') || lower.includes('personal site') || lower.includes('portfolio site')) {
    return `A personal monument constructed to present the builder's professional identity to passing visitors. Structurally sound, its primary function is making a good first impression — a goal it pursues with varying degrees of success depending on the season.`;
  }

  // API / backend / server
  if (lower.includes('rest api') || lower.includes('graphql') || (lower.includes('api') && lower.includes('endpoint'))) {
    return `A structured data-exchange apparatus whose endpoints accept requests and return responses in agreed-upon formats. It does not have opinions about what the client does with the data — that's the client's problem.`;
  }

  // Fallback: try to use the actual README content
  const core = extractCoreSentence(content);
  if (core) {
    const short = core.length > 120 ? core.slice(0, core.lastIndexOf(' ', 120)) + '...' : core;
    return `An artifact whose primary inscription reads: "${short}" — filed under active analysis. The specimen's construction suggests deliberate intent, though the full ceremonial significance remains a matter of ongoing scholarly debate.`;
  }

  return `An artifact from site ${repoName} recovered without sufficient field documentation to permit confident classification. Structural analysis is ongoing; the excavation team has noted it as "interesting" and moved on.`;
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
