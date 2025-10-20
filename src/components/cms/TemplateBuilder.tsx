import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useCmsData from '@/hooks/useCmsData';
import { cmsApi } from '@/services/cmsApi';

// dynamic dnd-kit fallback (if not installed, simple append-only list)
let DndContext: any, SortableContext: any, arrayMove: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const dnd = require('@dnd-kit/core');
  const sortable = require('@dnd-kit/sortable');
  DndContext = dnd.DndContext;
  SortableContext = sortable.SortableContext;
  arrayMove = require('@dnd-kit/sortable').arrayMove;
} catch (e) {
  DndContext = null;
  SortableContext = null;
  arrayMove = (arr: any[], from: number, to: number) => arr;
}

export default function TemplateBuilder() {
  const { templates, templatesLoading, loadTemplates } = useCmsData();
  const [components, setComponents] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const palette = useMemo(() => [
    { id: 'mantra', label: 'Mantra' },
    { id: 'timer', label: 'Timer' },
    { id: 'breath', label: 'Breath' },
    { id: 'yantra', label: 'Yantra' },
  ], []);

  const addComponent = (c: any) => setComponents(s => [...s, { ...c, uid: Date.now() }]);

  const saveTemplate = async () => {
    setSaving(true);
    try {
      await cmsApi.createTemplate({ title: `Template ${Date.now()}`, components });
      await loadTemplates();
      setComponents([]);
    } catch (e) { console.error('save template', e); } finally { setSaving(false); }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {palette.map(p => (
              <Button key={p.id} size="sm" onClick={() => addComponent(p)}>{p.label}</Button>
            ))}
          </div>
          <div>
            <Button onClick={() => loadTemplates()}>Refresh</Button>
            <Button onClick={saveTemplate} disabled={saving}>{saving ? 'Saving...' : 'Save Template'}</Button>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Canvas</h4>
          <div className="min-h-[160px] border rounded p-2">
            {components.length === 0 ? <div className="text-sm text-muted-foreground">Drag components here (or click buttons)</div> : (
              <ol className="space-y-2">
                {components.map(c => (
                  <li key={c.uid} className="p-2 border rounded">{c.label || c.id}</li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Existing Templates</h4>
          {templatesLoading ? <div>Loading templates...</div> : (
            <ul className="space-y-2">
              {templates.map(t => (
                <li key={t.id} className="p-2 border rounded">{t.title}</li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
