import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mail, BookOpen } from "lucide-react";
import BookRequestForm from "@/components/library/upload/BookRequestForm";

interface BookRequestDialogProps {
  onBookRequested?: () => void;
}

const BookRequestDialog = ({ onBookRequested }: BookRequestDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 hover:scale-105">
          <Mail className="h-4 w-4 mr-2" />
          Request Book
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-background to-secondary/10 border border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            Request a Sacred Text
          </DialogTitle>
          <p className="text-muted-foreground">
            Can't find what you're looking for? Request it and we'll add it to our library.
          </p>
        </DialogHeader>
        
        <BookRequestForm 
          onBookRequested={onBookRequested}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BookRequestDialog;