
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface TraditionManagerProps {
  traditions: string[];
  onTraditionsChange: (traditions: string[]) => void;
}

const TraditionManager = ({ traditions, onTraditionsChange }: TraditionManagerProps) => {
  const [traditionInput, setTraditionInput] = useState("");

  const addTradition = () => {
    if (traditionInput.trim() && !traditions.includes(traditionInput.trim())) {
      onTraditionsChange([...traditions, traditionInput.trim()]);
      setTraditionInput("");
    }
  };

  const removeTradition = (tradition: string) => {
    onTraditionsChange(traditions.filter(t => t !== tradition));
  };

  return (
    <div className="space-y-2">
      <Label>Spiritual Traditions</Label>
      <div className="flex gap-2">
        <Input
          value={traditionInput}
          onChange={(e) => setTraditionInput(e.target.value)}
          placeholder="Add tradition (e.g., Buddhism, Hinduism)"
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTradition())}
        />
        <Button type="button" onClick={addTradition} variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {traditions.map((tradition) => (
          <Badge key={tradition} variant="outline" className="bg-purple-500/10">
            {tradition}
            <button
              type="button"
              onClick={() => removeTradition(tradition)}
              className="ml-1 hover:text-red-500"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TraditionManager;
