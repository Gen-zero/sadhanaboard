import React, { useState, useMemo } from 'react';
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { SpiritualBook } from '@/types/books';

interface Props {
  books: SpiritualBook[];
  onSave: (updates: Map<string, Partial<SpiritualBook>>) => Promise<void>;
  onClose: () => void;
}

export default function BatchMetadataEditor({ books, onSave, onClose }: Props) {
  const [edited, setEdited] = useState<Map<string, Partial<SpiritualBook>>>(new Map());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const setField = (id: string, field: keyof SpiritualBook, value: any) => {
    setEdited(prev => {
      const next = new Map(prev);
      const cur = next.get(id) || {};
      next.set(id, { ...cur, [field]: value });
      return next;
    });
  };

  const applyToSelected = (values: Partial<SpiritualBook>) => {
    setEdited(prev => {
      const next = new Map(prev);
      selectedIds.forEach(id => {
        const cur = next.get(id) || {};
        next.set(id, { ...cur, ...values });
      });
      return next;
    });
  };

  const handleSave = async () => {
    if (edited.size === 0) return onClose();
    setIsSaving(true);
    try {
      await onSave(edited);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Batch Metadata Editor</div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => applyToSelected({ author: 'Unknown' })}>Apply Unknown Author</Button>
          <Button variant="outline" onClick={() => applyToSelected({ language: 'english' })}>Apply English</Button>
        </div>
      </div>

      <div className="overflow-auto max-h-[60vh]">
        <Table>
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Author</th>
              <th>Traditions</th>
              <th>Year</th>
              <th>Language</th>
            </tr>
          </thead>
          <tbody>
            {books.map(b => {
              const e = edited.get(b.id) || {};
              return (
                <tr key={b.id} className={`${edited.has(b.id) ? 'bg-slate-50' : ''}`}>
                  <td><input type="checkbox" checked={selectedIds.has(b.id)} onChange={() => toggleSelect(b.id)} /></td>
                  <td><Input value={(e.title as string) ?? b.title} onChange={(ev) => setField(b.id, 'title', ev.target.value)} /></td>
                  <td><Input value={(e.author as string) ?? b.author} onChange={(ev) => setField(b.id, 'author', ev.target.value)} /></td>
                  <td><Input value={(e.traditions as unknown as string) ?? (b.traditions || []).join(', ')} onChange={(ev) => setField(b.id, 'traditions', ev.target.value.split(',').map(s=>s.trim()).filter(Boolean))} /></td>
                  <td><Input value={(e.year as unknown as string) ?? (b.year ? String(b.year) : '')} onChange={(ev) => setField(b.id, 'year', ev.target.value ? Number(ev.target.value) : undefined)} /></td>
                  <td><Input value={(e.language as string) ?? (b.language || '')} onChange={(ev) => setField(b.id, 'language', ev.target.value)} /></td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
      </div>
    </div>
  );
}
