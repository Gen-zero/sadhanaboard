import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import MultiFileUpload from './MultiFileUpload';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/services/adminApi';
import type { ProcessedFile, BookMetadata, UploadResult, BulkOperationResponse, CSVBookRow } from '@/types/books';
import Papa from 'papaparse';
import { useToast } from '@/hooks/use-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: () => void;
}

export default function BulkUploadDialog({ isOpen, onClose, onUploadComplete }: Props) {
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<ProcessedFile[]>([]);
  const [uploadMode, setUploadMode] = useState<'files' | 'url' | 'csv'>('files');
  const [metadataMap, setMetadataMap] = useState<Record<string, BookMetadata>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [results, setResults] = useState<UploadResult[]>([]);
  const [urlList, setUrlList] = useState<string[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<CSVBookRow[]>([]);
  const [csvMatches, setCsvMatches] = useState<Record<string, string>>({});

  const readyFiles = useMemo(() => selectedFiles.filter(f => f.status === 'ready'), [selectedFiles]);

  const onFilesProcessed = (files: ProcessedFile[]) => {
    setSelectedFiles(files);
    // ensure metadata entries exist
    const nextMeta = { ...metadataMap };
    files.forEach(f => {
      if (!nextMeta[f.id]) nextMeta[f.id] = { title: f.name.replace(/\.[^.]+$/, ''), author: '', traditions: [], language: 'english' };
    });
    setMetadataMap(nextMeta);
  };

  const handleUpload = async () => {
    setResults([]);
    if (uploadMode === 'files') {
      if (readyFiles.length === 0) return toast({ title: 'No files to upload' });
      const files = readyFiles.map(f => f.file);
      const metadataArray = readyFiles.map(f => metadataMap[f.id] || { title: f.name.replace(/\.[^.]+$/, ''), author: '', traditions: [], language: 'english' });
      setIsUploading(true);
      try {
        const res: BulkOperationResponse = await adminApi.bulkUploadBooks(files, metadataArray, (p) => {
          setProgressMap(prev => ({ ...prev, __global: Math.round(p.percent) }));
          // announce progress for screen readers
          const live = document.getElementById('bulk-upload-progress-live');
          if (live) live.textContent = `Upload ${Math.round(p.percent)}% complete`;
        });
        setResults(res.results || []);
        toast({ title: 'Bulk upload complete', description: `${res.summary?.successful ?? 0} succeeded, ${res.summary?.failed ?? 0} failed` });
        onUploadComplete && onUploadComplete();
      } catch (err: any) {
        toast({ title: 'Bulk upload failed', description: err.message || 'Upload failed', variant: 'destructive' });
      } finally {
        setIsUploading(false);
      }
      return;
    }

    if (uploadMode === 'url') {
      if (!urlList.length) return toast({ title: 'No URLs provided' });
      setIsUploading(true);
      try {
        // Build metadata array aligned with urls
        const metas = urlList.map((u, i) => ({ ...(metadataMap[u] || {}), title: metadataMap[u]?.title || `Imported ${i+1}`, author: metadataMap[u]?.author || 'Unknown', traditions: metadataMap[u]?.traditions || [], language: metadataMap[u]?.language || 'english' }));
        const res = await adminApi.bulkImportFromURLs(urlList, metas, (p) => {
          setProgressMap(prev => ({ ...prev, __global: Math.round(p.percent) }));
          const live = document.getElementById('bulk-upload-progress-live');
          if (live) live.textContent = `Import ${Math.round(p.percent)}% complete`;
        });
        setResults(res.results || []);
        toast({ title: 'URL import complete', description: `${res.summary?.successful ?? 0} succeeded, ${res.summary?.failed ?? 0} failed` });
        onUploadComplete && onUploadComplete();
      } catch (err: any) {
        toast({ title: 'URL import failed', description: err.message || 'Import failed', variant: 'destructive' });
      } finally {
        setIsUploading(false);
      }
      return;
    }

    if (uploadMode === 'csv') {
      if (!csvFile) return toast({ title: 'No CSV uploaded' });
      // Attempt to map CSV rows to files via csvMatches if provided; otherwise fail gracefully
      try {
        const parsed = csvPreview;
        // Build metadata and file lists
        const matchedFiles: File[] = [];
        const metas: any[] = [];
        for (const row of parsed) {
          const fname = String(row.filename || '').trim();
          const map = csvMatches[fname];
          if (!map) continue; // unmatched
          // map is expected to be a data URL key referencing selectedFiles entries
          const matched = selectedFiles.find(s => s.name === fname);
          if (!matched) continue;
          matchedFiles.push(matched.file);
          metas.push({ title: row.title, author: row.author, traditions: row.traditions ? String(row.traditions).split(',').map(s=>s.trim()).filter(Boolean) : [], description: row.description, year: row.year ? Number(row.year) : undefined, language: row.language || 'english' });
        }
        if (matchedFiles.length === 0) return toast({ title: 'No matched files to upload' });
        setIsUploading(true);
  const res = await adminApi.bulkUploadBooks(matchedFiles, metas, (p) => setProgressMap(prev => ({ ...prev, __global: Math.round(p.percent) })));
        setResults(res.results || []);
        toast({ title: 'CSV import complete', description: `${res.summary?.successful ?? 0} succeeded, ${res.summary?.failed ?? 0} failed` });
        onUploadComplete && onUploadComplete();
      } catch (err: any) {
        toast({ title: 'CSV import failed', description: err.message || 'Import failed', variant: 'destructive' });
      } finally {
        setIsUploading(false);
      }
    }

  }

  const handleApplyToAll = (values: Partial<BookMetadata>) => {
    const next = { ...metadataMap };
    Object.keys(next).forEach(k => { next[k] = { ...next[k], ...values }; });
    setMetadataMap(next);
  };

  // Determine if the Upload button should be enabled depending on active mode
  const canUpload = useMemo(() => {
    if (isUploading) return false;
    if (uploadMode === 'files') return readyFiles.length > 0;
    if (uploadMode === 'url') return urlList.length > 0;
    if (uploadMode === 'csv') {
      if (!csvPreview || csvPreview.length === 0) return false;
      // Count matched CSV rows that resolve to an existing selected file
      let matched = 0;
      for (const row of csvPreview) {
        const fname = String(row.filename || '').trim();
        if (!fname) continue;
        const mappedName = csvMatches[fname];
        if (!mappedName) continue;
        const exists = selectedFiles.some(s => s.name === mappedName);
        if (exists) matched++;
      }
      return matched > 0;
    }
    return false;
  }, [isUploading, uploadMode, readyFiles, urlList, csvPreview, csvMatches, selectedFiles]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Bulk Upload Books</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Button variant={uploadMode === 'files' ? 'default' : 'ghost'} onClick={() => setUploadMode('files')}>Upload Files</Button>
            <Button variant={uploadMode === 'url' ? 'default' : 'ghost'} onClick={() => setUploadMode('url')}>Import from URL</Button>
            <Button variant={uploadMode === 'csv' ? 'default' : 'ghost'} onClick={() => setUploadMode('csv')}>CSV Import</Button>
          </div>

          <div className="mt-4">
            {uploadMode === 'files' && (
              <MultiFileUpload onFilesProcessed={onFilesProcessed} />
            )}

            {uploadMode === 'url' && (
              <div className="space-y-2">
                <div className="text-sm">Add one or more URLs (http(s) PDF links), one per line</div>
                <textarea className="w-full border rounded p-2" rows={4} value={urlList.join('\n')} onChange={(e) => setUrlList(e.target.value.split('\n').map(s => s.trim()).filter(Boolean))} />
                {urlList.length > 0 && (
                  <div className="space-y-2">
                    <div className="font-medium">URL list</div>
                    {urlList.map((u, idx) => (
                      <div key={u} className="flex items-center gap-2 p-2 border rounded">
                        <div className="flex-1 text-sm break-words">{u}</div>
                        <input placeholder="Title" className="border rounded px-2 py-1" value={metadataMap[u]?.title || ''} onChange={(e) => setMetadataMap(prev => ({ ...prev, [u]: { title: e.target.value, author: prev[u]?.author || '', traditions: prev[u]?.traditions || [], description: prev[u]?.description, year: prev[u]?.year, language: prev[u]?.language || 'english' } }))} />
                        <input placeholder="Author" className="border rounded px-2 py-1" value={metadataMap[u]?.author || ''} onChange={(e) => setMetadataMap(prev => ({ ...prev, [u]: { title: prev[u]?.title || '', author: e.target.value, traditions: prev[u]?.traditions || [], description: prev[u]?.description, year: prev[u]?.year, language: prev[u]?.language || 'english' } }))} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {uploadMode === 'csv' && (
              <div className="space-y-2">
                <div className="text-sm">CSV must include headers: filename,title,author and optional traditions,description,year,language</div>
                <input type="file" accept=".csv" onChange={(e) => {
                  const f = e.target.files?.[0] || null; setCsvFile(f);
                  if (f) {
                    Papa.parse(f, { header: true, complete: (res: any) => { setCsvPreview((res.data as CSVBookRow[]) || []); } });
                  } else { setCsvPreview([]); }
                }} />

                {csvPreview.length > 0 && (
                  <div>
                    <div className="font-medium">CSV Preview (first 10 rows)</div>
                    <div className="mt-2 max-h-40 overflow-auto border rounded">
                      <table className="w-full text-sm">
                        <thead><tr><th>filename</th><th>title</th><th>author</th><th>traditions</th></tr></thead>
                        <tbody>
                          {csvPreview.slice(0, 10).map((r, i) => (
                            <tr key={i} className="border-t">
                              <td className="p-1">{r.filename}</td>
                              <td className="p-1">{r.title}</td>
                              <td className="p-1">{r.author}</td>
                              <td className="p-1">{r.traditions}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-2 text-sm">Match CSV filenames to uploaded files below (if you uploaded files in Files tab)</div>
                    <div className="mt-2 grid gap-2">
                      {csvPreview.map((r, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-48">{r.filename}</div>
                          <select className="border rounded px-2 py-1" onChange={(e) => setCsvMatches(prev => ({ ...prev, [r.filename]: e.target.value }))} value={csvMatches[r.filename] || ''}>
                            <option value="">-- match file --</option>
                            {selectedFiles.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {readyFiles.length > 0 && (
            <div>
              <div className="mb-2 font-medium">Edit metadata</div>
              <div className="grid gap-2">
                {readyFiles.map(f => (
                  <div key={f.id} className="p-2 border rounded flex gap-2 items-center">
                    <div className="w-48 font-medium">{f.name}</div>
                    <input placeholder="Title" value={metadataMap[f.id]?.title || ''} onChange={(e) => setMetadataMap(prev => ({ ...prev, [f.id]: { title: e.target.value, author: prev[f.id]?.author || '', traditions: prev[f.id]?.traditions || [], description: prev[f.id]?.description, year: prev[f.id]?.year, language: prev[f.id]?.language || 'english' } }))} className="border rounded px-2 py-1" />
                    <input placeholder="Author" value={metadataMap[f.id]?.author || ''} onChange={(e) => setMetadataMap(prev => ({ ...prev, [f.id]: { title: prev[f.id]?.title || '', author: e.target.value, traditions: prev[f.id]?.traditions || [], description: prev[f.id]?.description, year: prev[f.id]?.year, language: prev[f.id]?.language || 'english' } }))} className="border rounded px-2 py-1" />
                    <input placeholder="Language" value={metadataMap[f.id]?.language || ''} onChange={(e) => setMetadataMap(prev => ({ ...prev, [f.id]: { title: prev[f.id]?.title || '', author: prev[f.id]?.author || '', traditions: prev[f.id]?.traditions || [], description: prev[f.id]?.description, year: prev[f.id]?.year, language: e.target.value || 'english' } }))} className="border rounded px-2 py-1 w-28" />
                  </div>
                ))}
              </div>

              <div className="mt-3 flex gap-2">
                <Button variant="ghost" onClick={() => handleApplyToAll({ language: 'english' })}>Apply English to all</Button>
                <Button variant="outline" onClick={() => handleApplyToAll({ author: 'Unknown' })}>Apply Unknown Author</Button>
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div>
              <div className="font-medium">Results</div>
              <ul className="mt-2 space-y-1">
                {results.map(r => (
                  <li key={r.fileName} className="flex items-center gap-2">
                    {r.success ? <span className="text-green-600">✔</span> : <span className="text-red-600">✖</span>} {r.fileName} {r.error && <span className="text-sm text-red-600">- {r.error}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Progress UI */}
          {isUploading && (
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-medium">Overall progress</div>
                <div className="text-sm">{(progressMap.__global ?? 0)}%</div>
              </div>
              <div className="w-full bg-slate-100 rounded h-3 overflow-hidden">
                <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressMap.__global ?? 0} className="h-3 bg-primary transition-all" style={{ width: `${progressMap.__global ?? 0}%` }} />
              </div>
              <div id="bulk-upload-progress-live" aria-live="polite" className="sr-only" />

              {/* Per-item progress (if present in progressMap by id) */}
              <div className="mt-3 space-y-2">
                {selectedFiles.map(f => (
                  <div key={f.id} className="flex items-center gap-2">
                    <div className="flex-1 text-sm">{f.name}</div>
                    <div className="w-48 bg-slate-100 rounded h-2 overflow-hidden">
                      <div className="h-2 bg-primary" style={{ width: `${progressMap[f.id] ?? 0}%` }} />
                    </div>
                    <div className="w-12 text-right text-xs">{progressMap[f.id] ?? 0}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <div />
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose} disabled={isUploading}>Cancel</Button>
              <Button onClick={handleUpload} disabled={!canUpload}>{isUploading ? 'Uploading...' : 'Upload'}</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
