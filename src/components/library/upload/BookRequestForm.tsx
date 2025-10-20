import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface BookRequestData {
  title: string;
  author: string;
  traditions: string[];
  description?: string;
  reason?: string;
}

interface BookRequestFormProps {
  onClose: () => void;
  onBookRequested?: () => void;
}

const BookRequestForm = ({ onClose, onBookRequested }: BookRequestFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BookRequestData>({
    title: '',
    author: '',
    traditions: [],
    description: '',
    reason: '',
  });
  const [newTradition, setNewTradition] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTraditionAdd = () => {
    if (newTradition.trim() && !formData.traditions.includes(newTradition.trim())) {
      setFormData(prev => ({
        ...prev,
        traditions: [...prev.traditions, newTradition.trim()]
      }));
      setNewTradition('');
    }
  };

  const handleTraditionRemove = (tradition: string) => {
    setFormData(prev => ({
      ...prev,
      traditions: prev.traditions.filter(t => t !== tradition)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author) {
      toast({
        title: "Missing fields",
        description: "Please fill in title and author fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // In a real implementation, this would send a request to the backend
      // For now, we'll just simulate the request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Book requested",
        description: "Your request has been sent to our admins. We'll add this book to the library soon.",
      });

      // Call the onBookRequested callback if provided
      if (onBookRequested) {
        onBookRequested();
      }

      // Reset form
      setFormData({
        title: '',
        author: '',
        traditions: [],
        description: '',
        reason: '',
      });
      
      onClose();
    } catch (error: any) {
      console.error('Request error:', error);
      toast({
        title: "Request failed",
        description: error.message || "Failed to send request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Request a Sacred Text</CardTitle>
        <CardDescription>Let us know which spiritual book you'd like to see in our library</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Book Title *</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter the title of the book"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Author *</label>
            <Input
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Enter the author's name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Traditions</label>
            <div className="flex gap-2">
              <input
                value={newTradition}
                onChange={(e) => setNewTradition(e.target.value)}
                placeholder="Add tradition (e.g., Hindu, Buddhist, Taoist)"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTraditionAdd())}
              />
              <Button type="button" onClick={handleTraditionAdd} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.traditions.map((tradition) => (
                <div key={tradition} className="flex items-center bg-secondary px-3 py-1 rounded-full text-sm">
                  {tradition}
                  <button
                    type="button"
                    onClick={() => handleTraditionRemove(tradition)}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    <span className="h-4 w-4">✕</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Book Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of the book's content and significance"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for Request</label>
            <Textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Why would you like to see this book in our library?"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Sending Request...' : 'Request Book'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookRequestForm;