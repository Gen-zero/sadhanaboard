import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useCmsData from '@/hooks/useCmsData';

export default function ContentWorkflow() {
  const { templates, themes, templatesLoading, themesLoading, loadTemplates, loadThemes } = useCmsData();
  const [items, setItems] = useState<any[]>(templates || []);
  const [statusMap, setStatusMap] = useState<{ [k: string]: any[] }>({ draft: [], in_review: [], approved: [] });

  React.useEffect(() => { setItems(templates); setStatusMap({ draft: templates?.filter(t => t.status === 'draft') || [], in_review: templates?.filter(t => t.status === 'pending_review') || [], approved: templates?.filter(t => t.status === 'published') || [] }); }, [templates]);

  const moveItem = (item: any, to: string) => {
    // local move; real backend publish flow would be implemented later
    setStatusMap(s => {
      const copy: any = { draft: [...s.draft], in_review: [...s.in_review], approved: [...s.approved] };
      // remove from any lane
      for (const k of Object.keys(copy)) copy[k] = copy[k].filter((x: any) => x.id !== item.id);
      copy[to] = [item, ...copy[to]];
      return copy;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Workflow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button onClick={() => loadTemplates()}>Refresh</Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {['draft', 'in_review', 'approved'].map(k => (
            <div key={k} className="p-2 border rounded">
              <h4 className="text-sm font-medium mb-2">{k.replace('_', ' ').toUpperCase()}</h4>
              <div className="space-y-2">
                {(statusMap[k] || []).map((it: any) => (
                  <div key={it.id} className="p-2 border rounded flex items-center justify-between">
                    <div>{it.title}</div>
                    <div className="flex gap-1">
                      {k !== 'draft' && <Button size="sm" onClick={() => moveItem(it, 'draft')}>Draft</Button>}
                      {k !== 'in_review' && <Button size="sm" onClick={() => moveItem(it, 'in_review')}>Review</Button>}
                      {k !== 'approved' && <Button size="sm" onClick={() => moveItem(it, 'approved')}>Approve</Button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
