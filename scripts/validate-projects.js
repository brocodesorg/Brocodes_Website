import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ZodError } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PROJECTS_DIR = path.join(ROOT_DIR, 'projects');

// Import project schema dynamically
async function loadSchema() {
  const schemaModule = await import('../src/types/project.ts');
  return schemaModule.ProjectMetadataSchema;
}

// Validate slug safety
function isValidSlug(slug) {
  return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(slug);
}

// Validate path doesn't escape project directory
function isPathSafe(projectPath, filePath) {
  const resolved = path.resolve(projectPath, filePath);
  return resolved.startsWith(projectPath + path.sep) || resolved === projectPath;
}

// Main validation
async function validateProjects() {
  console.log('🔍 Validating projects...\n');

  if (!fs.existsSync(PROJECTS_DIR)) {
    console.log('✅ No projects directory found (empty catalog is valid)');
    return true;
  }

  const entries = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true });
  const projectDirs = entries.filter(e => e.isDirectory() && !e.name.startsWith('.'));

  if (projectDirs.length === 0) {
    console.log('✅ No projects found (empty catalog is valid)');
    return true;
  }

  const ProjectMetadataSchema = await loadSchema();
  const slugs = new Set();
  let hasErrors = false;

  for (const dir of projectDirs) {
    const slug = dir.name;
    const projectPath = path.join(PROJECTS_DIR, slug);
    const metadataPath = path.join(projectPath, 'project.json');

    console.log(`📦 Validating: ${slug}`);

    // Check slug safety
    if (!isValidSlug(slug)) {
      console.error(`  ❌ Invalid slug format: "${slug}" (must be lowercase, alphanumeric, hyphens only)`);
      hasErrors = true;
      continue;
    }

    // Check for duplicates
    if (slugs.has(slug)) {
      console.error(`  ❌ Duplicate slug: "${slug}"`);
      hasErrors = true;
      continue;
    }
    slugs.add(slug);

    // Check metadata file exists
    if (!fs.existsSync(metadataPath)) {
      console.error(`  ❌ Missing project.json`);
      hasErrors = true;
      continue;
    }

    // Parse and validate metadata
    let metadata;
    try {
      const content = fs.readFileSync(metadataPath, 'utf-8');
      metadata = JSON.parse(content);
    } catch (err) {
      console.error(`  ❌ Invalid JSON in project.json: ${err.message}`);
      hasErrors = true;
      continue;
    }

    try {
      ProjectMetadataSchema.parse(metadata);
    } catch (err) {
      if (err instanceof ZodError) {
        console.error(`  ❌ Validation errors in project.json:`);
        err.errors.forEach(e => {
          console.error(`     - ${e.path.join('.')}: ${e.message}`);
        });
      } else {
        console.error(`  ❌ Validation error: ${err.message}`);
      }
      hasErrors = true;
      continue;
    }

    // Validate media paths
    if (metadata.cover) {
      const coverPath = path.join(projectPath, metadata.cover);
      if (!fs.existsSync(coverPath)) {
        console.error(`  ❌ Cover image not found: ${metadata.cover}`);
        hasErrors = true;
      }
      if (!isPathSafe(projectPath, metadata.cover)) {
        console.error(`  ❌ Cover path escapes project directory: ${metadata.cover}`);
        hasErrors = true;
      }
    }

    if (metadata.screenshots) {
      for (const screenshot of metadata.screenshots) {
        const screenshotPath = path.join(projectPath, screenshot.path);
        if (!fs.existsSync(screenshotPath)) {
          console.error(`  ❌ Screenshot not found: ${screenshot.path}`);
          hasErrors = true;
        }
        if (!isPathSafe(projectPath, screenshot.path)) {
          console.error(`  ❌ Screenshot path escapes project directory: ${screenshot.path}`);
          hasErrors = true;
        }
      }
    }

    if (metadata.videoLocal) {
      const videoPath = path.join(projectPath, metadata.videoLocal);
      if (!fs.existsSync(videoPath)) {
        console.error(`  ❌ Local video not found: ${metadata.videoLocal}`);
        hasErrors = true;
      }
      if (!isPathSafe(projectPath, metadata.videoLocal)) {
        console.error(`  ❌ Video path escapes project directory: ${metadata.videoLocal}`);
        hasErrors = true;
      }
    }

    // Check for README
    const readmePath = path.join(projectPath, 'README.md');
    if (!fs.existsSync(readmePath)) {
      console.warn(`  ⚠️  No README.md found (recommended)`);
    }

    console.log(`  ✅ Valid\n`);
  }

  if (hasErrors) {
    console.error('\n❌ Validation failed. Please fix the errors above.\n');
    process.exit(1);
  } else {
    console.log(`\n✅ All ${projectDirs.length} project(s) validated successfully!\n`);
  }
}

validateProjects().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
