# Deployment Configuration

This project is configured for deployment with the following settings:

## Build Configuration

- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18+ (specified in `.nvmrc`)
- **CI Deployment**: `.github/workflows/deploy.yml` (GitHub Pages)

## Build Process

1. Install dependencies: `npm ci` or `npm install`
2. Build the application: `npm run build`
3. Output is generated in the `dist/` directory

## Server Configuration Files

The following configuration files are included for different hosting platforms:

- `netlify.toml` - Netlify deployment configuration
- `vercel.json` - Vercel deployment configuration
- `public/_headers` - Netlify headers file
- `public/_redirects` - Netlify redirects file
- `public/.nojekyll` - GitHub Pages configuration (prevents the default Jekyll processing)

## Important Notes

- The build process transforms `index.html` to reference built JavaScript files
- Source TypeScript files (`.ts`, `.tsx`) are handled with correct MIME types as fallback
- All JavaScript files are served with `application/javascript` MIME type
- Source files in `/src/*` are blocked in production

## GitHub Pages Deployment

The repository includes an automated workflow that builds the project and deploys the contents of `dist/` to GitHub Pages:

1. Push to the `main` branch (or trigger the workflow manually).
2. The workflow installs dependencies, runs the Vite production build, copies the `CNAME` file into the build output, and uploads the artifact.
3. GitHub Pages publishes the artifact, ensuring the generated HTML references hashed JavaScript bundles instead of the TypeScript entrypoint.

After enabling GitHub Pages (Settings → Pages → Source: GitHub Actions), verify:

1. The deployed HTML references `/assets/index-[hash].js` (not `/src/main.tsx`).
2. No MIME type errors appear in the browser console.
3. The application loads and functions correctly.

