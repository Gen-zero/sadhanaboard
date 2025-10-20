import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Upload, Filter, Book, Plus, Edit, Trash2 } from 'lucide-react';
import CosmicButton from './CosmicButton';
import CosmicTable from './CosmicTable';
import CosmicModal from './CosmicModal';
import { adminBooksApi } from '@/lib/adminApi';
import { Book as BookType } from '@/types/admin';
import { useRealTimeLibrary } from '@/hooks/useRealTimeLibrary';

// Helper function to format book data for display
const formatBookForDisplay = (book: any): any => {
  return {
    ...book,
    traditions: book.traditions?.join(', ') || '',
    created_at: book.created_at ? new Date(book.created_at).toLocaleDateString() : '',
    description: book.description || ''
  };
};

// Helper function to parse book data for editing
const parseBookForEditing = (book: any): any => {
  return {
    ...book,
    traditions: Array.isArray(book.traditions) ? book.traditions : (book.traditions ? book.traditions.split(',').map((t: string) => t.trim()) : [])
  };
};

const CosmicLibraryManager: React.FC = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [sortColumn, setSortColumn] = useState('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    category: '',
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Handle real-time book updates
  const handleBookUpdate = useCallback((updatedBook: any) => {
    const formattedBook = formatBookForDisplay(updatedBook);
    setBooks(prevBooks => {
      const existingBookIndex = prevBooks.findIndex(b => b.id === formattedBook.id);
      if (existingBookIndex >= 0) {
        // Update existing book
        const updatedBooks = [...prevBooks];
        updatedBooks[existingBookIndex] = formattedBook;
        return updatedBooks;
      } else {
        // Add new book
        return [...prevBooks, formattedBook];
      }
    });
  }, []);

  const { connected } = useRealTimeLibrary(handleBookUpdate);

  // Fetch books from API
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await adminBooksApi.getAllBooks();
      const formattedBooks = (data.books || []).map(formatBookForDisplay);
      setBooks(formattedBooks);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (columnKey: string, direction: 'asc' | 'desc') => {
    setSortColumn(columnKey);
    setSortDirection(direction);
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.description && book.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    const aValue = a[sortColumn as keyof BookType];
    const bValue = b[sortColumn as keyof BookType];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
    }
    
    return 0;
  });

  const handleDelete = async (id: string | number) => {
    try {
      await adminBooksApi.deleteBook(id.toString());
      setBooks(books.filter(book => book.id !== id));
    } catch (error) {
      console.error('Failed to delete book:', error);
    }
  };

  const handleEdit = (book: any) => {
    const parsedBook = parseBookForEditing(book);
    setEditingBook(parsedBook);
    setIsEditModalOpen(true);
  };

  const handleUpdateBook = async () => {
    try {
      if (!editingBook) return;
      
      const bookData = {
        title: editingBook.title,
        author: editingBook.author,
        traditions: Array.isArray(editingBook.traditions) ? editingBook.traditions : [editingBook.traditions],
        description: editingBook.description,
      };
      
      await adminBooksApi.updateBook(editingBook.id.toString(), bookData);
      setIsEditModalOpen(false);
      setEditingBook(null);
      fetchBooks(); // Refresh the book list
    } catch (error) {
      console.error('Failed to update book:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadBook = async () => {
    try {
      const bookData = {
        title: newBook.title,
        author: newBook.author,
        traditions: [newBook.category],
        description: newBook.description,
        content: '', // Will be set from file
        is_storage_file: true
      };
      
      await adminBooksApi.createBook(bookData, selectedFile || undefined);
      setIsUploadModalOpen(false);
      setNewBook({ title: '', author: '', category: '', description: '' });
      setSelectedFile(null);
      fetchBooks(); // Refresh the book list
    } catch (error) {
      console.error('Failed to upload book:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="cosmic-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      {connected ? (
        <div className="p-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm">
          🔗 Real-time connection active
        </div>
      ) : (
        <div className="p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-300 text-sm">
          ⚠️ Real-time connection disconnected - Data may not be up to date
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <BookOpen className="mr-2 h-6 w-6 text-purple-400" />
            📚 Library of Wisdom
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage sacred texts and spiritual resources
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search books..."
              className="pl-10 pr-4 py-2 bg-background/60 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <CosmicButton
            onClick={() => setIsUploadModalOpen(true)}
            variant="primary"
          >
            <Plus className="mr-2 h-4 w-4" />
            Upload Text
          </CosmicButton>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          className="cosmic-card p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="cosmic-card-glow"></div>
          <div className="flex items-center">
            <Book className="h-8 w-8 text-purple-400 mr-3" />
            <div>
              <div className="text-2xl font-bold cosmic-metric-value">
                {books.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Texts
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          className="cosmic-card p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="cosmic-card-glow"></div>
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-green-400 mr-3" />
            <div>
              <div className="text-2xl font-bold cosmic-metric-value">
                {books.filter(b => !b.deleted_at).length}
              </div>
              <div className="text-sm text-muted-foreground">
                Active
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          className="cosmic-card p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="cosmic-card-glow"></div>
          <div className="flex items-center">
            <Trash2 className="h-8 w-8 text-red-400 mr-3" />
            <div>
              <div className="text-2xl font-bold cosmic-metric-value">
                {books.filter(b => b.deleted_at).length}
              </div>
              <div className="text-sm text-muted-foreground">
                Deleted
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          className="cosmic-card p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="cosmic-card-glow"></div>
          <div className="flex items-center">
            <Filter className="h-8 w-8 text-blue-400 mr-3" />
            <div>
              <div className="text-2xl font-bold cosmic-metric-value">
                {new Set(books.flatMap(b => b.traditions || [])).size}
              </div>
              <div className="text-sm text-muted-foreground">
                Traditions
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Books Table */}
      <div className="cosmic-card">
        <div className="cosmic-card-glow"></div>
        <div className="p-6">
          <CosmicTable
            data={sortedBooks}
            columns={[
              { key: 'title', title: 'Title', sortable: true },
              { key: 'author', title: 'Author', sortable: true },
              { key: 'traditions', title: 'Traditions', sortable: true },
              { key: 'description', title: 'Description', sortable: true },
              { key: 'created_at', title: 'Added', sortable: true }
            ]}
            onSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            actions={(row) => (
              <div className="flex space-x-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleEdit(row); }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Edit
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            )}
          />
        </div>
      </div>
      
      {/* Upload Modal */}
      <CosmicModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setNewBook({ title: '', author: '', category: '', description: '' });
          setSelectedFile(null);
        }}
        title="Upload Sacred Text"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-background/60 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={newBook.title}
              onChange={(e) => setNewBook({...newBook, title: e.target.value})}
              placeholder="Enter book title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Author</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-background/60 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={newBook.author}
              onChange={(e) => setNewBook({...newBook, author: e.target.value})}
              placeholder="Enter author name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Tradition/Category</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-background/60 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={newBook.category}
              onChange={(e) => setNewBook({...newBook, category: e.target.value})}
              placeholder="Enter tradition or category"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              className="w-full px-3 py-2 bg-background/60 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={newBook.description}
              onChange={(e) => setNewBook({...newBook, description: e.target.value})}
              placeholder="Enter book description"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Upload File</label>
            <input
              type="file"
              className="w-full px-3 py-2 bg-background/60 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={handleFileChange}
              accept=".pdf,.txt,.epub,.mobi"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <CosmicButton
              variant="secondary"
              onClick={() => {
                setIsUploadModalOpen(false);
                setNewBook({ title: '', author: '', category: '', description: '' });
                setSelectedFile(null);
              }}
            >
              Cancel
            </CosmicButton>
            <CosmicButton
              variant="primary"
              onClick={handleUploadBook}
              disabled={!newBook.title || !newBook.author || !selectedFile}
            >
              Upload
            </CosmicButton>
          </div>
        </div>
      </CosmicModal>
      
      {/* Edit Modal */}
      <CosmicModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingBook(null);
        }}
        title="Edit Book"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-background/60 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={editingBook?.title || ''}
              onChange={(e) => setEditingBook({...editingBook, title: e.target.value})}
              placeholder="Enter book title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Author</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-background/60 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={editingBook?.author || ''}
              onChange={(e) => setEditingBook({...editingBook, author: e.target.value})}
              placeholder="Enter author name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Traditions</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-background/60 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={Array.isArray(editingBook?.traditions) ? editingBook.traditions.join(', ') : editingBook?.traditions || ''}
              onChange={(e) => setEditingBook({...editingBook, traditions: e.target.value.split(',').map((t: string) => t.trim())})}
              placeholder="Enter traditions (comma separated)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              className="w-full px-3 py-2 bg-background/60 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={editingBook?.description || ''}
              onChange={(e) => setEditingBook({...editingBook, description: e.target.value})}
              placeholder="Enter book description"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <CosmicButton
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingBook(null);
              }}
            >
              Cancel
            </CosmicButton>
            <CosmicButton
              variant="primary"
              onClick={handleUpdateBook}
              disabled={!editingBook?.title || !editingBook?.author}
            >
              Update
            </CosmicButton>
          </div>
        </div>
      </CosmicModal>
    </div>
  );
};

export default CosmicLibraryManager;