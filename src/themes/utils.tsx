import React from 'react';
import type { ThemeDefinition } from './types';

// Keep track of applied theme CSS to avoid duplicates
const appliedThemeCSS = new Set<string>();

export function camelToKebab(input: string): string {
  return input.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Apply a theme's color tokens to :root as CSS custom properties.
 * - Keys are mapped to --theme-<kebab-case-key>
 * - Common names (primary/secondary/accent/etc) are also mirrored to --color-*
 */
export function applyThemeColors(colors?: Record<string, string> | null) {
  if (!colors) return;
  const root = document?.documentElement;
  if (!root) return;
  
  // Add transition for smooth color changes
  const existingTransition = root.style.transition;
  root.style.transition = 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease';
  
  // Canonical variables: write keys as `--<kebab-key>` so the rest of the app
  // (which reads --background, --primary, etc.) picks them up directly.
  const canonicalMap: Record<string, string> = {};
  Object.entries(colors).forEach(([key, value]) => {
    try {
      const kebab = camelToKebab(key);
      const varName = `--${kebab}`;
      root.style.setProperty(varName, value as string);
      canonicalMap[key] = value as string;
    } catch (e) {
       
      console.warn('applyThemeColors error for', key, e);
    }
  });

  // Aliases to preserve compatibility: set some of the older names
  const aliasMap: Record<string, string> = {
    primary: '--color-primary',
    secondary: '--color-secondary',
    accent: '--color-accent',
    border: '--color-border',
    success: '--color-success',
    warning: '--color-warning',
    error: '--color-error',
    info: '--color-info',
    background: '--background',
  };

  Object.entries(aliasMap).forEach(([key, alias]) => {
    const val = canonicalMap[key];
    if (val) {
      try {
        root.style.setProperty(alias, val);
      } catch (e) {
         
        console.warn('applyThemeColors alias error for', alias, e);
      }
    }
  });
  
  // Remove transition after a short delay to prevent affecting other transitions
  setTimeout(() => {
    root.style.transition = existingTransition || '';
  }, 300);
}

/**
 * Apply a theme's CSS file if specified in assets
 */
export function applyThemeCSS(theme: ThemeDefinition) {
  // Remove any previously applied theme CSS
  const existingLink = document.getElementById('theme-css');
  if (existingLink) {
    existingLink.remove();
  }
  
  // Check if theme has a CSS file specified
  const cssPath = theme.assets?.css;
  if (cssPath && typeof cssPath === 'string') {
    // Check if we've already applied this CSS to avoid duplicates
    if (appliedThemeCSS.has(cssPath)) {
      return;
    }
    
    // Create a link element for the CSS file
    const link = document.createElement('link');
    link.id = 'theme-css';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = cssPath;
    
    // Add to head
    document.head.appendChild(link);
    
    // Mark as applied
    appliedThemeCSS.add(cssPath);
  }
}

/**
 * Render a theme icon. The theme metadata.icon may be either:
 * - a string path -> rendered as an <img>
 * - a React component (Lucide icon) -> rendered as a component
 */
export function renderThemeIcon(theme: ThemeDefinition, sizeClass?: string): JSX.Element {
  // Check for icon in metadata first, then in assets
  const icon = theme?.metadata?.icon || theme?.assets?.icon;
  const name = theme?.metadata?.name || theme?.metadata?.id || 'theme';
  const id = theme?.metadata?.id || 'unknown-id';
  const isDev = Boolean((import.meta as unknown as { env?: { DEV?: boolean } })?.env?.DEV);

  // Dev logging for easier debugging of icon resolution
  if (isDev) {
     
    console.debug('[renderThemeIcon] resolving icon', {
      themeId: id,
      themeName: name,
      iconValue: icon,
      iconType: typeof icon,
      sizeClass,
    });
  }

  // Helper to build a placeholder element (JSX)
  const buildPlaceholder = (title?: string): JSX.Element => {
    const placeholderTitle = title || `No icon for ${name}`;
    const baseClass = `rounded-full bg-muted ${sizeClass || 'w-8 h-8'}`;
    if (isDev) {
      // In dev show a small question mark for visual cue
      return (
        <div
          className={baseClass + ' flex items-center justify-center text-sm font-medium'}
          title={placeholderTitle}
          aria-hidden
        >
          ?
        </div>
      );
    }
    return <div className={baseClass} title={placeholderTitle} aria-hidden />;
  };

  if (!icon) {
    return buildPlaceholder(`Missing icon for ${name}`);
  }

  if (typeof icon === 'string') {
    // treat as image path
    const imgClass = `rounded-full object-cover ${sizeClass || 'w-8 h-8'}`;
    const altText = `${name} icon`;
    // onError will replace the broken image element with a placeholder to avoid broken icons in the UI.
    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
       
      console.warn(`[renderThemeIcon] image failed to load for theme "${name}" (id=${id}) at path: ${icon}`);
      try {
        const imgEl = e.currentTarget as HTMLImageElement;
        // Prevent loops if browser tries to reload
        imgEl.onerror = null;
        // Create a DOM placeholder element to replace the broken image
        const placeholder = document.createElement('div');
        placeholder.className = `rounded-full bg-muted ${sizeClass || 'w-8 h-8'}`;
        placeholder.setAttribute('title', `Missing icon for ${name}`);
        if (isDev) {
          placeholder.style.display = 'flex';
          placeholder.style.alignItems = 'center';
          placeholder.style.justifyContent = 'center';
          placeholder.style.fontSize = '0.75rem';
          placeholder.style.fontWeight = '500';
          placeholder.style.color = 'white';
          placeholder.textContent = '?';
        }
        if (imgEl.parentNode) {
          imgEl.parentNode.replaceChild(placeholder, imgEl);
        }
      } catch (err) {
         
        console.warn('[renderThemeIcon] error replacing broken image with placeholder', err);
      }
    };

    // Add debugging for Vishnu and Krishna themes specifically
    if (id === 'vishnu' || id === 'krishna') {
      console.log(`[DEBUG] Rendering icon for ${id} theme:`, { icon, iconType: typeof icon, sizeClass });
    }

    return (
       
      <img
        src={icon}
        className={imgClass}
        alt={altText}
        title={altText}
        onError={handleError}
        onLoad={() => {
          // Add success logging for Vishnu and Krishna themes
          if (id === 'vishnu' || id === 'krishna') {
            console.log(`[DEBUG] Successfully loaded icon for ${id} theme`);
          }
        }}
      />
    );
  }

  // Assume it's a React component (Lucide or similar). Add type guards and robust error handling.
  try {
    const IconCandidate = icon as unknown;

    // Basic type guard: icon should be a function (function component or forwardRef)
    const isRenderableComponent = typeof IconCandidate === 'function'
      || (typeof IconCandidate === 'object' && IconCandidate !== null && ('render' in (IconCandidate as Record<string, unknown>) || (IconCandidate as Record<string, unknown>).$$typeof));

    if (!isRenderableComponent) {
       
      console.warn(`[renderThemeIcon] icon for theme "${name}" (id=${id}) is not a renderable React component.`, icon);
      return buildPlaceholder(`Invalid icon for ${name}`);
    }

    const Icon = IconCandidate as React.ComponentType<Record<string, unknown>>;
    // Render the icon component. Wrap in try/catch to avoid breaking parent UI.
    try {
      return <Icon className={sizeClass || 'h-4 w-4'} aria-hidden title={`${name} icon`} />;
    } catch (renderErr) {
       
      console.warn(`[renderThemeIcon] failed to render React icon for theme "${name}" (id=${id})`, renderErr);
      return buildPlaceholder(`Render error for ${name}`);
    }
  } catch (e) {
    // Final fallback
     
    console.warn('renderThemeIcon: unexpected error while rendering icon for', name, e);
    return buildPlaceholder(`Error rendering icon for ${name}`);
  }
}

/**
 * Return a theme definition for a given id or theme object with fallback to the first
 * entry in the provided registry (if any). This helper purposefully does not depend on
 * the registry module to avoid circular imports; callers should pass the registry.
 */
export function getThemeWithFallback(
  idOrTheme: string | ThemeDefinition | undefined | null,
  registry: ThemeDefinition[] = []
): ThemeDefinition | undefined {
  if (!registry || registry.length === 0) return undefined;
  if (!idOrTheme) return registry[0];

  if (typeof idOrTheme === 'object') return idOrTheme;

  const found = registry.find((t) => String(t.metadata.id) === String(idOrTheme));
  return found || registry[0];
}

export default {
  camelToKebab,
  applyThemeColors,
  applyThemeCSS,
  renderThemeIcon,
  getThemeWithFallback,
};