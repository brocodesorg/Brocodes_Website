# Project Template

Copy this template to `projects/<your-project-slug>/` and fill in the details.

## Required Files

- `project.json` - Project metadata
- `README.md` - Project documentation (shown on detail page)
- `media/` - Optional screenshots, cover, and video
- Your actual project files

## project.json Schema

```json
{
  "title": "Your Project Name",
  "summary": "Brief project description (1-2 sentences)",
  "description": "Optional longer description",
  "category": "Project category (e.g., Web App, CLI Tool, Game)",
  "technologies": ["Tech1", "Tech2", "Tech3"],
  "year": 2024,
  "featured": false,
  "cover": "media/cover.webp",
  "screenshots": [
    {
      "path": "media/screenshots/1.jpg",
      "alt": "Description of screenshot"
    }
  ],
  "videoUrl": "https://example.com/video.mp4",
  "videoLocal": "media/preview.mp4",
  "features": [
    "Feature 1",
    "Feature 2"
  ],
  "prerequisites": [
    "Node.js 18+",
    "Git"
  ],
  "installation": [
    "git clone <repo-url>",
    "cd project",
    "npm install"
  ],
  "usage": [
    "npm start",
    "Visit http://localhost:3000"
  ],
  "troubleshooting": [
    {
      "issue": "Common problem description",
      "solution": "How to fix it"
    }
  ],
  "liveUrl": "https://your-project-demo.com",
  "githubUrl": "https://github.com/yourusername/your-project",
  "enableDownload": true
}
```

## Media Guidelines

- Place screenshots in `media/screenshots/`
- Use descriptive filenames and alt text
- Prefer WebP/AVIF for images
- For videos: external hosting preferred for large files
- Local video goes in `media/preview.mp4`

## ZIP Download

- The build system automatically creates a downloadable ZIP
- Excludes: node_modules, .git, .env files, build outputs, etc.
- Includes: Your project files, README, media (for reference)
- Check console for build warnings about excluded files

## Adding Your Project

1. Create `projects/<your-project-slug>/`
2. Add `project.json` using the schema above
3. Add your `README.md`
4. Add screenshots/video to `media/`
5. Add your actual project files
6. Run `npm run validate` to check for errors
7. Run `npm run build` to generate the site
8. Test locally with `npm run preview`
9. Commit and deploy