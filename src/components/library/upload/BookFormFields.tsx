import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import FileUpload from "./FileUpload";

interface FormData {
  title: string;
  author: string;
  content: string;
  description: string;
  year: string;
  language: string;
}

interface BookFormFieldsProps {
  formData: FormData;
  onInputChange: (field: string, value: string) => void;
  onFileChange: (file: File | undefined) => void;
}

const BookFormFields = ({ formData, onInputChange, onFileChange }: BookFormFieldsProps) => {
  const handleFileProcessed = (content: string, fileName: string, file?: File) => {
    // For PDF files, we don't extract content but pass the file object
    // For text files, we still extract content as before
    if (file?.type === "application/pdf" || file?.name.endsWith('.pdf')) {
      // For PDF files, we don't set content but pass the file object
      onFileChange(file);
    } else {
      // For text files, we still extract content
      onInputChange("content", content);
      onFileChange(undefined);
    }
    
    // Auto-fill title if it's empty and we have a filename
    if (!formData.title && fileName) {
      const titleFromFile = fileName
        .replace(/\.(pdf|txt)$/i, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
      onInputChange("title", titleFromFile);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={(e) => onInputChange("title", e.target.value)}
            placeholder="Enter book title"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="author">Author *</Label>
          <Input
            id="author"
            name="author"
            value={formData.author}
            onChange={(e) => onInputChange("author", e.target.value)}
            placeholder="Enter author name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Year Published</Label>
          <Input
            id="year"
            name="year"
            type="number"
            value={formData.year}
            onChange={(e) => onInputChange("year", e.target.value)}
            placeholder="e.g., 1950"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Input
            id="language"
            name="language"
            value={formData.language}
            onChange={(e) => onInputChange("language", e.target.value)}
            placeholder="e.g., English, Sanskrit"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          placeholder="Brief description of the book's content and significance"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Upload File (Optional)</Label>
        <FileUpload onFileProcessed={handleFileProcessed} />
        <p className="text-xs text-muted-foreground">
          Upload a PDF or text file. PDF files will be stored directly, text files will be processed.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Book Content</Label>
        <Textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={(e) => onInputChange("content", e.target.value)}
          placeholder="Paste the complete text here, upload a text file above, or use '---PAGE---' to separate pages/chapters."
          rows={10}
          className="min-h-[200px] font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">
          Tip: Use "---PAGE---" to create page breaks in the book viewer. This field is only for text content.
        </p>
      </div>
    </>
  );
};

export default BookFormFields;