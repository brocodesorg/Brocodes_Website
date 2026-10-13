import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PROJECTS_DIR = path.join(ROOT_DIR, 'projects');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DOWNLOADS_DIR = path.join(PUBLIC_DIR, 'downloads');
const MEDIA_DIR = path.join(PUBLIC_DIR, 'media', 'projects');

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg'];
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.mkv'];

// Files and directories to exclude from local ZIPs if packaged locally
const EXCLUDE_PATTERNS = [
  /^\.git(\/|$)/,
  /^\.github(\/|$)/,
  /^node_modules(\/|$)/,
  /^\.venv(\/|$)/,
  /^venv(\/|$)/,
  /^__pycache__(\/|$)/,
  /^\.pytest_cache(\/|$)/,
  /^\.coverage$/,
  /^coverage(\/|$)/,
  /^dist(\/|$)/,
  /^build(\/|$)/,
  /^out(\/|$)/,
  /^\.DS_Store$/,
  /^Thumbs\.db$/,
  /^\.env(\.|$)/,
  /.*\.log$/,
  /.*\.zip$/,
];

function shouldExclude(relativePath) {
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(relativePath));
}

function hasLocalSourceCode(projectPath) {
  const entries = fs.readdirSync(projectPath);
  return entries.some(e => !['project.json', 'README.md', 'media', '.DS_Store'].includes(e));
}

async function createProjectZip(projectPath, slug) {
  return new Promise((resolve, reject) => {
    const zipPath = path.join(DOWNLOADS_DIR, `${slug}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
      resolve({ size: archive.pointer(), sizeInMB });
    });

    archive.on('error', reject);
    archive.pipe(output);

    function addDirectory(dirPath, archivePath = '') {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relativePath = path.relative(projectPath, fullPath);
        const archiveEntryPath = path.join(archivePath, entry.name);

        if (shouldExclude(relativePath)) continue;

        if (entry.isDirectory()) {
          addDirectory(fullPath, archiveEntryPath);
        } else if (entry.isFile()) {
          archive.file(fullPath, { name: archiveEntryPath });
        }
      }
    }

    addDirectory(projectPath);
    archive.finalize();
  });
}

function discoverMedia(projectPath, metadata) {
  const mediaDir = path.join(projectPath, 'media');
  const screenshotsDir = path.join(mediaDir, 'screenshots');
  let screenshots = metadata.screenshots ? [...metadata.screenshots] : [];
  let cover = metadata.cover;
  let videoLocal = metadata.videoLocal;

  // Auto-discover screenshots inside media/screenshots/
  if (fs.existsSync(screenshotsDir)) {
    const files = fs.readdirSync(screenshotsDir);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        const relPath = `media/screenshots/${file}`;
        if (!screenshots.some(s => s.path === relPath || s.path.endsWith(file))) {
          screenshots.push({
            path: relPath,
            alt: `${metadata.title || 'Project'} preview`
          });
        }
      }
    }
  }

  // Also check media root for screenshots or cover if none specified
  if (fs.existsSync(mediaDir)) {
    const files = fs.readdirSync(mediaDir);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        if (!cover && (file.startsWith('cover') || file.startsWith('thumbnail'))) {
          cover = `media/${file}`;
        }
      } else if (VIDEO_EXTENSIONS.includes(ext) && !videoLocal) {
        videoLocal = `media/${file}`;
      }
    }
  }

  return { screenshots, cover, videoLocal };
}

async function copyMediaFiles(projectPath, slug, screenshots, cover, videoLocal) {
  const projectMediaDir = path.join(MEDIA_DIR, slug);
  if (!fs.existsSync(projectMediaDir)) {
    fs.mkdirSync(projectMediaDir, { recursive: true });
  }

  if (cover) {
    const coverSource = path.join(projectPath, cover);
    if (fs.existsSync(coverSource)) {
      fs.copyFileSync(coverSource, path.join(projectMediaDir, path.basename(cover)));
    }
  }

  if (screenshots && screenshots.length > 0) {
    for (const s of screenshots) {
      const src = path.join(projectPath, s.path);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(projectMediaDir, path.basename(s.path)));
      }
    }
  }

  if (videoLocal) {
    const vidSrc = path.join(projectPath, videoLocal);
    if (fs.existsSync(vidSrc)) {
      fs.copyFileSync(vidSrc, path.join(projectMediaDir, path.basename(videoLocal)));
    }
  }
}

async function prepareProjects() {
  console.log('🚀 Preparing projects for build...\n');

  if (fs.existsSync(DOWNLOADS_DIR)) fs.rmSync(DOWNLOADS_DIR, { recursive: true });
  if (fs.existsSync(MEDIA_DIR)) fs.rmSync(MEDIA_DIR, { recursive: true });

  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
  fs.mkdirSync(MEDIA_DIR, { recursive: true });

  const dataDir = path.join(ROOT_DIR, 'src', 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  if (!fs.existsSync(PROJECTS_DIR)) {
    fs.writeFileSync(path.join(dataDir, 'projects.json'), JSON.stringify([], null, 2));
    console.log('✅ Empty catalog (no projects directory)');
    return;
  }

  const entries = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true });
  const projectDirs = entries.filter(e => e.isDirectory() && !e.name.startsWith('.'));

  if (projectDirs.length === 0) {
    fs.writeFileSync(path.join(dataDir, 'projects.json'), JSON.stringify([], null, 2));
    console.log('✅ Empty catalog (0 projects)');
    return;
  }

  const projects = [];

  for (const dir of projectDirs) {
    const slug = dir.name;
    const projectPath = path.join(PROJECTS_DIR, slug);
    const metadataPath = path.join(projectPath, 'project.json');

    console.log(`📦 Processing: ${slug}`);

    let metadata = {};
    if (fs.existsSync(metadataPath)) {
      try {
        metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
      } catch (e) {
        console.error(`  ⚠️ Error parsing project.json: ${e.message}`);
      }
    }

    // README
    let readmeContent = null;
    let readmeHtml = null;
    const readmePath = path.join(projectPath, 'README.md');
    if (fs.existsSync(readmePath)) {
      readmeContent = fs.readFileSync(readmePath, 'utf-8');
      readmeHtml = marked(readmeContent);
      console.log(`  ✅ Processed README.md`);
    }

    // Default metadata fields
    const title = metadata.title || slug.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const summary = metadata.summary || (readmeContent ? readmeContent.split('\n').find(l => l.trim() && !l.startsWith('#')) || 'A showcased project on BroCodes.' : 'A showcased project on BroCodes.');
    const category = metadata.category || 'Software';
    const technologies = Array.isArray(metadata.technologies) ? metadata.technologies : [];

    // Media discovery
    const { screenshots, cover, videoLocal } = discoverMedia(projectPath, metadata);
    await copyMediaFiles(projectPath, slug, screenshots, cover, videoLocal);
    console.log(`  📸 Media: ${screenshots.length} screenshot(s), video: ${Boolean(videoLocal || metadata.videoUrl)}`);

    // Download setup: GitHub archive redirect or local ZIP
    let downloadInfo = null;
    if (metadata.enableDownload !== false) {
      if (metadata.downloadUrl) {
        downloadInfo = {
          url: metadata.downloadUrl,
          isExternal: true,
          label: 'Download ZIP'
        };
      } else if (metadata.githubUrl) {
        const cleanRepo = metadata.githubUrl.replace(/\/+$/, '');
        const branch = metadata.githubBranch || 'main';
        downloadInfo = {
          url: `${cleanRepo}/archive/refs/heads/${branch}.zip`,
          isExternal: true,
          label: 'Download Repo (.zip)'
        };
        console.log(`  ⬇️  GitHub ZIP download linked: ${downloadInfo.url}`);
      } else if (hasLocalSourceCode(projectPath)) {
        try {
          const zipInfo = await createProjectZip(projectPath, slug);
          downloadInfo = {
            url: `/downloads/${slug}.zip`,
            size: zipInfo.size,
            sizeInMB: zipInfo.sizeInMB,
            isExternal: false,
            label: 'Download (.zip)'
          };
          console.log(`  ⬇️  Created local ZIP (${zipInfo.sizeInMB} MB)`);
        } catch (err) {
          console.error(`  ❌ Local ZIP creation error: ${err.message}`);
        }
      }
    }

    const projectData = {
      slug,
      ...metadata,
      title,
      summary,
      category,
      technologies,
      cover,
      screenshots,
      videoLocal,
      readmeContent,
      readmeHtml,
      download: downloadInfo
    };

    projects.push(projectData);
    console.log(`  ✅ Project ready\n`);
  }

  fs.writeFileSync(path.join(dataDir, 'projects.json'), JSON.stringify(projects, null, 2));
  console.log(`✨ Prepared ${projects.length} project(s) successfully!\n`);
}

prepareProjects().catch(err => {
  console.error('Fatal error preparing projects:', err);
  process.exit(1);
});
