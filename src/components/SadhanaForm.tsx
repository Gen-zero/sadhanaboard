import React from 'react';
import { Sadhana } from '@/types/sadhana';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

type SadhanaFormData = Omit<Sadhana, 'id' | 'reflection'> | Sadhana;

interface SadhanaFormProps<T extends SadhanaFormData> {
  sadhana: T;
  setSadhana: React.Dispatch<React.SetStateAction<T>>;
  isEditing?: boolean;
}

const SadhanaForm = <T extends SadhanaFormData>({ sadhana, setSadhana, isEditing = false }: SadhanaFormProps<T>) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title" className="text-sm font-medium">Title</Label>
        <Input
          id="title"
          placeholder="Sadhana title"
          value={sadhana.title}
          onChange={(e) => setSadhana({ ...sadhana, title: e.target.value })}
          className="bg-background/70 border-purple-500/30 h-10"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description" className="text-sm font-medium">Description</Label>
        <Textarea
          id="description"
          placeholder="Sadhana description"
          value={sadhana.description || ''}
          onChange={(e) => setSadhana({ ...sadhana, description: e.target.value })}
          className="bg-background/70 border-purple-500/30 min-h-[80px]"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="category" className="text-sm font-medium">Category</Label>
          <Select
            value={sadhana.category}
            onValueChange={(value: 'daily' | 'goal') => setSadhana({ ...sadhana, category: value })}
          >
            <SelectTrigger id="category" className="bg-background/70 border-purple-500/30 h-10">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily Ritual</SelectItem>
              <SelectItem value="goal">Goal Oriented</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
          <Select
            value={sadhana.priority}
            onValueChange={(value: 'low' | 'medium' | 'high') => setSadhana({ ...sadhana, priority: value })}
          >
            <SelectTrigger id="priority" className="bg-background/70 border-purple-500/30 h-10">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="dueDate" className="text-sm font-medium">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={sadhana.dueDate || ''}
            onChange={(e) => setSadhana({ ...sadhana, dueDate: e.target.value })}
            className="bg-background/70 border-purple-500/30 h-10"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="time" className="text-sm font-medium">Time</Label>
          <Input
            id="time"
            type="time"
            value={sadhana.time || ''}
            onChange={(e) => setSadhana({ ...sadhana, time: e.target.value })}
            className="bg-background/70 border-purple-500/30 h-10"
          />
        </div>
      </div>
      {isEditing && 'completed' in sadhana && (
        <div className="grid gap-2 pt-2">
          <div className="flex items-center gap-2">
            <Switch
              checked={sadhana.completed}
              onCheckedChange={(checked) => setSadhana({ ...sadhana, completed: checked })}
            />
            <Label className="text-sm">Mark as completed</Label>
          </div>
        </div>
      )}
    </div>
  );
};

export default SadhanaForm;