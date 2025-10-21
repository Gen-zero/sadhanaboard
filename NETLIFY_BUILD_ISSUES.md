# Netlify Build Issues and Solutions

## Issue 1: Radix UI Module Resolution Error

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

2. **Update Node.js Version**: The .nvmrc file was specifying an invalid Node.js version (20.16.0). This has been updated to a valid LTS version (20.11.1).

3. **Clean Installation**: Perform a clean installation of dependencies:
   ```bash
   # Remove existing node_modules and package-lock.json
   rm -rf node_modules package-lock.json
   
   # Install dependencies
   npm install
   ```

## Issue 2: Invalid Node.js Version

### Problem
The build process attempted to use Node.js version '20.16.0' from the .nvmrc file which is not a valid Node.js release.

### Solution
Updated the .nvmrc file to use a valid LTS Node.js version:
```
20.11.1
```

This version is:
- A valid Node.js release
- Compatible with the project's requirements
- Supported by Netlify

## Deployment Steps

1. **Update .nvmrc**:
   ```
   20.11.1
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
5. Consider using a different Node.js version if 20.11.1 still causes issues

## Verification

After implementing these fixes:
1. Local build should succeed with `npm run build`
2. TypeScript compilation should complete without errors
3. All Radix UI components should be properly imported and resolved
4. Netlify build should complete successfully

This should resolve the "Could not resolve entry module" error and allow the application to build successfully on Netlify.