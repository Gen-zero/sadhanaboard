import { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AdminTemplatesPage = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [purpose, setPurpose] = useState('');
  const [duration, setDuration] = useState('9 days');

  const load = async () => { const r = await adminApi.listTemplates(); setTemplates(r.templates); };
  useEffect(() => { load(); }, []);

  const add = async () => {
    await adminApi.createTemplate({ title, purpose, duration });
    setTitle(''); setPurpose('');
    load();
  };
  const remove = async (id: number) => { await adminApi.deleteTemplate(id); load(); };

  return (
    <div className="space-y-6">
      <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
        <CardHeader><CardTitle>Create Sadhana Template</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-4 gap-3">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input placeholder="Purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
          <Input placeholder="Duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
          <Button onClick={add} disabled={!title || !purpose}>Create</Button>
        </CardContent>
      </Card>
      <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
        <CardHeader><CardTitle>Templates</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {templates.map(t => (
              <div key={t.id} className="flex items-center justify-between border border-border/30 rounded-md p-2">
                <div className="text-sm"><span className="font-medium">{t.title}</span> • {t.purpose} • {t.duration}</div>
                <Button variant="outline" size="sm" onClick={() => remove(t.id)}>Delete</Button>
              </div>
            ))}
            {!templates.length && <div className="text-sm text-muted-foreground">No templates</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTemplatesPage;


