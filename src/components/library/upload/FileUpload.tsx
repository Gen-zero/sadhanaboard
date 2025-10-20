import { useState } from "react";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface FileUploadProps {
  onFileProcessed: (content: string, fileName: string, file?: File) => void;
}

const FileUpload = ({ onFileProcessed }: FileUploadProps) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processTextFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text);
      };
      reader.onerror = () => reject(new Error("Failed to read text file"));
      reader.readAsText(file);
    });
  };

  const processPDFFile = async (file: File): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        // PDF files are stored directly without text extraction
        resolve("");
      } catch (error) {
        reject(new Error("Failed to process PDF file."));
      }
    });
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        throw new Error("File size exceeds 50MB limit. Please choose a smaller file.");
      }
      
      // For PDF files, we'll pass the file object directly
      // For text files, we'll extract the content
      if (file.type === "text/plain" || file.name.endsWith('.txt')) {
        const content = await processTextFile(file);
        onFileProcessed(content, file.name, file);
      } else if (file.type === "application/pdf" || file.name.endsWith('.pdf')) {
        // For PDF files, we pass the file object directly without extracting content
        onFileProcessed("", file.name, file);
      } else {
        throw new Error("Unsupported file type. Please upload a PDF or text file.");
      }

      setUploadedFile(file);
      
      toast({
        title: "File processed successfully",
        description: `File ${file.name} is ready for upload`,
      });
    } catch (error) {
      console.error('File processing error:', error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      toast({
        title: "File processing failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (files: FileList) => {
    const file = files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setError(null);
    onFileProcessed("", "", undefined);
  };

  return (
    <div className="space-y-4">
      {!uploadedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging
              ? "border-purple-500 bg-purple-500/10"
              : "border-gray-300 hover:border-purple-400"
          } ${error ? "border-red-500 bg-red-500/10" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Drop your file here, or{" "}
            <label className="text-purple-600 hover:text-purple-700 cursor-pointer">
              browse
              <input
                type="file"
                className="hidden"
                accept=".pdf,.txt"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                disabled={isProcessing}
              />
            </label>
          </p>
          <p className="text-xs text-gray-500">
            Supports PDF and text files (max 50MB)
          </p>
          {isProcessing && (
            <p className="text-sm text-purple-600 mt-2">Processing file...</p>
          )}
          {error && (
            <div className="mt-3 flex items-center justify-center text-red-500 text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium">{uploadedFile.name}</span>
            {isProcessing && (
              <span className="text-xs text-purple-600">(Processing...)</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="text-gray-500 hover:text-red-600"
            disabled={isProcessing}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;