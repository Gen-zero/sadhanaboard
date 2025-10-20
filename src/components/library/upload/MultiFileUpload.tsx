import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import type { ProcessedFile } from '@/types/books';

interface Props {
  onFilesProcessed: (files: ProcessedFile[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

const formatSize = (n: number) => {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
};

export default function MultiFileUpload({ onFilesProcessed, maxFiles = 20, acceptedTypes = ['.pdf'] }: Props) {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Add multiple files at once with validation against latest state
  const addFiles = (incoming: File[]) => {
    if (!incoming || incoming.length === 0) return;
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedExts = acceptedTypes.map(a => a.replace('.', '').toLowerCase());
    setFiles((prev) => {
      const next: ProcessedFile[] = [...prev];
      // Track names+size of existing to detect duplicates
      const seen = new Set(prev.map(p => `${p.name}::${p.size}`));
      for (const f of incoming) {
        if (next.length >= maxFiles) break;
        const id = (crypto && (crypto as any).randomUUID ? (crypto as any).randomUUID() : String(Date.now()) + Math.random().toString(36).slice(2));
        const ext = f.name.split('.').pop()?.toLowerCase() || '';
        let status: ProcessedFile['status'] = 'pending';
        let error: string | undefined;
        const key = `${f.name}::${f.size}`;
        if (!allowedExts.includes(ext)) {
          status = 'error'; error = 'Invalid file type';
        } else if (f.size > maxSize) {
          status = 'error'; error = 'File too large (max 50MB)';
        } else if (seen.has(key)) {
          status = 'error'; error = 'Duplicate file in batch';
        }
        // mark as seen so subsequent incoming duplicates are flagged
        seen.add(key);
        const p: ProcessedFile = { file: f, id, name: f.name, size: f.size, status, error };
        next.push(p);
        // simulate processing transition after adding
        setTimeout(() => {
          setFiles((curr) => {
            const updated = curr.map(x => x.id === id ? ({ ...x, status: (x.status === 'error' ? 'error' : 'ready') as ProcessedFile['status'] }) : x);
            onFilesProcessed(updated.filter(x => x.status === 'ready'));
            return updated;
          });
        }, 120);
      }
      // notify ready/pending files immediately
      onFilesProcessed(next.filter(x => x.status === 'ready' || x.status === 'pending'));
      return next.slice(0, maxFiles);
    });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const list = Array.from(e.dataTransfer.files || []);
    addFiles(list.slice(0, maxFiles));
  };

  const onBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files || []);
    addFiles(list.slice(0, maxFiles));
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const next = prev.filter(x => x.id !== id);
      onFilesProcessed(next.filter(x => x.status === 'ready'));
      return next;
    });
  };

  const clearAll = () => {
    setFiles([]);
    onFilesProcessed([]);
  };

  const removeFailed = () => {
    setFiles((prev) => {
      const next = prev.filter(x => x.status !== 'error');
      onFilesProcessed(next.filter(x => x.status === 'ready'));
      return next;
    });
  };

  return (
    <Card>
      <CardContent>
        <div
          className={`p-6 border-2 rounded-md text-center ${isDragging ? 'border-primary bg-primary/5' : 'border-dashed'} `}
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
        >
          <div className="flex items-center justify-center gap-4">
            <FileText size={36} />
            <div>
              <div className="font-semibold">Drag & drop PDF files here</div>
              <div className="text-sm text-muted-foreground">Up to {maxFiles} files, max 50MB each</div>
              <div className="mt-3">
                <input ref={inputRef} type="file" multiple accept={acceptedTypes.join(',')} onChange={onBrowse} className="hidden" id="multi-file-input" />
                <label htmlFor="multi-file-input">
                  <Button onClick={() => inputRef.current?.click()}>Browse files</Button>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center">
              <div className="text-sm">{files.length} files</div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={removeFailed}>Remove Failed</Button>
                <Button variant="ghost" onClick={clearAll}>Clear All</Button>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
              {files.map(f => (
                <div key={f.id} className="p-2 border rounded flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded">
                      {f.status === 'ready' ? <CheckCircle className="text-green-600" /> : f.status === 'error' ? <AlertCircle className="text-red-600" /> : <FileText />}
                    </div>
                    <div>
                      <div className="font-medium">{f.name}</div>
                      <div className="text-xs text-muted-foreground">{formatSize(f.size)}</div>
                      {f.error && <div className="text-xs text-red-600">{f.error}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={f.status === 'error' ? 'destructive' : f.status === 'ready' ? 'outline' : 'secondary'}>{f.status}</Badge>
                    <Button variant="ghost" onClick={() => removeFile(f.id)}><X /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
