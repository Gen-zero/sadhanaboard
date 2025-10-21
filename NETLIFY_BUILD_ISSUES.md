# Netlify Build Issues and Solutions

## Issue 1: Node.js Version Mismatch

### Problem
The build failed due to unsupported Node.js version. The required Node.js version is '>=20.16.0' but the current version was set to '20.11.1'. Additionally, there's an unsupported engine for package 'pdfjs-dist@5.3.93'.

### Diagnosis
This error indicates that:

1. The project requires Node.js >=20.16.0 (as specified in package.json engines)
2. The pdfjs-dist@5.3.93 package specifically requires Node.js >=20.16.0 or >=22.3.0
3. The .nvmrc file was specifying an older version (20.11.1) that doesn't meet these requirements

### Solution
1. **Update Node.js Version**: The .nvmrc file has been updated to use Node.js version 22.19.0 which:
   - Meets the pdfjs-dist@5.3.93 requirement (>=20.16.0 or >=22.3.0)
   - Is a valid, stable Node.js version
   - Is supported by Netlify

2. **Verify pdfjs-dist Dependency**: The pdfjs-dist package is properly included as a dependency of react-pdf in package.json:
   ```json
   "react-pdf": "^10.1.0",
   ```

## Issue 2: Radix UI Module Resolution Error

### Problem
The Netlify build log shows the error:
```
Could not resolve entry module "@radix-ui/react-*".
```

### Diagnosis
This error indicates that Netlify cannot resolve the Radix UI React components during the build process. This typically happens when:

1. The Radix UI packages are not properly listed in dependencies
2. The packages are not installed correctly
3. There are version conflicts or missing peer dependencies

### Solution
1. **Verify Dependencies**: All Radix UI packages are correctly listed in package.json:
   ```json
   "@radix-ui/react-accordion": "^1.2.12",
   "@radix-ui/react-alert-dialog": "^1.1.15",
   // ... other Radix UI packages
   ```

2. **Clean Installation**: Perform a clean installation of dependencies:
   ```bash
   # Remove existing node_modules and package-lock.json
   rm -rf node_modules package-lock.json
   
   # Install dependencies
   npm install
   ```

## Deployment Steps

1. **Update .nvmrc**:
   ```
   22.19.0
   ```

2. **Commit Changes**:
   ```bash
   git add .nvmrc
   git commit -m "Fix Node.js version for Netlify build"
   git push origin main
   ```

3. **Trigger New Build**: 
   - Push changes to GitHub to trigger a new Netlify build
   - Or manually trigger a new build in the Netlify dashboard

## Additional Recommendations

1. **Check Radix UI Installation**: 
   - Ensure all Radix UI packages are properly installed in node_modules/@radix-ui/
   - If issues persist, try installing Radix UI packages individually:
     ```bash
     npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip
     ```

2. **Clear Netlify Cache**: 
   - In Netlify dashboard, go to Deploys → Trigger deploy → Clear cache and deploy site

3. **Verify Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist/`

## Troubleshooting

If the build continues to fail:

1. Check Netlify build logs for specific error messages
2. Ensure all dependencies are correctly listed in package.json
3. Verify that no wildcard imports exist (e.g., `import * from '@radix-ui/react-*'`)
4. Check for any custom import paths that might be causing resolution issues
5. Consider using a different Node.js version if 22.19.0 still causes issues

## Verification

After implementing these fixes:
1. Local build should succeed with `npm run build`
2. TypeScript compilation should complete without errors
3. All Radix UI components should be properly imported and resolved
4. Netlify build should complete successfully

This should resolve the "Could not resolve entry module" error and allow the application to build successfully on Netlify.