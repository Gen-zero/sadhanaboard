import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminApi } from '@/services/adminApi';

const ThemePreviewPage = () => {
  const [params] = useSearchParams();
  const themeId = params.get('themeId');
  const [css, setCss] = useState('');
  const [themeName, setThemeName] = useState('Theme Preview');

  useEffect(() => {
    if (!themeId) return;
    (async () => {
      try {
        const r = await adminApi.previewTheme(Number(themeId));
        setCss(r.css || '');
        // try to surface name if available
        // adminApi.previewTheme may also return theme
        if ((r as any).theme && (r as any).theme.name) setThemeName((r as any).theme.name);
      } catch (err) {
        setCss('/* preview fetch failed */');
      }
    })();
  }, [themeId]);

  return (
    <div className="min-h-screen p-6 bg-surface text-foreground">
      <h2 className="text-2xl font-bold mb-4">{themeName}</h2>
      <div className="mb-4">
        <small className="text-muted-foreground">This preview injects the theme CSS into a demo iframe below.</small>
      </div>

      <div className="mb-6">
        <pre className="whitespace-pre-wrap text-sm bg-muted p-3 rounded">{css}</pre>
      </div>

      <div className="border rounded overflow-hidden">
        <iframe title="theme-preview" style={{ width: '100%', height: 480, border: 'none' }} srcDoc={`<!doctype html><html><head><meta charset="utf-8"><style>${css}</style><style>body{font-family:system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; padding:20px}</style></head><body><h1>Preview Area</h1><p>This is a small preview area to validate colors, borders and typographic scale.</p><button>Primary</button><button style="margin-left:8px;background:var(--accent);color:white;padding:8px;border-radius:6px">Accent</button><div style="margin-top:12px;padding:12px;border:1px solid var(--border)">Border example</div></body></html>`} />
      </div>
    </div>
  );
};

export default ThemePreviewPage;
