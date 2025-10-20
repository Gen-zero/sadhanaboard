import * as THREE from 'three';

// Module-level cache as requested
const textureCache: Map<string, THREE.Texture> = new Map();

/** Basic small fallback texture when loads fail */
export function createFallbackTexture(color: string = '#7f7f7f'): THREE.Texture {
  const size = 2;
  const data = new Uint8Array(size * size * 4);
  const c = new THREE.Color(color);
  for (let i = 0; i < size * size; i++) {
    data[i * 4 + 0] = Math.floor(c.r * 255);
    data[i * 4 + 1] = Math.floor(c.g * 255);
    data[i * 4 + 2] = Math.floor(c.b * 255);
    data[i * 4 + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.needsUpdate = true;
  tex.generateMipmaps = false;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

/** Create a procedural glow texture via canvas */
export function createGlowTexture(baseColor: string = '#ff0000', size = 128): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, baseColor);
  gradient.addColorStop(0.4, baseColor + 'cc');
  gradient.addColorStop(1, baseColor + '00');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.minFilter = THREE.LinearMipMapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

/** Preprocess a texture for yantra usage per the requested fields */
export function preprocessYantraImage(tex: THREE.Texture): THREE.Texture {
  // As requested in the verification comments
  // Note: colorSpace vs encoding differences across three versions; use the field suggested
  // Set both if available for compatibility
  try {
    // three r152+ uses colorSpace
    (tex as any).colorSpace = (THREE as any).SRGBColorSpace ?? undefined;
  } catch (e) {
    // ignore
  }
  // Backward compatible: assign to any to avoid TS property mismatch across versions
  (tex as any).encoding = (THREE as any).sRGBEncoding ?? (THREE as any).SRGBColorSpace ?? (tex as any).encoding;
  tex.flipY = false;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  // anisotropy needs a renderer to query; set a reasonable default if not available
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderer: any = (globalThis as any).__THREE_RENDERER__;
    const max = renderer?.capabilities?.getMaxAnisotropy?.() ?? 8;
    tex.anisotropy = Math.min(16, max);
  } catch (e) {
    tex.anisotropy = Math.min(16, (tex as any).anisotropy || 1);
  }
  tex.needsUpdate = true;
  return tex;
}

/** Validate that a texture loaded correctly */
export function validateTextureLoading(tex?: THREE.Texture): boolean {
  if (!tex) return false;
  const img: any = (tex as any).image;
  if (!img) return false;
  const w = img.width ?? img.videoWidth ?? 0;
  const h = img.height ?? img.videoHeight ?? 0;
  return isFinite(w) && isFinite(h) && w > 1 && h > 1;
}

/** Dispose helper */
export function disposeTexture(tex?: THREE.Texture) {
  if (tex) {
    try {
      tex.dispose?.();
    } catch (e) {
      // ignore
    }
  }
}

/** Load an HTMLImageElement with CORS handling */
function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (ev) => reject(new Error('Image failed to load: ' + url));
    img.src = url;
  });
}

/** Load a centered square cropped texture client-side */
export async function loadCroppedTexture(url: string, size = 1024): Promise<THREE.Texture> {
  const img = await loadImageElement(url);
  const minSide = Math.min(img.width, img.height);
  const sx = Math.floor((img.width - minSide) / 2);
  const sy = Math.floor((img.height - minSide) / 2);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  // draw centered square scaled to size
  ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  preprocessYantraImage(tex);
  return tex;
}

/** Wrap THREE.TextureLoader.loadAsync if available, otherwise fallback */
async function loadTextureAsync(url: string): Promise<THREE.Texture> {
  const loader = new THREE.TextureLoader();
  // three's loader has loadAsync in modern versions
  // @ts-ignore
  if (typeof (loader as any).loadAsync === 'function') {
    // @ts-ignore
    return (loader as any).loadAsync(url);
  }
  // fallback to manual Promise
  return new Promise((resolve, reject) => {
    loader.load(url, (t) => resolve(t), undefined, (err) => reject(err));
  });
}

/** Load yantra texture with cache, loadAsync, preprocess, and fallback */
export async function loadYantraTexture(path: string): Promise<THREE.Texture> {
  const key = path;
  if (textureCache.has(key)) return textureCache.get(key)!;
  try {
    const tex = await loadTextureAsync(path);
    preprocessYantraImage(tex);
    if (!validateTextureLoading(tex)) throw new Error('validation failed');
    textureCache.set(key, tex);
    return tex;
  } catch (e) {
    console.warn('loadYantraTexture failed for', path, e);
    const fb = createFallbackTexture('#222222');
    textureCache.set(key, fb);
    return fb;
  }
}

/** Specific loader for Mahakali yantra (uses cropped texture) */
export async function createMahakaliYantraTexture(): Promise<THREE.Texture> {
  const path = '/icons/mahakali-yantra.png';
  try {
    // try to load the cropped texture first
    const tex = await loadCroppedTexture(path, 1024);
    return tex;
  } catch (err) {
    console.warn('Failed to load cropped Mahakali yantra, trying direct load:', err);
    try {
      // fallback to direct load
      const tex = await loadYantraTexture(path);
      return tex;
    } catch (err2) {
      console.warn('Failed to load Mahakali yantra texture, using fallback:', err2);
      // create a procedural fallback texture
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      
      // Create a yantra-like pattern
      ctx.fillStyle = '#ff0000'; // More intense red
      ctx.fillRect(0, 0, 256, 256);
      
      // Draw a more complex yantra pattern
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      // Outer triangle
      ctx.moveTo(128, 30);
      ctx.lineTo(220, 220);
      ctx.lineTo(36, 220);
      ctx.closePath();
      ctx.fill();
      
      // Inner triangle
      ctx.beginPath();
      ctx.moveTo(128, 60);
      ctx.lineTo(190, 190);
      ctx.lineTo(66, 190);
      ctx.closePath();
      ctx.fill();
      
      // Central circle
      ctx.beginPath();
      ctx.arc(128, 128, 30, 0, Math.PI * 2);
      ctx.fill();
      
      // Add some fierce decorative elements
      ctx.fillStyle = '#ffffff';
      // Skull symbols
      ctx.beginPath();
      ctx.arc(128, 128, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Cross bones
      ctx.fillRect(120, 125, 16, 4);
      ctx.fillRect(125, 120, 4, 16);
      
      const tex = new THREE.CanvasTexture(canvas);
      preprocessYantraImage(tex);
      textureCache.set(path, tex);
      return tex;
    }
  }
}

/** Create Tara yantra texture with blue/silver color scheme and fallbacks */
export async function createTaraYantraTexture(): Promise<THREE.Texture> {
  const path = '/themes/tara/assets/tara-yantra.svg';
  console.log('createTaraYantraTexture: Starting with path:', path);
  
  try {
    console.log('createTaraYantraTexture: Attempting loadCroppedTexture...');
    const tex = await loadCroppedTexture(path, 1024);
    console.log('createTaraYantraTexture: Successfully loaded cropped texture:', tex);
    return tex;
  } catch (err) {
    console.warn('Failed to load cropped Tara yantra, trying direct load:', err);
    try {
      console.log('createTaraYantraTexture: Attempting direct loadYantraTexture...');
      const tex = await loadYantraTexture(path);
      console.log('createTaraYantraTexture: Successfully loaded yantra texture:', tex);
      return tex;
    } catch (err2) {
      console.warn('Failed to load Tara yantra texture, creating procedural fallback:', err2);
      console.log('createTaraYantraTexture: Creating procedural fallback texture...');
      // procedural fallback with Tara-specific blue colors
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;

      // base deep blue representing the void/cremation ground
      ctx.fillStyle = '#000022';
      ctx.fillRect(0, 0, 256, 256);

      // draw triangular yantra in sapphire blue
      ctx.fillStyle = '#0066ff';
      ctx.beginPath();
      ctx.moveTo(128, 24);
      ctx.lineTo(232, 220);
      ctx.lineTo(24, 220);
      ctx.closePath();
      ctx.fill();

      // inner triangle
      ctx.beginPath();
      ctx.moveTo(128, 64);
      ctx.lineTo(196, 196);
      ctx.lineTo(60, 196);
      ctx.closePath();
      ctx.fill();

      // blue lotus petals around the center
      ctx.fillStyle = '#66ccff';
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const px = 128 + Math.cos(a) * 36;
        const py = 128 + Math.sin(a) * 36;
        ctx.beginPath();
        ctx.ellipse(px, py, 18, 8, a, 0, Math.PI * 2);
        ctx.fill();
      }

      // central circle with Om-like symbol
      ctx.fillStyle = '#ccffff';
      ctx.beginPath();
      ctx.arc(128, 128, 18, 0, Math.PI * 2);
      ctx.fill();

      // small silver decorations (skull motifs)
      ctx.fillStyle = '#c0dfff';
      ctx.fillRect(120, 120, 4, 12);
      ctx.fillRect(132, 120, 4, 12);
      
      // crimson accents for cremation ground fire
      ctx.fillStyle = '#cc0066';
      ctx.beginPath();
      ctx.arc(110, 110, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(146, 146, 3, 0, Math.PI * 2);
      ctx.fill();

      const tex = new THREE.CanvasTexture(canvas);
      preprocessYantraImage(tex);
      textureCache.set(path, tex);
      console.log('createTaraYantraTexture: Successfully created procedural fallback texture');
      return tex;
    }
  }
}

// export cache for debugging
export { textureCache };

/**
 * Backwards-compatible parchment fallback and displacement creators left out
 * to keep this file focused on yantra texture utilities. Use createFallbackTexture
 * above for fallback UI.
 */

/**
 * Create a procedural grayscale displacement map using a canvas.
 * Returns a THREE.Texture suitable for use as a displacementMap.
 */
export function createDisplacementMap(size = 256, intensity = 1): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const imageData = ctx.createImageData(size, size);
  // Simple noise-based displacement
  for (let i = 0; i < size * size; i++) {
    // value between 0..255, use a softened random noise for gentle displacement
    const v = Math.floor((Math.random() * 0.5 + 0.25) * 255 * intensity);
    imageData.data[i * 4 + 0] = v;
    imageData.data[i * 4 + 1] = v;
    imageData.data[i * 4 + 2] = v;
    imageData.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.minFilter = THREE.LinearMipMapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}
