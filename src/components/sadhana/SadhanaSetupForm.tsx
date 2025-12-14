import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { SadhanaData } from "@/hooks/useSadhanaData";
import { TransparentGlassMorphismContainer } from "@/components/design/SadhanaDesignComponents";

interface SadhanaSetupFormProps {
  onCreateSadhana: (data: SadhanaData) => void;
  onCancel: () => void;
}

const SadhanaSetupForm = ({ onCreateSadhana, onCancel }: SadhanaSetupFormProps) => {
  const [formData, setFormData] = useState({
    purpose: "",
    goal: "",
    deity: "",
    message: "",
    offerings: [''] as string[],
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    durationDays: 40,
  });

  const addOffering = () => {
    setFormData(prev => ({
      ...prev,
      offerings: [...prev.offerings, ""],
    }));
  };

  const removeOffering = (index: number) => {
    if (formData.offerings.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      offerings: prev.offerings.filter((_, i) => i !== index),
    }));
  };

  const updateOffering = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      offerings: prev.offerings.map((offering, i) =>
        i === index ? value : offering
      ),
    }));
  };

  const validateForm = () => {
    return formData.purpose.trim() !== "" && formData.goal.trim() !== "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onCreateSadhana({
        purpose: formData.purpose,
        goal: formData.goal,
        startDate: formData.startDate,
        durationDays: formData.durationDays,
        endDate: formData.endDate,
        deity: formData.deity,
        message: formData.message,
        offerings: formData.offerings.filter((o) => o.trim() !== ""),
      });
    }
  };

  return (
    <TransparentGlassMorphismContainer className="rounded-lg p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6 md:mb-8 md:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="hover:bg-white/10 h-8 w-8 p-0 md:h-9 md:w-9"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h2
              className="text-2xl md:text-3xl font-bold uppercase tracking-wide"
              style={{ color: "hsl(45 100% 50%)", fontFamily: '"Chakra Petch", sans-serif', textShadow: '0 0 8px rgba(255, 215, 0, 0.6)' }}
            >
              Create Your Sacred Sadhana
            </h2>
            <p
              className="text-sm md:text-base"
              style={{ color: "hsl(210 40% 80%)", fontFamily: '"Chakra Petch", sans-serif' }}
            >
              Fill in your spiritual intentions and divine commitments
            </p>
          </div>
        </div>

        {/* Mobile-optimized grid layout */}
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <div className="space-y-4 md:space-y-6">
            <Card className="bg-gradient-to-r from-[#DC143C]/50 to-[#8B0000]/50 backdrop-blur-md border border-amber-400/20 hover:border-amber-400/40 transition-colors shadow-lg shadow-amber-500/10">
              <CardHeader className="bg-gradient-to-r from-amber-500/5 to-yellow-500/5 border-b border-amber-400/10 p-4 md:p-6">
                <CardTitle style={{ color: "hsl(45 100% 50%)", fontFamily: '"Chakra Petch", sans-serif', textShadow: '0 0 8px rgba(255, 215, 0, 0.6)' }} className="text-lg md:text-xl uppercase tracking-wide">
                  Purpose & Goal
                </CardTitle>
                <CardDescription style={{ color: "hsl(210 40% 80%)", fontFamily: '"Chakra Petch", sans-serif' }} className="text-xs md:text-sm">
                  Why you're on this spiritual journey
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="purpose" style={{ color: "hsl(45 100% 50%)", fontFamily: '"Chakra Petch", sans-serif' }} className="text-sm font-medium">
                    Sacred Purpose
                  </Label>
                  <Textarea
                    id="purpose"
                    value={formData.purpose}
                    onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                    placeholder="What divine intention drives this practice?"
                    className="min-h-[100px] bg-background/50 border-amber-400/30 focus:border-amber-400/60 focus:ring-amber-400/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal" style={{ color: "hsl(45 100% 50%)", fontFamily: '"Chakra Petch", sans-serif' }} className="text-sm font-medium">
                    Spiritual Goal
                  </Label>
                  <Input
                    id="goal"
                    value={formData.goal}
                    onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                    placeholder="What transformation do you seek?"
                    className="bg-background/50 border-amber-400/30 focus:border-amber-400/60 focus:ring-amber-400/30"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-[#DC143C]/50 to-[#8B0000]/50 backdrop-blur-md border border-amber-400/20 hover:border-amber-400/40 transition-colors shadow-lg shadow-amber-500/10">
              <CardHeader className="bg-gradient-to-r from-amber-500/5 to-yellow-500/5 border-b border-amber-400/10 p-4 md:p-6">
                <CardTitle style={{ color: "hsl(45 100% 50%)", fontFamily: '"Chakra Petch", sans-serif', textShadow: '0 0 8px rgba(255, 215, 0, 0.6)' }} className="text-lg md:text-xl uppercase tracking-wide">
                  Divine Connection
                </CardTitle>
                <CardDescription style={{ color: "hsl(210 40% 80%)", fontFamily: '"Chakra Petch", sans-serif' }} className="text-xs md:text-sm">
                  Your spiritual focal point
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deity" style={{ color: "hsl(45 100% 50%)", fontFamily: '"Chakra Petch", sans-serif' }} className="text-sm font-medium">
                    Deity or Focus
                  </Label>
                  <Input
                    id="deity"
                    value={formData.deity}
                    onChange={(e) => setFormData(prev => ({ ...prev, deity: e.target.value }))}
                    placeholder="Which divine presence guides this practice?"
                    className="bg-background/50 border-amber-400/30 focus:border-amber-400/60 focus:ring-amber-400/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" style={{ color: "hsl(45 100% 50%)", fontFamily: '"Chakra Petch", sans-serif' }} className="text-sm font-medium">
                    Personal Message
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="A heartfelt note to your divine self..."
                    className="min-h-[80px] bg-background/50 border-amber-400/30 focus:border-amber-400/60 focus:ring-amber-400/30"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-[#DC143C]/50 to-[#8B0000]/50 backdrop-blur-md border border-amber-400/20 hover:border-amber-400/40 transition-colors shadow-lg shadow-amber-500/10">
              <CardHeader className="bg-gradient-to-r from-amber-500/5 to-yellow-500/5 border-b border-amber-400/10 p-4 md:p-6">
                <CardTitle style={{ color: "hsl(45 100% 50%)", fontFamily: '"Chakra Petch", sans-serif', textShadow: '0 0 8px rgba(255, 215, 0, 0.6)' }} className="text-lg md:text-xl uppercase tracking-wide">
                  Sacred Offerings
                </CardTitle>
                <CardDescription style={{ color: "hsl(210 40% 80%)", fontFamily: '"Chakra Petch", sans-serif' }} className="text-xs md:text-sm">
                  What you dedicate to the divine
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 space-y-3">
                {formData.offerings.map((offering, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={offering}
                      onChange={(e) => updateOffering(index, e.target.value)}
                      placeholder={`Offering #${index + 1} (e.g., flowers, incense, silence)`}
                      className="flex-1 bg-background/50 border-amber-400/30 focus:border-amber-400/60 focus:ring-amber-400/30"
                    />
                    {formData.offerings.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeOffering(index)}
                        className="border-amber-400/30 hover:bg-amber-400/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addOffering}
                  className="w-full border-amber-400/30 hover:bg-amber-400/10"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Offering
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-[#DC143C]/50 to-[#8B0000]/50 backdrop-blur-md border border-amber-400/20 hover:border-amber-400/40 transition-colors shadow-lg shadow-amber-500/10">
              <CardHeader className="bg-gradient-to-r from-amber-500/5 to-yellow-500/5 border-b border-amber-400/10 p-4 md:p-6">
                <CardTitle style={{ color: "hsl(45 100% 50%)", fontFamily: '"Chakra Petch", sans-serif', textShadow: '0 0 8px rgba(255, 215, 0, 0.6)' }} className="text-lg md:text-xl uppercase tracking-wide">
                  Practice Duration
                </CardTitle>
                <CardDescription style={{ color: "hsl(210 40% 80%)", fontFamily: '"Chakra Petch", sans-serif' }} className="text-xs md:text-sm">
                  How long you commit to this sacred journey
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" style={{ color: "hsl(45 100% 50%)", fontFamily: '"Chakra Petch", sans-serif' }} className="text-sm font-medium">
                      Start Date
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => {
                        const startDate = e.target.value;
                        const endDate = new Date(startDate);
                        endDate.setDate(endDate.getDate() + formData.durationDays);
                        setFormData(prev => ({
                          ...prev,
                          startDate,
                          endDate: endDate.toISOString().split('T')[0]
                        }));
                      }}
                      className="bg-background/50 border-amber-400/30 focus:border-amber-400/60 focus:ring-amber-400/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration" style={{ color: "hsl(45 100% 50%)", fontFamily: '"Chakra Petch", sans-serif' }} className="text-sm font-medium">
                      Duration (Days)
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      max="365"
                      value={formData.durationDays}
                      onChange={(e) => {
                        const durationDays = parseInt(e.target.value) || 1;
                        const endDate = new Date(formData.startDate);
                        endDate.setDate(endDate.getDate() + durationDays);
                        setFormData(prev => ({
                          ...prev,
                          durationDays,
                          endDate: endDate.toISOString().split('T')[0]
                        }));
                      }}
                      className="bg-background/50 border-amber-400/30 focus:border-amber-400/60 focus:ring-amber-400/30"
                    />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-amber-400/20">
                  <p className="text-sm" style={{ color: "hsl(210 40% 80%)", fontFamily: '"Chakra Petch", sans-serif' }}>
                    End Date: {new Date(formData.endDate).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-amber-400/30 hover:bg-amber-400/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={!validateForm()}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
            >
              Create Sacred Commitment
            </Button>
          </div>
        </div>
      </div>
    </TransparentGlassMorphismContainer>
  );
};

export default SadhanaSetupForm;