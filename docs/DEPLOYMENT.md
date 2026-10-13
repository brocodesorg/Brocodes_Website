# Firebase Hosting Deployment

BroCodes is designed to be deployed to Google Firebase Hosting.

## Prerequisites

1. Node.js LTS installed
2. Firebase CLI installed: `npm install -g firebase-tools`
3. Google account for Firebase console

## Initial Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Follow the setup wizard

2. **Install Firebase CLI** (if not already installed)
   ```bash
   npm install -g firebase-tools
   ```

3. **Login to Firebase**
   ```bash
   firebase login
   ```

4. **Initialize Firebase Hosting**
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory to `dist`
   - Configure as single-page app? **No** (BroCodes uses static routing)
   - Set up automatic builds and deploys with GitHub? (Optional)

## Configuration Files

BroCodes includes:
- `firebase.json` - Firebase Hosting configuration
- `.firebaserc.example` - Example Firebase configuration (rename to `.firebaserc` and add your project ID)

## Local Development & Testing

```bash
# Install dependencies
npm install

# Validate projects
npm run validate

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Deployment

```bash
# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## Custom Domain (Optional)

After initial deployment:

1. In Firebase Console, go to Hosting → Domain
2. Click "Add custom domain"
3. Follow the DNS verification steps
4. Update your DNS records as instructed

## Build Output

The build process generates:
- `dist/` - Static site assets deployed to Firebase
- `public/downloads/` - Generated project ZIP files
- `public/media/projects/` - Optimized project media

## Troubleshooting

### Build Failures

Run `npm run validate` to check for project metadata errors before building.

### Deployment Issues

- Ensure `firebase.json` public directory is set to `dist`
- Verify you're deploying to the correct Firebase project
- Check Firebase console for deployment logs

### Local vs Production Differences

- Local development uses `astro dev`
- Production uses static build in `dist/`
- Test both with `npm run dev` and `npm run preview`

## CI/CD (GitHub Actions)

For automated deployment:

1. Store Firebase token as GitHub secret
2. Use Firebase's official GitHub Action
3. Configure workflow to build and deploy on push to main

Example workflow:
```yaml
name: Deploy to Firebase
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run validate
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          projectId: your-firebase-project-id
```