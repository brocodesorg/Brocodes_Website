# Adding Projects to BroCodes

BroCodes is built so you can keep your code in separate GitHub repositories. You do **not** need to store your full source code in this repository.

---

## How It Works

When you want to add a project (e.g. `123`):

1. **Tell me the project name and GitHub repo link**, or create a folder:
   ```text
   projects/123/
   ├── project.json              # Title, summary, githubUrl
   ├── README.md                 # (Optional) Description and instructions
   └── media/
       └── screenshots/          # Paste your screenshots here!
           ├── 01.webp
           └── 02.webp
   ```

2. **Paste your screenshots or videos:**
   - Drop images into `projects/123/media/screenshots/`
   - Drop optional video into `projects/123/media/preview.mp4`

3. **In `project.json`:**
   ```json
   {
     "title": "Project 123",
     "summary": "Short attractive description of what this project does.",
     "category": "Web App",
     "technologies": ["React", "TypeScript", "Tailwind CSS"],
     "githubUrl": "https://github.com/yourusername/123",
     "liveUrl": "https://demo.example.com"
   }
   ```

4. **Run `npm run build`** (or let me run it):
   - BroCodes will automatically link the **"Download Project ZIP"** button to your GitHub archive: `https://github.com/yourusername/123/archive/refs/heads/main.zip`.
   - Your screenshots will automatically appear in the tile slideshow and the top showcase on the detail page.
   - The README will be rendered as clean, formatted documentation below the action buttons.