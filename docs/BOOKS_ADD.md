# How to add or update books in the SaadhanaBoard library

This document explains how to add a PDF to the library and create a database entry so the frontend can show it. It provides step-by-step instructions for both a single-file script (recommended for local admins) and the admin UI/multipart upload option.

## Prerequisites
- Node.js and npm installed
- Local Postgres instance matching backend config in `backend/config/db.js`
- The repository checked out and dependencies installed (run `npm install` in repo root and `cd backend && npm install`)

## Quick summary
1. Place the PDF in `backend/uploads/` (or use the admin UI import endpoints).
2. Run the provided script to create a DB entry that points to the uploaded file.
3. Verify in the admin UI or via `/api/books` that the book appears.

## Option A — CLI script (recommended for batch or single files)

Files added:
- `backend/scripts/addBookFromFile.js` (script to copy a file into `backend/uploads` and create a DB record)

Steps:
1. From the repository root, install dependencies if you haven't already:

```powershell
cd "D:\saadhanaboard(latest)\saadhanaboard"
npm install
cd backend
npm install
```

2. Run the init DB script if your database is not initialized (careful: this will attempt to create tables):

```powershell
cd backend
node utils/initDb.js
```

3. Run the `addBookFromFile.js` script. Example (Windows PowerShell):

```powershell
cd backend
node scripts/addBookFromFile.js "../Books/yantras-heavenly-geometries.pdf" "{\"title\":\"Yantras: Heavenly Geometries\",\"author\":\"Unknown\",\"traditions\":[\"Tantra\"],\"description\":\"Yantras and sacred geometries\",\"year\":2001,\"language\":\"english\"}"
```

Notes:
- The script copies the PDF into `backend/uploads/` with a unique filename and sets `storage_url` to `/uploads/<filename>`.
- The script attempts to pick an existing user id to satisfy `user_id` in `spiritual_books`. If none exists the script will warn — the insert may fail if the DB requires a non-null user_id.
- If you need to import multiple files, run the script repeatedly or use the admin UI's bulk import endpoint.

## Option B — Admin UI / API

You can also add books using the web admin UI (if available) or by calling the backend endpoints directly.

### Multipart Upload Endpoint
- Endpoint: POST /api/books (admin-protected)
  - Form fields:
    - `bookData` (JSON string): metadata (title, author, traditions[], description, year, language, cover_url optional)
    - `bookFile` (file): the PDF file

Example curl (authenticated admin):

```bash
# This requires a valid admin JWT in $ADMIN_TOKEN
curl -v -H "Authorization: Bearer $ADMIN_TOKEN" -F "bookData={\"title\":\"Yantras...\",\"author\":\"Unknown\"};type=application/json" -F "bookFile=@./yantras-heavenly-geometries.pdf" https://your-backend.example.com/api/books
```

### Import from URL Endpoint
- Endpoint: POST /api/books/import-url (admin-protected) — import from a public URL pointing to a PDF. The backend will download the PDF and create the record.

### File Serving Endpoint
- Endpoint: GET /api/books/files/:filename — serves uploaded files directly

## Verifying the book is available
1. Start the backend locally: `cd backend && npm run dev`
2. Start the frontend: at repo root `npm run dev` (Vite on port 8080)
3. Visit the Library page or query the public API:

```powershell
curl http://localhost:3004/api/books
```

You should see the newly created book record in the returned JSON under `books` with `storage_url` set to `/uploads/<filename>` and `is_storage_file: true`.

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
| file_size | INTEGER | Size of the file in bytes |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |
| deleted_at | TIMESTAMP | Soft delete timestamp |

## Troubleshooting
- If the DB insert fails because of missing `users` row, create a test user in the `users` table, or run the script with a valid existing `user_id` by editing `addBookFromFile.js`.
- If the PDF is larger than 50MB, the server rejects it. Use a smaller file.
- If you prefer to set a `cover_url`, you can pass a public image URL in the metadata `cover_url` field.

## Security / cleanup
- Uploaded files are stored in `backend/uploads/`. If you delete a book via the admin UI, the backend attempts to delete the old file on update; review and remove orphaned files as needed.

## File Storage Details
- PDF files are stored in the `backend/uploads` directory
- Files are given unique names to prevent conflicts using the pattern `book-{timestamp}-{randomNumber}.{extension}`
- The original filename is not preserved in the filesystem but is stored in the database metadata
- Files are served statically through the `/uploads` endpoint
- File size is automatically calculated and stored in the `file_size` field

---
If you'd like, I can:
- Run the script here (I can attempt to execute `node backend/scripts/addBookFromFile.js` using the attached PDF), or
- Add bulk-import automation using `backend/controllers/bookController.js` existing `bulkUploadBooks` API to accept local file paths.

Which do you want next? I can attempt to run the script now and report the DB result.