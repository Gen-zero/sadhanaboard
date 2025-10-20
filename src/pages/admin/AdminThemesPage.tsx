import { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const AdminThemesPage = () => {
  const [themes, setThemes] = useState<any[]>([]);
  const load = async () => {
    const r = await adminApi.listThemes();
    // r.items is expected to be an array of { id, metadata, available, overrides }
    setThemes(r.items || r || []);
  };
  useEffect(() => { load(); }, []);

  const toggleAvailability = async (id: string, value: boolean) => {
    await fetch(`/api/admin/themes/${id}/availability`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ available: !!value }) });
    load();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
        <CardHeader><CardTitle>Themes</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {themes.map((t: any) => {
              const meta = t.metadata || (t.registry || {});
              const name = meta?.name || t.name || t.id;
              const deity = meta?.deity || t.deity || '-';
              const category = meta?.category || '-';
              const gradient = meta?.gradient || '';
              return (
                <div key={t.id} className="flex items-center justify-between border border-border/30 rounded-md p-3">
                  <div>
                    <div className="text-sm font-medium">{name} <span className="text-xs text-muted-foreground">{category}</span></div>
                    <div className="text-xs text-muted-foreground">{deity} • {meta?.description || ''}</div>
                    {gradient && <div className={`w-40 h-6 mt-2 rounded-md bg-gradient-to-r ${gradient}`} />}
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={!!t.available} onCheckedChange={(v) => toggleAvailability(String(t.id), !!v)} />
                    <Button variant="outline" size="sm" onClick={() => window.open(`/admin/theme-preview?themeId=${t.id}`, '_blank')}>Preview</Button>
                  </div>
                </div>
              );
            })}
            {!themes.length && <div className="text-sm text-muted-foreground">No themes</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminThemesPage;


