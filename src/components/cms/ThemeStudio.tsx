import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useCmsData from '@/hooks/useCmsData';
import { cmsApi } from '@/services/cmsApi';

export default function ThemeStudio() {
  const { themes, themesLoading, loadThemes } = useCmsData();
  const [creating, setCreating] = useState(false);
  const [palette, setPalette] = useState({ primary: '#6b21a8', secondary: '#ef4444', accent: '#f97316' });
  const [name, setName] = useState('Untitled Theme');

  const applyPreview = () => {
    // inject a small style tag to preview CSS variables
    const id = 'cms-theme-preview';
    let el = document.getElementById(id) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement('style');
      el.id = id;
      document.head.appendChild(el);
    }
    el.innerHTML = `:root { --cms-primary: ${palette.primary}; --cms-secondary: ${palette.secondary}; --cms-accent: ${palette.accent}; }`;
  };

  const createTheme = async () => {
    setCreating(true);
    try {
      await cmsApi.createTheme({ name, color_palette: palette });
      await loadThemes();
    } catch (e) {
      console.error('create theme error', e);
    } finally { setCreating(false); }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Studio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button onClick={() => loadThemes()}>Refresh</Button>
          </div>
          <div className="flex items-center gap-2">
            <input className="border p-1 rounded" value={name} onChange={(e) => setName(e.target.value)} />
            <Button onClick={applyPreview}>Apply Preview</Button>
            <Button onClick={createTheme} disabled={creating}>{creating ? 'Creating...' : 'Create theme'}</Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs">Primary</label>
            <input type="color" value={palette.primary} onChange={(e) => setPalette(p => ({ ...p, primary: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs">Secondary</label>
            <input type="color" value={palette.secondary} onChange={(e) => setPalette(p => ({ ...p, secondary: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs">Accent</label>
            <input type="color" value={palette.accent} onChange={(e) => setPalette(p => ({ ...p, accent: e.target.value }))} />
          </div>
        </div>

        <div>
          {themesLoading ? <div>Loading themes...</div> : (
            <ul className="space-y-2">
              {themes.map(t => (
                <li key={t.id} className="p-2 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.deity || ''}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div style={{ width: 36, height: 24, backgroundColor: (t.color_palette && t.color_palette.primary) || '#eee', borderRadius: 4 }} />
                    <Button size="sm">Edit</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
