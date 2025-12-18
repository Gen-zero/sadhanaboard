import { useState } from 'react';
import { Sadhana } from '@/types/sadhana';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, MessageSquare, Clock, Sparkles, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface SadhanaCardProps {
  sadhana: Sadhana;
  onUpdate?: (sadhana: Sadhana) => void;
  onDelete?: (id: number) => void;
  onToggleCompletion?: (id: number) => void;
}

const SadhanaCard = ({ sadhana, onUpdate, onDelete, onToggleCompletion }: SadhanaCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30 shadow-sm shadow-red-500/10';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 shadow-sm shadow-yellow-500/10';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30 shadow-sm shadow-green-500/10';
      default: return 'bg-purple-500/20 text-purple-300 border-purple-500/30 shadow-sm shadow-purple-500/10';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'daily': return <Clock className="h-3 w-3" />;
      case 'goal': return null;
      default: return null;
    }
  };

  const isSadhanaTask = sadhana.tags?.includes('sadhana') || sadhana.sadhanaId;

  const handleReflection = () => {
    // This would open a reflection dialog - implementation depends on parent component
    console.log('Open reflection for:', sadhana.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className={cn(
        "group hover:shadow-xl transition-all duration-500 cosmic-highlight",
        "backdrop-blur-sm border border-purple-500/30 bg-gradient-to-br from-background/50 to-purple-900/10 rounded-2xl",
        "shadow-[0_0_30px_rgba(192,132,252,0.1)] hover:shadow-[0_0_50px_rgba(192,132,252,0.2)]",
        sadhana.completed && "opacity-75 border-purple-500/10",
        isSadhanaTask && "border-purple-400/40 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 shadow-lg shadow-purple-500/20",
        !isSadhanaTask && "bg-gradient-to-r from-purple-900/10 to-indigo-900/10 hover:border-purple-500/40 hover:shadow-purple-500/20 hover:from-purple-900/20 hover:to-indigo-900/20"
      )}>
        <CardContent className="p-5 relative overflow-hidden">
          {/* Premium background elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <motion.div whileTap={{ scale: 0.9 }} className="mt-0.5">
                  <Checkbox
                    checked={sadhana.completed}
                    onCheckedChange={() => onToggleCompletion?.(sadhana.id)}
                    className="h-6 w-6 rounded-full border-2 border-purple-500/50 data-[state=checked]:bg-purple-500/80 data-[state=checked]:border-purple-500"
                  />
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <motion.h3 
                      className={cn(
                        "font-bold text-lg leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-cyan-300",
                        sadhana.completed && "line-through text-muted-foreground"
                      )}
                      whileHover={{ scale: 1.02 }}
                    >
                      {sadhana.title}
                    </motion.h3>
                    {isSadhanaTask && (
                      <motion.div 
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        className="flex items-center"
                      >
                        <Sparkles className="h-5 w-5 text-purple-400" />
                      </motion.div>
                    )}
                  </div>
                  
                  {sadhana.description && (
                    <p className="text-sm text-muted-foreground/80 mb-3 line-clamp-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-200/70 to-cyan-200/70">
                      {sadhana.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="outline" className={cn("text-xs px-2.5 py-1 h-auto font-medium", getPriorityColor(sadhana.priority))}>
                      {sadhana.priority}
                    </Badge>
                    
                    <Badge variant="outline" className="text-xs px-2.5 py-1 h-auto flex items-center gap-1 bg-purple-500/10 text-purple-300 border-purple-500/30 shadow-sm shadow-purple-500/10">
                      {getCategoryIcon(sadhana.category)}
                      <span>{sadhana.category}</span>
                    </Badge>
                    
                    {sadhana.dueDate && (
                      <Badge variant="outline" className="text-xs px-2.5 py-1 h-auto bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-sm shadow-cyan-500/10">
                        {format(new Date(sadhana.dueDate), 'MMM dd')}
                      </Badge>
                    )}
                    
                    {sadhana.time && (
                      <Badge variant="outline" className="text-xs px-2.5 py-1 h-auto bg-slate-500/10 text-slate-300 border-slate-500/30 shadow-sm shadow-slate-500/10">
                        {sadhana.time}
                      </Badge>
                    )}

                    {sadhana.streak && sadhana.streak > 0 && (
                      <Badge variant="outline" className="text-xs px-2.5 py-1 h-auto bg-orange-500/10 text-orange-300 border-orange-500/30 shadow-sm shadow-orange-500/10">
                        <Flame className="h-3 w-3 mr-1" />
                        {sadhana.streak} streak
                      </Badge>
                    )}

                    {sadhana.tags?.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className={cn(
                          "text-xs px-2.5 py-1 h-auto font-medium",
                          tag === 'sadhana' && "bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm shadow-purple-500/20",
                          tag !== 'sadhana' && "bg-accent/20 text-accent-foreground border-accent/30 shadow-sm"
                        )}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-500/10">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border-purple-500/30 bg-background/80 backdrop-blur-lg">
                    <DropdownMenuItem onClick={() => setIsEditing(true)} className="hover:bg-purple-500/10">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    {sadhana.completed && (
                      <DropdownMenuItem onClick={handleReflection} className="hover:bg-purple-500/10">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Add Reflection
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem onClick={() => onDelete(sadhana.id)} className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>


            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SadhanaCard;