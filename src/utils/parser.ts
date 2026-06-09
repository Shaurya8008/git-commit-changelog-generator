export type CommitType = 'feat' | 'fix' | 'chore' | 'docs' | 'style' | 'refactor' | 'perf' | 'test' | 'build' | 'ci' | 'revert' | 'other';

export interface ParsedCommit {
  hash?: string;
  type: CommitType;
  scope?: string;
  subject: string;
  original: string;
}

export interface ChangelogConfig {
  groupByType: boolean;
  includeHashes: boolean;
  ignoredTypes: CommitType[];
}

const TYPE_MAPPING: Record<string, CommitType> = {
  feat: 'feat', feature: 'feat',
  fix: 'fix', bugfix: 'fix',
  chore: 'chore',
  docs: 'docs',
  style: 'style',
  refactor: 'refactor',
  perf: 'perf', performance: 'perf',
  test: 'test', tests: 'test',
  build: 'build',
  ci: 'ci',
  revert: 'revert'
};

const TYPE_TITLES: Record<CommitType, string> = {
  feat: '🚀 Features',
  fix: '🐛 Bug Fixes',
  perf: '⚡ Performance Improvements',
  refactor: '♻️ Code Refactoring',
  style: '💎 Styling',
  docs: '📝 Documentation',
  test: '✅ Tests',
  build: '👷 Build System',
  ci: '🔧 Continuous Integration',
  chore: '🎫 Chores',
  revert: '⏪ Reverts',
  other: '📦 Other Changes'
};

export const parseCommitMessage = (line: string): ParsedCommit | null => {
  if (!line.trim()) return null;

  // Attempt to match conventional commit format
  // Optional Hash at the start: ^([a-f0-9]{7,40}\s+)?
  // Type: ([a-zA-Z]+)
  // Optional Scope: (?:\(([^)]+)\))?
  // Optional ! for breaking change: (!)?
  // Colon and Space: :\s+
  // Subject: (.*)
  const regex = /^([a-f0-9]{7,40}\s+)?([a-zA-Z]+)(?:\(([^)]+)\))?(!)?:\s+(.*)$/i;
  const match = line.match(regex);

  if (match) {
    const rawHash = match[1] ? match[1].trim() : undefined;
    const rawType = match[2].toLowerCase();
    const scope = match[3];
    const isBreaking = !!match[4];
    let subject = match[5].trim();

    // Map the raw type to our standard types
    const type = TYPE_MAPPING[rawType] || 'other';

    if (isBreaking) {
      subject = `**BREAKING CHANGE:** ${subject}`;
    }

    return {
      hash: rawHash,
      type,
      scope,
      subject,
      original: line
    };
  }

  // If it's not a conventional commit, maybe it still has a hash at the start
  const fallbackRegex = /^([a-f0-9]{7,40}\s+)?(.*)$/i;
  const fallbackMatch = line.match(fallbackRegex);
  
  if (fallbackMatch && fallbackMatch[2]) {
    return {
      hash: fallbackMatch[1] ? fallbackMatch[1].trim() : undefined,
      type: 'other',
      subject: fallbackMatch[2].trim(),
      original: line
    };
  }

  return {
    type: 'other',
    subject: line,
    original: line
  };
};

export const generateChangelog = (rawLog: string, config: ChangelogConfig): string => {
  const lines = rawLog.split('\n');
  const commits = lines
    .map(line => parseCommitMessage(line))
    .filter((commit): commit is ParsedCommit => commit !== null);

  if (commits.length === 0) {
    return 'No valid commits found.';
  }

  // Filter out ignored types
  const filteredCommits = commits.filter(commit => !config.ignoredTypes.includes(commit.type));

  if (filteredCommits.length === 0) {
    return 'All commits were filtered out.';
  }

  let markdown = '';
  const date = new Date().toISOString().split('T')[0];
  markdown += `## Release (${date})\n\n`;

  const formatCommit = (commit: ParsedCommit) => {
    let result = '- ';
    if (config.includeHashes && commit.hash) {
      result += `\`${commit.hash.substring(0, 7)}\` `;
    }
    if (commit.scope) {
      result += `**${commit.scope}:** `;
    }
    result += commit.subject;
    return result;
  };

  if (config.groupByType) {
    // Group commits by type
    const grouped = filteredCommits.reduce((acc, commit) => {
      if (!acc[commit.type]) {
        acc[commit.type] = [];
      }
      acc[commit.type].push(commit);
      return acc;
    }, {} as Record<CommitType, ParsedCommit[]>);

    // Render in a specific order (features and fixes first)
    const order: CommitType[] = ['feat', 'fix', 'perf', 'refactor', 'style', 'docs', 'test', 'build', 'ci', 'chore', 'revert', 'other'];

    for (const type of order) {
      if (grouped[type] && grouped[type].length > 0) {
        markdown += `### ${TYPE_TITLES[type]}\n\n`;
        grouped[type].forEach(commit => {
          markdown += `${formatCommit(commit)}\n`;
        });
        markdown += '\n';
      }
    }
  } else {
    // Just a flat list
    filteredCommits.forEach(commit => {
      markdown += `${formatCommit(commit)}\n`;
    });
  }

  return markdown.trim();
};
