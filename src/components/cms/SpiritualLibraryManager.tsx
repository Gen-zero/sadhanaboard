import { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BulkUploadDialog from '@/components/library/upload/BulkUploadDialog';
import BatchMetadataEditor from '@/components/library/upload/BatchMetadataEditor';
import { Checkbox } from '@/components/ui/checkbox';
import { UploadCloud, Edit2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import BookUploadForm from '@/components/library/upload/BookUploadForm';
import BookEditForm from '@/components/library/upload/BookEditForm';
import { adminApi } from '@/services/adminApi';
import type { SpiritualBook } from '@/types/books';
const LibraryAnalyticsDashboard = lazy(() => import('@/components/cms/LibraryAnalyticsDashboard'));

const SpiritualLibraryManager = () => {
  const { toast } = useToast();
  const [books, setBooks] = useState<SpiritualBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedTraditions, setSelectedTraditions] = useState<string[]>([]);
  const [availableTraditions, setAvailableTraditions] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<string | undefined>(undefined);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isBatchEditOpen, setIsBatchEditOpen] = useState(false);
  const [selectedBookIds, setSelectedBookIds] = useState<Set<string>>(new Set());
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<SpiritualBook | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<SpiritualBook | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllBooksAdmin({ search: searchTerm, showDeleted, traditions: selectedTraditions, language: selectedLanguage, year: selectedYear ? Number(selectedYear) : undefined });
      setBooks(res.books || []);
    } catch (err: any) {
      console.error('Failed to load books', err);
      toast({ title: 'Load failed', description: err.message || 'Failed to load books', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, showDeleted, selectedTraditions, selectedLanguage, selectedYear, toast]);

  // Fetch available traditions for filter
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/books/traditions');
        if (res.ok) {
          const json = await res.json();
          setAvailableTraditions(json.traditions || []);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const handleRefresh = () => loadBooks();

  const handleBulkUploadClick = () => setIsBulkUploadOpen(true);
  const handleBatchEditClick = () => {
    const selected = books.filter(b => selectedBookIds.has(b.id));
    if (selected.length === 0) return toast({ title: 'No books selected', description: 'Select books to batch edit' });
    setIsBatchEditOpen(true);
  };

  const handleSelectBook = (bookId: string) => {
    setSelectedBookIds((prev) => {
      const next = new Set(prev);
      if (next.has(bookId)) next.delete(bookId); else next.add(bookId);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedBookIds.size === books.length) {
      setSelectedBookIds(new Set());
    } else {
      setSelectedBookIds(new Set(books.map(b => b.id)));
    }
  };

  const handleClearSelection = () => setSelectedBookIds(new Set());

  const handleBatchSave = async (updates: Map<string, Partial<SpiritualBook>>) => {
    try {
      const arr: Array<{ id: string; bookData: any }> = [];
      updates.forEach((v, k) => arr.push({ id: k, bookData: v }));
      const res = await adminApi.batchUpdateBooks(arr);
      // res expected to contain results
      const success = res.summary?.successful ?? (Array.isArray(res.results) ? res.results.filter((r:any)=>r.success).length : 0);
      const failed = res.summary?.failed ?? (Array.isArray(res.results) ? res.results.filter((r:any)=>!r.success).length : 0);
      toast({ title: 'Batch update complete', description: `${success} updated, ${failed} failed` });
      setIsBatchEditOpen(false);
      handleClearSelection();
      loadBooks();
    } catch (err: any) {
      toast({ title: 'Batch update failed', description: err.message || 'Failed to update books', variant: 'destructive' });
    }
  };

  const openEdit = (b: SpiritualBook) => {
    setEditingBook(b);
    setIsEditOpen(true);
  };

  const handleDelete = async (b: SpiritualBook) => {
    setDeleteConfirm(b);
    if (!confirm(`Archive book '${b.title}'?`)) return;
    try {
      await adminApi.deleteBook(b.id);
      toast({ title: 'Book archived', description: `${b.title} archived.` });
      loadBooks();
    } catch (err: any) {
      toast({ title: 'Delete failed', description: err.message || 'Failed to archive book', variant: 'destructive' });
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedBookIds.size === 0) return toast({ title: 'No books selected' });
    if (!confirm(`Archive ${selectedBookIds.size} selected books?`)) return;
    try {
      const ids = Array.from(selectedBookIds);
      await adminApi.batchDeleteBooks(ids);
      toast({ title: 'Books archived', description: `${ids.length} books archived.` });
      setSelectedBookIds(new Set());
      loadBooks();
    } catch (err: any) {
      toast({ title: 'Batch delete failed', description: err.message || 'Failed to archive books', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Spiritual Library Management</h2>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={showDeleted} onChange={(e) => setShowDeleted(e.target.checked)} /> Show Archived
          </label>
          <Button onClick={() => setIsUploadOpen(true)}>Upload Book</Button>
          <Button variant="ghost" onClick={handleBulkUploadClick}><UploadCloud className="mr-2" /> Bulk Upload</Button>
          <Button variant="outline" onClick={handleRefresh}>Refresh</Button>
        </div>
      </div>

      {/* Tabs: Books | Analytics */}
      <div className="flex gap-2">
        <button className="px-3 py-1 rounded bg-white border" onClick={() => setShowAnalytics(false)}>Books</button>
        <button className="px-3 py-1 rounded bg-white border" onClick={() => setShowAnalytics(true)}>Analytics</button>
      </div>

      {showAnalytics ? (
        <div className="mt-4">
          <Suspense fallback={<div>Loading analytics...</div>}>
            <LibraryAnalyticsDashboard />
          </Suspense>
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Books</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-3">
            <Input placeholder="Search by title, author or description" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <label className="text-sm">Traditions</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableTraditions.map((t) => {
                    const selected = selectedTraditions.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => setSelectedTraditions((prev) => selected ? prev.filter(x => x !== t) : [...prev, t])}
                        className={`px-2 py-1 rounded-full text-xs ${selected ? 'bg-primary text-white' : 'bg-secondary'}`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="w-48">
                <label className="text-sm">Language</label>
                <select className="mt-2 w-full rounded border px-2 py-1" value={selectedLanguage || ''} onChange={(e) => setSelectedLanguage(e.target.value || undefined)}>
                  <option value="">Any</option>
                  <option value="english">English</option>
                  <option value="sanskrit">Sanskrit</option>
                  <option value="hindi">Hindi</option>
                </select>
              </div>

              <div className="w-32">
                <label className="text-sm">Year</label>
                <input className="mt-2 w-full rounded border px-2 py-1" value={selectedYear || ''} onChange={(e) => setSelectedYear(e.target.value || undefined)} placeholder="YYYY" />
              </div>

              <div className="flex items-end">
                <Button variant="ghost" onClick={() => { setSelectedTraditions([]); setSelectedLanguage(undefined); setSelectedYear(undefined); setSearchTerm(''); loadBooks(); }}>Clear</Button>
              </div>
            </div>
          </div>

          {/* Contextual toolbar for batch actions when selection exists */}
          {selectedBookIds.size > 0 && (
            <div className="mb-3 p-3 bg-slate-50 rounded flex items-center justify-between">
              <div aria-live="polite">{selectedBookIds.size} selected</div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleBatchEditClick}>Batch Edit</Button>
                <Button size="sm" variant="destructive" onClick={handleDeleteSelected}>Archive Selected</Button>
                <Button size="sm" variant="ghost" onClick={handleClearSelection}>Clear</Button>
              </div>
            </div>
          )}

          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-2">
              {books.length === 0 ? (
                <div className="text-sm text-muted-foreground">No books found. Upload your first book.</div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {books.map((b) => (
                    <div key={b.id} className={`p-3 border rounded-md flex items-center justify-between ${selectedBookIds.has(b.id) ? 'bg-slate-50' : ''}`}>
                      <div className="flex items-start gap-3">
                        <Checkbox checked={selectedBookIds.has(b.id)} onCheckedChange={() => handleSelectBook(b.id)} aria-label={`Select book ${b.title}`} />
                        <div>
                          <div className="font-semibold">{b.title}</div>
                          <div className="text-sm text-muted-foreground">{b.author} • {b.language} • {b.year || 'N/A'}</div>
                          <div className="mt-2 flex gap-2">
                            {(b.traditions || []).map(t => <span key={t} className="px-2 py-1 bg-secondary rounded-full text-xs">{t}</span>)}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEdit(b)} disabled={selectedBookIds.size > 0}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(b)} disabled={selectedBookIds.size > 0}>Archive</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload dialog (simple modal toggled state - reuse existing BookUploadForm in place) */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-popover p-6 rounded shadow-lg">
            <BookUploadForm onClose={() => { setIsUploadOpen(false); loadBooks(); }} onBookUploaded={() => loadBooks()} />
          </div>
        </div>
      )}

      {/* Bulk upload dialog */}
      {isBulkUploadOpen && (
        <BulkUploadDialog
          isOpen={isBulkUploadOpen}
          onClose={() => setIsBulkUploadOpen(false)}
          onUploadComplete={() => { setIsBulkUploadOpen(false); loadBooks(); }}
        />
      )}

      {isEditOpen && editingBook && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-popover p-6 rounded shadow-lg max-h-[90vh] overflow-auto">
            <BookEditForm book={editingBook} onClose={() => { setIsEditOpen(false); setEditingBook(null); loadBooks(); }} onBookUpdated={() => loadBooks()} />
          </div>
        </div>
      )}

      {/* Batch metadata editor dialog */}
      {isBatchEditOpen && selectedBookIds.size > 0 && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-popover p-6 rounded shadow-lg max-h-[90vh] overflow-auto w-[90%]">
            <BatchMetadataEditor
              books={books.filter(b => selectedBookIds.has(b.id))}
              onSave={handleBatchSave}
              onClose={() => { setIsBatchEditOpen(false); setSelectedBookIds(new Set()); }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SpiritualLibraryManager;

