
import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface DeityEssenceProps {
  deityData: {
    name: string;
    essence: string;
    avatar: string;
    sadhanaHistory: Array<{
      id: number;
      practice: string;
      insights: string;
      date: string;
    }>;
  };
  onDeityDataChange: (data: any) => void;
  onSaveChanges: () => void;
}

const DeityEssence = ({ deityData, onDeityDataChange, onSaveChanges }: DeityEssenceProps) => {
  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader className="text-center">
          <Avatar className="h-24 w-24 mx-auto glow-primary">
            <AvatarImage src={deityData.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
              {deityData.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="mt-4">{deityData.name}</CardTitle>
          <CardDescription className="flex justify-center items-center gap-1">
            <Sparkles className="h-3 w-3" />
            <span>{deityData.essence}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-secondary/40 p-4 rounded-lg">
              <h3 className="font-medium text-sm text-muted-foreground">Divine Name</h3>
              <Input 
                value={deityData.name}
                onChange={(e) => onDeityDataChange({...deityData, name: e.target.value})}
                className="mt-2"
              />
            </div>
            <div className="bg-secondary/40 p-4 rounded-lg">
              <h3 className="font-medium text-sm text-muted-foreground">Divine Essence</h3>
              <Input 
                value={deityData.essence}
                onChange={(e) => onDeityDataChange({...deityData, essence: e.target.value})}
                className="mt-2"
              />
            </div>
            <Button 
              variant="outline" 
              className="w-full bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300"
              onClick={onSaveChanges}
            >
              <Check className="mr-2 h-4 w-4" /> Save Divine Essence
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Sadhana Journey</span>
          </CardTitle>
          <CardDescription>
            Your spiritual insights and revelations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {deityData.sadhanaHistory.map((entry) => (
              <div key={entry.id} className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-lg">{entry.practice}</h3>
                    <p className="text-sm text-muted-foreground">{formatDate(entry.date)}</p>
                  </div>
                </div>
                
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <h4 className="text-xs font-medium text-muted-foreground">INSIGHT</h4>
                  <p className="mt-1 text-sm">{entry.insights}</p>
                </div>
                
                <Separator className="my-2" />
              </div>
            ))}

            <div className="text-center pt-2">
              <Button 
                variant="ghost" 
                className="bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300"
              >
                <Plus className="mr-2 h-4 w-4" /> Record New Sadhana Insight
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeityEssence;
