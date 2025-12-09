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
      className={`rounded-lg p-6 ${isShivaTheme ? "bg-transparent" : "bg-transparent"}`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h2
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent"
              style={{ color: "hsl(45 100% 50%)" }}
            >
              Create Your Sacred Sadhana
            </h2>
            <p
              className="text-amber-100/80 mt-1"
              style={{ color: "hsl(45 100% 50%)" }}
            >
              Fill in your spiritual intentions and divine commitments
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="bg-transparent border border-amber-400/20 hover:border-amber-400/40 transition-colors shadow-lg shadow-amber-500/10">
              <CardHeader className="bg-gradient-to-r from-amber-500/5 to-yellow-500/5 border-b border-amber-400/10">
                <CardTitle style={{ color: "hsl(45 100% 50%)" }}>
                  Purpose & Goal
                </CardTitle>
                <CardDescription style={{ color: "white" }}>
                  Why you're on this spiritual journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="purpose"
                    style={{ color: "white" }}
                    className="text-base font-semibold"
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
                      className="min-h-[100px] bg-background/40 border-amber-400/30 focus:border-amber-400/60 text-black placeholder:text-gray-500 rounded-lg transition-colors"
                    />
                    {errors.purpose && (
                      <p className="text-sm text-destructive">
                        {errors.purpose}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <Label
                    htmlFor="goal"
                    style={{ color: "white" }}
                    className="text-base font-semibold"
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
                      className="min-h-[100px] bg-background/40 border-amber-400/30 focus:border-amber-400/60 text-black placeholder:text-gray-500 rounded-lg transition-colors"
                    />
                    {errors.goal && (
                      <p className="text-sm text-destructive">{errors.goal}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-transparent border border-amber-400/20 hover:border-amber-400/40 transition-colors shadow-lg shadow-amber-500/10">
              <CardHeader className="bg-gradient-to-r from-amber-500/5 to-yellow-500/5 border-b border-amber-400/10">
                <CardTitle
                  className="flex items-center gap-2"
                  style={{ color: "hsl(45 100% 50%)" }}
                >
                  <Calendar className="h-5 w-5 text-amber-400" />
                  <span>Duration & Timeline</span>
                </CardTitle>
                <CardDescription style={{ color: "white" }}>
                  Set your sadhana practice period
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" style={{ color: "white" }}>
                      Start Date *
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      min={today}
                    />
                    {errors.startDate && (
                      <p className="text-sm text-destructive">
                        {errors.startDate}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration" style={{ color: "white" }}>
                      Duration
                    </Label>
                    <Select
                      value={formData.durationDays.toString()}
                      onValueChange={(value) =>
                        handleDurationChange(parseInt(value))
                      }
                    >
                      <SelectTrigger>
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
                      <p className="text-sm text-destructive">
                        {errors.duration}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-sm" style={{ color: "white" }}>
                  <p>
                    End Date:{" "}
                    {format(new Date(formData.endDate), "MMMM dd, yyyy")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-transparent border border-pink-400/20 hover:border-pink-400/40 transition-colors shadow-lg shadow-pink-500/10">
              <CardHeader className="bg-gradient-to-r from-pink-500/5 to-purple-500/5 border-b border-pink-400/10">
                <CardTitle
                  className="flex items-center gap-2"
                  style={{ color: "hsl(45 100% 50%)" }}
                >
                  <Heart className="h-5 w-5 text-pink-400" />
                  <span>Divine Connection</span>
                </CardTitle>
                <CardDescription style={{ color: "white" }}>
                  Your chosen deity or spiritual focus
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="deity"
                    style={{ color: "white" }}
                    className="text-base font-semibold"
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
                    className="bg-background/40 border-amber-400/30 focus:border-amber-400/60 text-black placeholder:text-gray-500 rounded-lg transition-colors"
                  />
                  {errors.deity && (
                    <p className="text-sm text-destructive">{errors.deity}</p>
                  )}
                </div>
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <Label
                    htmlFor="message"
                    style={{ color: "white" }}
                    className="text-base font-semibold"
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
                      className="min-h-[100px] bg-background/40 border-amber-400/30 focus:border-amber-400/60 text-black placeholder:text-gray-500 rounded-lg transition-colors"
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive">
                        {errors.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-transparent border border-purple-400/20 hover:border-purple-400/40 transition-colors shadow-lg shadow-purple-500/10">
              <CardHeader className="bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-b border-purple-400/10">
                <CardTitle style={{ color: "hsl(45 100% 50%)" }}>
                  Offerings & Practices
                </CardTitle>
                <CardDescription style={{ color: "white" }}>
                  What you'll be doing or offering for your spiritual practice
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formData.offerings.map((offering, index) => (
                    <div key={index} className="flex gap-2 group">
                      <Input
                        value={offering}
                        onChange={(e) =>
                          handleOfferingChange(index, e.target.value)
                        }
                        placeholder={`Offering or practice ${index + 1}`}
                        className="bg-background/40 border-purple-400/30 focus:border-purple-400/60 text-black placeholder:text-gray-500 rounded-lg transition-colors group-hover:border-purple-400/50"
                      />
                      {formData.offerings.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-purple-400/60 hover:text-purple-300 hover:bg-purple-500/10"
                          onClick={() => handleRemoveOffering(index)}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                  {errors.offerings && (
                    <p className="text-sm text-destructive">
                      {errors.offerings}
                    </p>
                  )}

                  <Button
                    variant="outline"
                    className="w-full mt-4 bg-purple-500/10 border-purple-400/30 hover:bg-purple-500/20 hover:border-purple-400/50 text-purple-300 hover:text-purple-200 transition-colors"
                    onClick={handleAddOffering}
                  >
                    + Add New Offering
                  </Button>

                  <Button
                    className="w-full mt-6 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-black font-semibold shadow-lg shadow-amber-500/30 transition-all hover:shadow-amber-500/50"
                    onClick={handleSubmit}
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
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
