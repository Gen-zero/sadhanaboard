import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';
import BookFormFields from './BookFormFields';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Validation schema
const BookSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  author: z.string().min(2, 'Author is required'),
  traditions: z.array(z.string()).optional(),
  content: z.string().optional(),
  description: z.string().optional(),
  year: z.string().optional().refine(y => !y || /^\d{4}$/.test(y), { message: 'Year must be a 4 digit number' }),
  language: z.string().min(2),
});

type BookFormType = z.infer<typeof BookSchema>;

interface BookUploadFormProps {
  onClose: () => void;
  onBookUploaded?: () => void;
}

const BookUploadForm = ({ onClose, onBookUploaded }: BookUploadFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | undefined>(undefined);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BookFormType>({
    resolver: zodResolver(BookSchema),
    defaultValues: { title: '', author: '', traditions: [], content: '', description: '', year: '', language: 'english' }
  });

  const onSubmit = async (values: BookFormType) => {
    // If no file and no content, invalid
    if (!uploadedFile && !values.content) {
      toast({ title: 'Missing content', description: 'Please upload a file or enter book content.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const bookData = {
        title: values.title,
        author: values.author,
        traditions: values.traditions || [],
        content: values.content || null,
        description: values.description || null,
        year: values.year ? parseInt(values.year) : null,
        language: values.language,
        page_count: values.content ? values.content.split('---PAGE---').length : null,
      };

      await api.createBook(bookData, uploadedFile);

      toast({ title: 'Book uploaded', description: 'Your spiritual book has been successfully uploaded.' });

      if (onBookUploaded) onBookUploaded();
      onClose();
    } catch (err: any) {
      console.error('Upload error:', err);
      const msg = err?.message || 'Failed to upload book. Please try again.';
      toast({ title: 'Upload failed', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Upload Spiritual Book</CardTitle>
        <CardDescription>Share your spiritual wisdom with the community</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <BookFormFields 
            formData={{
              title: watch('title'),
              author: watch('author'),
              content: watch('content'),
              description: watch('description') || '',
              year: watch('year') || '',
              language: watch('language')
            }} 
            onInputChange={(field, value) => setValue(field as any, value)} 
            onFileChange={(file) => setUploadedFile(file)}
          />

          {/* Display validation errors */}
          {errors && (
            <div className="text-sm text-destructive">
              {Object.values(errors).map((e: any) => (
                <div key={e.message}>{e.message}</div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Book'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookUploadForm;