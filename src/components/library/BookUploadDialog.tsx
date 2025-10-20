
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import BookUploadForm from "./upload/BookUploadForm";

interface BookUploadDialogProps {
  onBookUploaded?: () => void;
}

const BookUploadDialog = ({ onBookUploaded }: BookUploadDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="btn-cosmic">
          <Upload className="mr-2 h-4 w-4" />
          Upload Book
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Spiritual Book</DialogTitle>
        </DialogHeader>
        
        <BookUploadForm 
          onBookUploaded={onBookUploaded}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BookUploadDialog;
