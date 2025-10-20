
import { SpiritualBook } from '@/types/books';
import PDFViewer from './PDFViewer';
import TextViewer from './TextViewer';

interface UnifiedViewerProps {
  book: SpiritualBook;
  bookId?: string;
}

const UnifiedViewer = ({ book, bookId }: UnifiedViewerProps) => {
  const isPDF = book.is_storage_file || book.storage_url?.toLowerCase().includes('.pdf');
  
  if (isPDF && book.storage_url) {
    return (
      <PDFViewer 
        fileUrl={book.storage_url} 
        fileName={book.title}
        bookId={bookId}
      />
    );
  }
  
  return <TextViewer book={book} bookId={bookId} />;
};

export default UnifiedViewer;
