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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Calendar, Heart, Sparkles } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { useThemeColors } from "@/hooks/useThemeColors";
import { SadhanaData } from "@/hooks/useSadhanaData";

interface SadhanaSetupFormProps {
  onCreateSadhana: (data: SadhanaData) => void;
  onCancel: () => void;
}

const SadhanaSetupForm = ({
  onCreateSadhana,
  onCancel,
}: SadhanaSetupFormProps) => {
  const { settings } = useSettings();
  const { colors } = useThemeColors();
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    purpose: "",
    goal: "",
    startDate: today,
    durationDays: 40,
    endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    deity: "",
    message: "",
    offerings: [""],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if Shiva theme is active
  const isShivaTheme = settings?.appearance?.colorScheme === "shiva";

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.purpose.trim()) {
      newErrors.purpose = "Purpose is required";
    }

    if (!formData.goal.trim()) {
      newErrors.goal = "Goal is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.deity.trim()) {
      newErrors.deity = "Deity or spiritual focus is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    const hasOfferings = formData.offerings.some(
      (offering) => offering.trim() !== "",
    );
    if (!hasOfferings) {
      newErrors.offerings = "At least one offering is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartDateChange = (date: string) => {
    const startDate = new Date(date);
    const endDate = new Date(
      startDate.getTime() + formData.durationDays * 24 * 60 * 60 * 1000,
    );

    setFormData((prev) => ({
      ...prev,
      startDate: date,
      endDate: endDate.toISOString().split("T")[0],
    }));
  };

  const handleDurationChange = (days: number) => {
    const startDate = new Date(formData.startDate);
    const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);

    setFormData((prev) => ({
      ...prev,
      durationDays: days,
      endDate: endDate.toISOString().split("T")[0],
    }));
  };

  const handleOfferingChange = (index: number, value: string) => {
    const newOfferings = [...formData.offerings];
    newOfferings[index] = value;
    setFormData((prev) => ({ ...prev, offerings: newOfferings }));
  };

  const handleAddOffering = () => {
    setFormData((prev) => ({ ...prev, offerings: [...prev.offerings, ""] }));
  };

  const handleRemoveOffering = (index: number) => {
    if (formData.offerings.length <= 1) return;

    const newOfferings = [...formData.offerings];
    newOfferings.splice(index, 1);
    setFormData((prev) => ({ ...prev, offerings: newOfferings }));
  };

  const handleSubmit = () => {
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
    <div
      className={`rounded-lg p-4 md:p-6 ${isShivaTheme ? "bg-transparent" : "bg-transparent"}`}
    >
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
              style={{ color: "hsl(45 100% 50%)" }}
            >
              Create Your Sacred Sadhana
            </h2>
            <p
              className="text-sm md:text-base"
              style={{ color: "hsl(210 40% 80%)" }}
            >
              Fill in your spiritual intentions and divine commitments
            </p>
          </div>
        </div>

        {/* Mobile-optimized grid layout */}
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <div className="space-y-4 md:space-y-6">
            <Card className="bg-transparent border border-amber-400/20 hover:border-amber-400/40 transition-colors shadow-lg shadow-amber-500/10">
              <CardHeader className="bg-gradient-to-r from-amber-500/5 to-yellow-500/5 border-b border-amber-400/10 p-4 md:p-6">
                <CardTitle style={{ color: "hsl(45 100% 50%)" }} className="text-lg md:text-xl uppercase tracking-wide">
                  Purpose & Goal
                </CardTitle>
                <CardDescription style={{ color: "hsl(210 40% 80%)" }} className="text-xs md:text-sm">
                  Why you're on this spiritual journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4 md:p-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="purpose"
                    style={{ color: "hsl(210 40% 80%)" }}
                    className="text-sm md:text-base font-semibold uppercase tracking-wide"
                  >
                    Purpose *
                  </Label>
                  <div className="space-y-3">
                    <Textarea
                      id="purpose"
                      value={formData.purpose}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          purpose: e.target.value,
                        }))
                      }
                      placeholder="What is the purpose of your spiritual practice?"
                      className="min-h-[80px] md:min-h-[100px] bg-background/40 border-amber-400/30 focus:border-amber-400/60 text-black placeholder:text-gray-500 rounded-lg transition-colors text-sm md:text-base"
                    />
                    {errors.purpose && (
                      <p className="text-xs md:text-sm text-destructive">
                        {errors.purpose}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-3 pt-3 md:pt-4 border-t border-white/10">
                  <Label
                    htmlFor="goal"
                    style={{ color: "hsl(210 40% 80%)" }}
                    className="text-sm md:text-base font-semibold uppercase tracking-wide"
                  >
                    Goal *
                  </Label>
                  <div className="space-y-3">
                    <Textarea
                      id="goal"
                      value={formData.goal}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          goal: e.target.value,
                        }))
                      }
                      placeholder="What is your specific spiritual goal?"
                      className="min-h-[80px] md:min-h-[100px] bg-background/40 border-amber-400/30 focus:border-amber-400/60 text-black placeholder:text-gray-500 rounded-lg transition-colors text-sm md:text-base"
                    />
                    {errors.goal && (
                      <p className="text-xs md:text-sm text-destructive">{errors.goal}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-transparent border border-amber-400/20 hover:border-amber-400/40 transition-colors shadow-lg shadow-amber-500/10">
              <CardHeader className="bg-gradient-to-r from-amber-500/5 to-yellow-500/5 border-b border-amber-400/10 p-4 md:p-6">
                <CardTitle
                  className="flex items-center gap-2 text-lg md:text-xl uppercase tracking-wide"
                  style={{ color: "hsl(45 100% 50%)" }}
                >
                  <Calendar className="h-4 w-4 md:h-5 md:w-5" style={{ color: "hsl(45 100% 50%)" }} />
                  <span>Duration & Timeline</span>
                </CardTitle>
                <CardDescription style={{ color: "hsl(210 40% 80%)" }} className="text-xs md:text-sm">
                  Set your sadhana practice period
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" style={{ color: "hsl(210 40% 80%)" }} className="text-sm md:text-base font-semibold uppercase tracking-wide">
                      Start Date *
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      min={today}
                      className="text-sm md:text-base"
                    />
                    {errors.startDate && (
                      <p className="text-xs md:text-sm text-destructive">
                        {errors.startDate}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration" style={{ color: "hsl(210 40% 80%)" }} className="text-sm md:text-base font-semibold uppercase tracking-wide">
                      Duration
                    </Label>
                    <Select
                      value={formData.durationDays.toString()}
                      onValueChange={(value) =>
                        handleDurationChange(parseInt(value))
                      }
                    >
                      <SelectTrigger className="text-sm md:text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days (1 week)</SelectItem>
                        <SelectItem value="14">14 days (2 weeks)</SelectItem>
                        <SelectItem value="21">21 days (3 weeks)</SelectItem>
                        <SelectItem value="30">30 days (1 month)</SelectItem>
                        <SelectItem value="40">40 days</SelectItem>
                        <SelectItem value="60">60 days (2 months)</SelectItem>
                        <SelectItem value="90">90 days (3 months)</SelectItem>
                        <SelectItem value="108">
                          108 days (Traditional)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.duration && (
                      <p className="text-xs md:text-sm text-destructive">
                        {errors.duration}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-xs md:text-sm" style={{ color: "white" }}>
                  <p>
                    End Date:{" "}
                    {format(new Date(formData.endDate), "MMMM dd, yyyy")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 md:space-y-6">
            <Card className="bg-transparent border border-pink-400/20 hover:border-pink-400/40 transition-colors shadow-lg shadow-pink-500/10">
              <CardHeader className="bg-gradient-to-r from-pink-500/5 to-purple-500/5 border-b border-pink-400/10 p-4 md:p-6">
                <CardTitle
                  className="flex items-center gap-2 text-lg md:text-xl uppercase tracking-wide"
                  style={{ color: "hsl(45 100% 50%)" }}
                >
                  <Heart className="h-4 w-4 md:h-5 md:w-5" style={{ color: "hsl(45 100% 50%)" }} />
                  <span>Divine Connection</span>
                </CardTitle>
                <CardDescription style={{ color: "hsl(210 40% 80%)" }} className="text-xs md:text-sm">
                  Your chosen deity or spiritual focus
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="deity"
                    style={{ color: "hsl(210 40% 80%)" }}
                    className="text-sm md:text-base font-semibold uppercase tracking-wide"
                  >
                    Deity or Spiritual Focus *
                  </Label>
                  <Input
                    id="deity"
                    value={formData.deity}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        deity: e.target.value,
                      }))
                    }
                    placeholder="Who or what is your spiritual focus?"
                    className="bg-background/40 border-amber-400/30 focus:border-amber-400/60 text-black placeholder:text-gray-500 rounded-lg transition-colors text-sm md:text-base"
                  />
                  {errors.deity && (
                    <p className="text-xs md:text-sm text-destructive">{errors.deity}</p>
                  )}
                </div>
                <div className="space-y-3 pt-3 md:pt-4 border-t border-white/10">
                  <Label
                    htmlFor="message"
                    style={{ color: "hsl(210 40% 80%)" }}
                    className="text-sm md:text-base font-semibold uppercase tracking-wide"
                  >
                    Your Message *
                  </Label>
                  <div className="space-y-3">
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      placeholder="What message would you like to share with your deity?"
                      className="min-h-[80px] md:min-h-[100px] bg-background/40 border-amber-400/30 focus:border-amber-400/60 text-black placeholder:text-gray-500 rounded-lg transition-colors text-sm md:text-base"
                    />
                    {errors.message && (
                      <p className="text-xs md:text-sm text-destructive">
                        {errors.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-transparent border border-purple-400/20 hover:border-purple-400/40 transition-colors shadow-lg shadow-purple-500/10">
              <CardHeader className="bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-b border-purple-400/10 p-4 md:p-6">
                <CardTitle style={{ color: "hsl(45 100% 50%)" }} className="text-lg md:text-xl uppercase tracking-wide">
                  Offerings & Practices
                </CardTitle>
                <CardDescription style={{ color: "hsl(210 40% 80%)" }} className="text-xs md:text-sm">
                  What you'll be doing or offering for your spiritual practice
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="space-y-3">
                  {formData.offerings.map((offering, index) => (
                    <div key={index} className="flex gap-2 group">
                      <Input
                        value={offering}
                        onChange={(e) =>
                          handleOfferingChange(index, e.target.value)
                        }
                        placeholder={`Offering or practice ${index + 1}`}
                        className="bg-background/40 border-purple-400/30 focus:border-purple-400/60 text-black placeholder:text-gray-500 rounded-lg transition-colors group-hover:border-purple-400/50 text-sm md:text-base"
                      />
                      {formData.offerings.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-purple-400/60 hover:text-purple-300 hover:bg-purple-500/10 h-9 w-9 md:h-10 md:w-10"
                          onClick={() => handleRemoveOffering(index)}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                  {errors.offerings && (
                    <p className="text-xs md:text-sm text-destructive">
                      {errors.offerings}
                    </p>
                  )}

                  <Button
                    variant="outline"
                    className="w-full mt-3 md:mt-4 bg-purple-500/10 border-purple-400/30 hover:bg-purple-500/20 hover:border-purple-400/50 text-purple-300 hover:text-purple-200 transition-colors text-sm md:text-base h-9 md:h-10"
                    onClick={handleAddOffering}
                  >
                    + Add New Offering
                  </Button>

                  <Button
                    className="w-full mt-4 md:mt-6 bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg transition-all hover:shadow-amber-500/50 text-sm md:text-base h-10 md:h-12 rounded-full"
                    onClick={handleSubmit}
                  >
                    <Sparkles className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    Begin Sacred Sadhana
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SadhanaSetupForm;