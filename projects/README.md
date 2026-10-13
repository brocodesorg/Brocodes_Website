# BroCodes — Projects Directory

This directory holds all real projects showcased on BroCodes.

## How it works

Each project lives in its own subdirectory:

```text
projects/
  <project-slug>/
    project.json              # Required metadata (title, summary, tech, category, etc.)
    README.md                 # Project documentation shown on detail page
    media/                    # Optional images and videos
      cover.webp              # Card cover image
      screenshots/            # Array of screenshots for slideshow
        01.webp
        02.webp
      preview.mp4             # Video preview (or use videoUrl in project.json)
    [source files...]         # Your real project files (automatically packaged into .zip on build)
```

## Adding a New Project

1. Create a folder: `projects/my-project/` (lowercase slug).
2. Copy `project.json` template from `docs/PROJECT_TEMPLATE.md` and customize it.
3. Add screenshots/media in `projects/my-project/media/`.
4. Add your project source code and a `README.md`.
5. Run `npm run validate` to verify.
6. Run `npm run build` to package the ZIP and generate static pages.
