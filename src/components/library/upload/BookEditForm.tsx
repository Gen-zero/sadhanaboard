import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import BookFormFields from './BookFormFields';
import { adminApi } from '@/services/adminApi';

interface BookEditFormProps {
  book: any;
  onClose: () => void;
  onBookUpdated?: () => void;
}

const BookEditForm = ({ book, onClose, onBookUpdated }: BookEditFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({
    title: '',
    author: '',
    traditions: [],
    content: '',
    description: '',
    year: '',
    language: 'english'
  });
  const [newTradition, setNewTradition] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | undefined>(undefined);
  const [keepExistingFile, setKeepExistingFile] = useState(true);

  useEffect(() => {
    if (!book) return;
    setFormData({
      title: book.title || '',
      author: book.author || '',
      traditions: book.traditions || [],
      content: book.content || '',
      description: book.description || '',
      year: book.year ? String(book.year) : '',
      language: book.language || 'english'
    });
    setKeepExistingFile(!!book.storage_url);
  }, [book]);

  const handleFormFieldsChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File | undefined) => {
    setUploadedFile(file);
    setKeepExistingFile(!file);
  };

  const handleTraditionAdd = () => {
    const t = (newTradition || '').trim();
    if (!t) return;
    setFormData((prev: any) => ({ ...prev, traditions: Array.from(new Set([...(prev.traditions || []), t])) }));
    setNewTradition('');
  };

  const handleTraditionRemove = (t: string) => {
    setFormData((prev: any) => ({ ...prev, traditions: (prev.traditions || []).filter((x: string) => x !== t) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author) {
      toast({ title: 'Missing fields', description: 'Please fill in title and author.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        title: formData.title,
        author: formData.author,
        traditions: formData.traditions,
        content: formData.content || null,
        description: formData.description || null,
        year: formData.year ? parseInt(formData.year) : null,
        language: formData.language,
      };

      const updated = await adminApi.updateBook(book.id, payload, uploadedFile);

      toast({ title: 'Book updated', description: 'The book was updated successfully.' });
      if (onBookUpdated) onBookUpdated();
      onClose();
    } catch (err: any) {
      console.error('Update error', err);
      toast({ title: 'Update failed', description: err.message || 'Failed to update book', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Update Book</CardTitle>
        <CardDescription>Modify book metadata and optionally replace file</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <BookFormFields
            formData={{
              title: formData.title,
              author: formData.author,
              content: formData.content,
              description: formData.description,
              year: formData.year,
              language: formData.language
            }}
            onInputChange={handleFormFieldsChange}
            onFileChange={handleFileChange}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Traditions</label>
            <div className="flex gap-2">
              <input value={newTradition} onChange={(e) => setNewTradition(e.target.value)} placeholder="Add tradition" className="flex-1 rounded border px-2 py-1" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleTraditionAdd())} />
              <Button type="button" variant="outline" onClick={handleTraditionAdd}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(formData.traditions || []).map((t: string) => (
                <div key={t} className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full text-sm">
                  <span>{t}</span>
                  <button type="button" onClick={() => handleTraditionRemove(t)} className="text-muted-foreground">✕</button>
                </div>
              ))}
            </div>
          </div>

          {book.storage_url && keepExistingFile && (
            <div className="text-sm text-muted-foreground">Current file: {book.storage_url.split('/').pop()}</div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Update Book'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookEditForm;
