import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import projectConfig from '@site/src/project.config';

const require = createRequire(import.meta.url);
const kbPkgPath = require.resolve('@monorepo/kb-collections/package.json');
const kbDir = path.dirname(kbPkgPath);

const ROADMAP_DIR = path.join(kbDir, 'namespaces/portal/content/community/roadmap');
const ROADMAP_PATH = path.join(kbDir, '../../ROADMAP.md');

const ROADMAP_FILES = [
  '01-core.mdx',
  '02-hub.mdx',
  '03-renderer.mdx',
  '04-studio.mdx',
  '05-tools.mdx',
  '06-docs.mdx',
  '07-cortex.mdx',
];

function generateRoadmap(): void {
  console.info('🔄 Compiling modular roadmaps...');

  if (fs.existsSync(ROADMAP_DIR) === false) {
    console.error(`❌ Roadmap directory not found: ${ROADMAP_DIR}`);
    process.exit(1);
  }

  let roadmapContent = `# Roadmap\n\nAll planned and completed milestones for each key workspace context in the ${projectConfig.PROJECT_DOMAIN} ecosystem, aligning our immediate features with long-term platform transformations.\n\n`;
  const entries: string[] = [];

  for (const file of ROADMAP_FILES) {
    const filePath = path.join(ROADMAP_DIR, file);

    if (fs.existsSync(filePath) === false) {
      console.warn(`⚠️ Warning: Roadmap file not found: ${file}`);
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract frontmatter
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = frontmatterRegex.exec(content);

    if (match !== null) {
      const frontmatter = match[1];
      const body = match[2].trim();

      const titleMatch = /title:\s*(.+)/.exec(frontmatter);
      const title = titleMatch !== null ? titleMatch[1].replace(/['"]/g, '').trim() : file;

      // Strip trailing horizontal rule if present in the body to avoid duplication
      const cleanedBody = body.endsWith('---') ? body.slice(0, -3).trim() : body;

      let entry = `## ${title}\n\n`;
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

  roadmapContent += entries.join('\n\n---\n\n') + '\n';

  fs.writeFileSync(ROADMAP_PATH, roadmapContent);
  console.info(
    `✅ ROADMAP.md successfully generated at the repository root! (${entries.length} contexts compiled)`,
  );
}

generateRoadmap();
