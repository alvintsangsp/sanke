# Deployment Configuration

This project is configured for deployment with the following settings:

## Build Configuration

- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18+ (specified in `.nvmrc`)

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
- `public/.htaccess` - Apache server configuration
- `.nojekyll` - GitHub Pages configuration

## Important Notes

- The build process transforms `index.html` to reference built JavaScript files
- Source TypeScript files (`.ts`, `.tsx`) are handled with correct MIME types as fallback
- All JavaScript files are served with `application/javascript` MIME type
- Source files in `/src/*` are blocked in production

## Verification

After deployment, verify:
1. The deployed HTML references `/assets/index-[hash].js` (not `/src/main.tsx`)
2. No MIME type errors in browser console
3. Application loads and functions correctly

