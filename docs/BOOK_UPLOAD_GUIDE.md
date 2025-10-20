# Book Upload System Guide

This guide explains how the book upload system works in SaadhanaBoard, including both text-based and PDF file uploads.

## Overview

The book upload system allows users to upload spiritual books in two formats:
1. Text-based books (with or without file upload)
2. PDF files (stored directly without text extraction)

## How It Works

### For Text-Based Books
1. Users can either:
   - Paste content directly into the text area
   - Upload a text file which will be processed and its content extracted
   - Both of the above methods

2. Text content is stored directly in the database in the `content` field.

### For PDF Files
1. Users upload a PDF file through the file upload interface.
2. The PDF file is stored on the server in the `uploads` directory.
3. A reference to the file is stored in the database in the `storage_url` field.
4. The `is_storage_file` flag is set to `true` to indicate this is a file-based book.
5. The `content` field is left empty for PDF files.

## Database Schema

Books are stored in the `spiritual_books` table with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| user_id | UUID | ID of the user who uploaded the book |
| title | TEXT | Book title |
| author | TEXT | Book author |
| traditions | TEXT[] | Array of spiritual traditions |
| content | TEXT | Extracted text content (for text-based books) |
| storage_url | TEXT | URL/path to stored file (for PDF files) |
| is_storage_file | BOOLEAN | Flag indicating if this is a file-based book |
| description | TEXT | Book description |
| year | INTEGER | Publication year |
| language | TEXT | Book language |
| page_count | INTEGER | Number of pages |
| cover_url | TEXT | URL to book cover image |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## Frontend Components

### FileUpload Component
- Handles drag-and-drop file uploads
- Processes both PDF and text files
- For PDF files, passes the file object directly without content extraction
- For text files, extracts content as before

### BookFormFields Component
- Collects book metadata (title, author, etc.)
- Integrates with FileUpload component
- Handles both file and content inputs

### BookUploadForm Component
- Main form for book uploads
- Manages form state and submission
- Handles both text-based and file-based uploads

## Backend Implementation

### BookService
- Updated to handle the new fields (`storage_url`, `is_storage_file`)
- Maintains backward compatibility with text-based books

### BookController
- Modified to handle file uploads using Multer
- Stores uploaded files in the `uploads` directory
- Generates unique filenames for uploaded files
- Updates book records with file information

### Routes
- Added endpoint to serve uploaded files: `/api/books/files/:filename`
- Updated book creation endpoint to handle multipart form data

## PDF Viewing

For PDF files:
1. The `UnifiedViewer` component detects file-based books using the `is_storage_file` flag
2. PDF files are rendered using the `PDFViewer` component
3. The `PDFViewer` loads the file directly from the stored URL

## API Endpoints

### GET /api/books
- Returns all books with their metadata
- File-based books will have `storage_url` and `is_storage_file: true`

### GET /api/books/:id
- Returns a specific book by ID

### POST /api/books
- Creates a new book
- Accepts both JSON data (for text-based books) and multipart form data (for file-based books)

### GET /api/books/files/:filename
- Serves uploaded files directly

## File Storage

- PDF files are stored in the `backend/uploads` directory
- Files are given unique names to prevent conflicts
- The original filename is preserved in the database metadata
- Files are served statically through the `/uploads` endpoint

## Error Handling

- File size limits (50MB)
- File type validation (PDF and text files only)
- Proper error messages for upload failures
- Graceful handling of missing files

## Security Considerations

- File uploads are restricted to authenticated users
- Only PDF and text files are accepted
- Files are stored outside the public web root
- Unique filenames prevent path traversal attacks
- File serving includes proper content-type headers

## Future Improvements

- Add support for additional file formats
- Implement file compression for storage optimization
- Add thumbnail generation for PDF files
- Implement cloud storage integration (AWS S3, etc.)