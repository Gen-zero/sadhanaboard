
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key } from "lucide-react";

interface ClaudeApiSetupProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

const ClaudeApiSetup: React.FC<ClaudeApiSetupProps> = ({ apiKey, setApiKey }) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    setApiKey(inputKey);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <Key className="h-4 w-4" />
          <span>{apiKey ? "Change API Key" : "Set Claude API Key"}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Claude AI API Key</DialogTitle>
          <DialogDescription>
            Enter your Claude API key to enable communication with Claude AI.
            You can get an API key from the Anthropic dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Enter your Claude AI API key"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Your API key is stored locally in your browser and never sent to our servers.
          </p>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={!inputKey}>Save API Key</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClaudeApiSetup;
