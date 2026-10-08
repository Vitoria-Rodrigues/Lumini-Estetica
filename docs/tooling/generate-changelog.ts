import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import projectConfig from '@site/src/project.config';

const require = createRequire(import.meta.url);
const kbPkgPath = require.resolve('@monorepo/kb-collections/package.json');
const kbDir = path.dirname(kbPkgPath);

const RELEASES_DIR = path.join(kbDir, 'namespaces/portal/content/blog/releases');
const CHANGELOG_PATH = path.join(kbDir, '../../CHANGELOG.md');

function generateChangelog(): void {
  console.info('🔄 Verifying release notes in the knowledge base...');

  if (fs.existsSync(RELEASES_DIR) === false) {
    console.error(`❌ Release directory not found: ${RELEASES_DIR}`);
    process.exit(1);
  }

  // Get all markdown release files and sort descending (newest first based on YYYY-MM-DD filenames)
  const files = fs
    .readdirSync(RELEASES_DIR)
    .filter((file: string): boolean => file.endsWith('.md') || file.endsWith('.mdx'))
    .sort((a: string, b: string): number => b.localeCompare(a));

  if (files.length === 0) {
    console.info('ℹ️ No release files found.');
    return;
  }

  let changelogContent = `# Changelog\n\nAll updates, improvements, and new features of ${projectConfig.PROJECT_DOMAIN} documented in the Knowledge Base.\n\n`;
  const entries: string[] = [];

  for (const file of files) {
    const filePath = path.join(RELEASES_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract frontmatter
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = frontmatterRegex.exec(content);

    if (match !== null) {
      const frontmatter = match[1];
      const body = match[2].trim();

      const titleRegex = /title:\s*(.+)/;
      const titleMatch = titleRegex.exec(frontmatter);

      const dateRegex = /date:\s*(.+)/;
      const dateMatch = dateRegex.exec(frontmatter);

      const title = titleMatch !== null ? titleMatch[1].replace(/['"]/g, '').trim() : file;
      const date = dateMatch !== null ? dateMatch[1].replace(/['"]/g, '').trim() : '';

      // Strip trailing horizontal rule if present in the body to avoid duplication
      const cleanedBody = body.endsWith('---') ? body.slice(0, -3).trim() : body;

      let entry = `## ${title} ${date !== '' ? `(${date})` : ''}\n\n`;
      entry += cleanedBody;
      entries.push(entry);
    } else {
      const cleanedContent = content.trim();
      const cleanedBody = cleanedContent.endsWith('---')
        ? cleanedContent.slice(0, -3).trim()
        : cleanedContent;
      entries.push(`## ${file}\n\n${cleanedBody}`);
    }
  }

  changelogContent += entries.join('\n\n---\n\n') + '\n';

  fs.writeFileSync(CHANGELOG_PATH, changelogContent);
  console.info(
    `✅ CHANGELOG.md successfully generated at the repository root! (${files.length} release notes compiled)`,
  );
}

generateChangelog();
