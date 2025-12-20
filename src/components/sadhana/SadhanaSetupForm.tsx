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
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Plus, Trash2, Zap, Sparkles, Target, Calendar as CalendarIcon, Flame, Heart, Hexagon, CheckSquare } from "lucide-react";
import { SadhanaData, SadhanaTask } from "@/hooks/useSadhanaData";
import { motion, AnimatePresence } from "framer-motion";
import { PulsingOMSymbol } from "@/components/design/SadhanaDesignComponents";


interface SadhanaSetupFormProps {
  onCreateSadhana: (data: SadhanaData) => void;
  onCancel: () => void;
  onSaveAsDraft?: (data: SadhanaData) => void;
}

const SadhanaSetupForm = ({ onCreateSadhana, onCancel, onSaveAsDraft }: SadhanaSetupFormProps) => {
  const [formData, setFormData] = useState({
    purpose: "",
    goal: "",
    deity: "",
    message: "",
    offerings: [''] as string[],
    tasks: [] as { description: string; deadline: string }[],
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    durationDays: 40,
    durationMinutes: 1,
    durationUnit: 'days' as 'days' | 'minutes', // New field to toggle between days and minutes
  });

  const [draftName, setDraftName] = useState("");
  const [draftDescription, setDraftDescription] = useState("");

  const [activeStep, setActiveStep] = useState(0);

  const getDurationPreset = (days: number) => {
    if (days <= 7) return "Sprint";
    if (days <= 21) return "Challenge";
    if (days <= 40) return "Discipline";
    if (days <= 90) return "Mastery";
    return "Legendary";
  };
  
  const getMinutesPreset = (minutes: number) => {
    if (minutes <= 1) return "Moment";
    if (minutes <= 5) return "Brief";
    if (minutes <= 15) return "Focused";
    if (minutes <= 30) return "Extended";
    return "Deep Session";
  };

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

  const addTask = () => {
    setFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, { description: "", deadline: prev.endDate }],
    }));
  };

  const removeTask = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index),
    }));
  };

  const updateTask = (index: number, field: 'description' | 'deadline', value: string) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) =>
        i === index ? { ...task, [field]: value } : task
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
        durationMinutes: formData.durationMinutes,
        durationUnit: formData.durationUnit,
        endDate: formData.endDate,
        deity: formData.deity,
        message: formData.message,
        offerings: formData.offerings.filter((o) => o.trim() !== ""),
        tasks: formData.tasks.filter(t => t.description.trim() !== "").map(t => ({
          id: Date.now().toString() + Math.random(),
          description: t.description,
          deadline: t.deadline,
          isCompleted: false
        })),
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto backdrop-blur-xl bg-gradient-to-br from-gray-900/70 to-black/70 border border-amber-500/20 rounded-2xl shadow-xl p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Top Identifier Badge */}
        <div className="flex items-center justify-center mb-6">
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-full border"
            style={{
              borderColor: 'rgba(255, 215, 0, 0.25)',
              backgroundColor: 'rgba(139, 0, 0, 0.25)'
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#FFD700' }} />
            <span className="text-[10px] uppercase tracking-widest" style={{ color: '#FFD700' }}>
              Interface::Sadhana_Configuration
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-6 md:mb-8 md:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="hover:bg-white/10 h-8 w-8 p-0 md:h-9 md:w-9 text-amber-500 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 text-center">
            <PulsingOMSymbol size="text-2xl" className="mb-4 mt-2" />
            <h2
              className="text-2xl md:text-3xl font-bold uppercase tracking-wide"
              style={{ color: "#FFD700", fontFamily: '"Chakra Petch", sans-serif', textShadow: '0 0 8px rgba(255, 215, 0, 0.6)' }}
            >
              Create Your Sacred Sadhana
            </h2>
            <p
              className="text-sm md:text-base mt-2"
              style={{ color: "rgba(255,255,255,0.7)", fontFamily: '"Chakra Petch", sans-serif' }}
            >
              Configure your spiritual practice parameters
            </p>
          </div>
        </div>

        {/* Mobile-optimized grid layout */}
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <div className="space-y-4 md:space-y-6">
            {/* Purpose & Goal Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative group/quote"
            >
              <div
                className="relative p-6 rounded-lg border backdrop-blur-md transition-all duration-300 transform hover:scale-[1.01]"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderColor: 'rgba(255, 215, 0, 0.19)'
                }}
              >
                <Hexagon className="absolute -top-3 -left-3 w-6 h-6 fill-black" style={{ color: '#FFD700' }} />
                <Hexagon className="absolute -top-3 -right-3 w-6 h-6 fill-black" style={{ color: '#FFD700' }} />

                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg md:text-xl font-bold uppercase tracking-wide" style={{ color: '#FFD700' }}>
                      Purpose & Goal
                    </h3>
                    <p className="text-xs text-white/60">Define your spiritual destination</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose" style={{ color: '#FFD700', fontFamily: '"Chakra Petch", sans-serif' }} className="text-sm font-medium flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Sacred Purpose
                    </Label>
                    <Textarea
                      id="purpose"
                      value={formData.purpose}
                      onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                      placeholder="What divine intention drives this practice?"
                      className="min-h-[100px] bg-black/20 border-amber-400/20 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/30 text-white placeholder:text-white/30 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal" style={{ color: '#FFD700', fontFamily: '"Chakra Petch", sans-serif' }} className="text-sm font-medium flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Spiritual Goal
                    </Label>
                    <Input
                      id="goal"
                      value={formData.goal}
                      onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                      placeholder="What transformation do you seek?"
                      className="bg-black/20 border-amber-400/20 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/30 text-white placeholder:text-white/30 transition-all"
                    />
                  </div>
                </div>

                <Hexagon className="absolute -bottom-3 -left-3 w-6 h-6 fill-black" style={{ color: '#FFD700' }} />
                <Hexagon className="absolute -bottom-3 -right-3 w-6 h-6 fill-black" style={{ color: '#FFD700' }} />
              </div>
            </motion.div>

            {/* Divine Connection Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative group/quote"
            >
              <div
                className="relative p-6 rounded-lg border backdrop-blur-md transition-all duration-300 transform hover:scale-[1.01]"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderColor: 'rgba(255, 215, 0, 0.19)'
                }}
              >
                <Hexagon className="absolute -top-3 -left-3 w-6 h-6 fill-black" style={{ color: '#FFD700' }} />
                <Hexagon className="absolute -top-3 -right-3 w-6 h-6 fill-black" style={{ color: '#FFD700' }} />

                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg md:text-xl font-bold uppercase tracking-wide" style={{ color: '#FFD700' }}>
                      Divine Connection
                    </h3>
                    <p className="text-xs text-white/60">Your spiritual focal point</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deity" style={{ color: '#FFD700', fontFamily: '"Chakra Petch", sans-serif' }} className="text-sm font-medium">
                      Deity or Focus
                    </Label>
                    <Input
                      id="deity"
                      value={formData.deity}
                      onChange={(e) => setFormData(prev => ({ ...prev, deity: e.target.value }))}
                      placeholder="Which divine presence guides this practice?"
                      className="bg-black/20 border-amber-400/20 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/30 text-white placeholder:text-white/30 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" style={{ color: '#FFD700', fontFamily: '"Chakra Petch", sans-serif' }} className="text-sm font-medium">
                      Personal Message
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="A heartfelt note to your divine self..."
                      className="min-h-[80px] bg-black/20 border-amber-400/20 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/30 text-white placeholder:text-white/30 transition-all"
                    />
                  </div>
                </div>

                <Hexagon className="absolute -bottom-3 -left-3 w-6 h-6 fill-black" style={{ color: '#FFD700' }} />
                <Hexagon className="absolute -bottom-3 -right-3 w-6 h-6 fill-black" style={{ color: '#FFD700' }} />
              </div>
            </motion.div>

            {/* Sacred Offerings Card - Matching design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="relative group/quote"
            >
              <div
                className="relative p-6 rounded-lg border backdrop-blur-md transition-all duration-300 transform hover:scale-[1.01]"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderColor: 'rgba(255, 215, 0, 0.19)'
                }}
              >
                <Hexagon className="absolute -top-3 -left-3 w-6 h-6 fill-black" style={{ color: '#FFD700' }} />
                <Hexagon className="absolute -top-3 -right-3 w-6 h-6 fill-black" style={{ color: '#FFD700' }} />

                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg md:text-xl font-bold uppercase tracking-wide" style={{ color: '#FFD700' }}>
                      Sacred Offerings
                    </h3>
                    <p className="text-xs text-white/60">What you dedicate to the divine</p>
                  </div>

                  {formData.offerings.map((offering, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={offering}
                        onChange={(e) => updateOffering(index, e.target.value)}
                        placeholder={`Offering #${index + 1} (e.g., flowers, incense, silence)`}
                        className="flex-1 bg-black/20 border-amber-400/20 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/30 text-white placeholder:text-white/30 transition-all"
                      />
                      {formData.offerings.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeOffering(index)}
                          className="bg-black/20 border-red-400/20 hover:bg-red-500/20 hover:border-red-500/50 text-white"
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
                    className="w-full bg-black/20 border-amber-500/20 hover:bg-amber-500/10 text-amber-500 hover:text-amber-400 mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Offering
                  </Button>
                </div>

                <Hexagon className="absolute -bottom-3 -left-3 w-6 h-6 fill-black" style={{ color: '#FFD700' }} />
                <Hexagon className="absolute -bottom-3 -right-3 w-6 h-6 fill-black" style={{ color: '#FFD700' }} />
              </div>
            </motion.div>

            {/* NEW: Goal Tasks Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.22 }}
              className="relative group/quote"
            >
              <div
                className="relative p-6 rounded-lg border backdrop-blur-md transition-all duration-300 transform hover:scale-[1.01]"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderColor: 'rgba(255, 215, 0, 0.19)'
                }}
              >
                <Hexagon className="absolute -top-3 -left-3 w-6 h-6 fill-black" style={{ color: '#FFD700' }} />
                <Hexagon className="absolute -top-3 -right-3 w-6 h-6 fill-black" style={{ color: '#FFD700' }} />

                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg md:text-xl font-bold uppercase tracking-wide" style={{ color: '#FFD700' }}>
                      Key Milestones
                    </h3>
                    <p className="text-xs text-white/60">Define tasks to achieve your goal</p>
                  </div>

                  {formData.tasks.length === 0 && (
                    <div className="text-center p-4 border border-dashed border-white/10 rounded-lg bg-white/5">
                      <p className="text-sm text-white/50 italic mb-2">No tasks defined yet</p>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={addTask}
                        className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Task
                      </Button>
                    </div>
                  )}

                  {formData.tasks.map((task, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-2">
                        <Input
                          value={task.description}
                          onChange={(e) => updateTask(index, 'description', e.target.value)}
                          placeholder={`Task #${index + 1} (e.g., Read Chapter 1)`}
                          className="bg-black/20 border-amber-400/20 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/30 text-white placeholder:text-white/30 transition-all"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/50">Deadline:</span>
                          <Input
                            type="date"
                            value={task.deadline}
                            max={formData.endDate}
                            onChange={(e) => updateTask(index, 'deadline', e.target.value)}
                            className="bg-black/20 border-amber-400/20 text-white h-8 text-xs w-auto min-w-[150px]"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeTask(index)}
                        className="bg-black/20 border-red-400/20 hover:bg-red-500/20 hover:border-red-500/50 text-white mt-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {formData.tasks.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addTask}
                      className="w-full bg-black/20 border-amber-500/20 hover:bg-amber-500/10 text-amber-500 hover:text-amber-400 mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Milestone Task
                    </Button>
                  )}
                </div>

                <Hexagon className="absolute -bottom-3 -left-3 w-6 h-6 fill-black" style={{ color: '#FFD700' }} />
                <Hexagon className="absolute -bottom-3 -right-3 w-6 h-6 fill-black" style={{ color: '#FFD700' }} />
              </div>
            </motion.div>

            {/* Practice Duration Card - WITH SLIDERS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="relative group/quote"
            >
              <div
                className="relative p-6 rounded-lg border backdrop-blur-md transition-all duration-300 transform hover:scale-[1.01]"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderColor: 'rgba(255, 215, 0, 0.19)'
                }}
              >
                <Hexagon className="absolute -top-3 -left-3 w-6 h-6 fill-black" style={{ color: '#FFD700' }} />
                <Hexagon className="absolute -top-3 -right-3 w-6 h-6 fill-black" style={{ color: '#FFD700' }} />

                <div className="space-y-6">
                  <div className="text-center mb-4">
                    <h3 className="text-lg md:text-xl font-bold uppercase tracking-wide" style={{ color: '#FFD700' }}>
                      Practice Duration
                    </h3>
                    <p className="text-xs text-white/60">Configure your sacred journey timeline</p>
                  </div>

                  {/* Duration Slider */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label style={{ color: '#FFD700', fontFamily: '"Chakra Petch", sans-serif' }} className="text-sm font-medium flex items-center gap-2">
                        <Flame className="w-4 h-4" />
                        Duration
                      </Label>
                      <div className="flex items-center gap-2">
                        <motion.span
                          key={formData.durationUnit === 'days' ? formData.durationDays : formData.durationMinutes}
                          initial={{ scale: 1.3, color: "#FFD700" }}
                          animate={{ scale: 1, color: "#FFFFFF" }}
                          className="text-2xl font-bold"
                          style={{ fontFamily: '"Chakra Petch", sans-serif' }}
                        >
                          {formData.durationUnit === 'days' ? formData.durationDays : formData.durationMinutes}
                        </motion.span>
                        <span className="text-sm text-white/60">{formData.durationUnit === 'days' ? 'days' : 'minutes'}</span>
                      </div>
                    </div>
                    
                    {/* Toggle between days and minutes */}
                    <div className="flex justify-center gap-2">
                      <Button
                        type="button"
                        variant={formData.durationUnit === 'days' ? 'default' : 'outline'}
                        onClick={() => setFormData(prev => ({ ...prev, durationUnit: 'days' }))}
                        className={`px-4 py-2 text-sm ${formData.durationUnit === 'days' 
                          ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                          : 'bg-black/20 border-amber-500/20 text-amber-500 hover:bg-amber-500/10'}`}
                      >
                        Days
                      </Button>
                      <Button
                        type="button"
                        variant={formData.durationUnit === 'minutes' ? 'default' : 'outline'}
                        onClick={() => setFormData(prev => ({ ...prev, durationUnit: 'minutes' }))}
                        className={`px-4 py-2 text-sm ${formData.durationUnit === 'minutes' 
                          ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                          : 'bg-black/20 border-amber-500/20 text-amber-500 hover:bg-amber-500/10'}`}
                      >
                        Minutes
                      </Button>
                    </div>

                    {/* Interactive Slider */}
                    <div className="relative">
                      <Slider
                        value={[formData.durationUnit === 'days' ? formData.durationDays : formData.durationMinutes]}
                        onValueChange={(value) => {
                          const newValue = value[0];
                          if (formData.durationUnit === 'days') {
                            const endDate = new Date(formData.startDate);
                            endDate.setDate(endDate.getDate() + newValue);
                            setFormData(prev => ({
                              ...prev,
                              durationDays: newValue,
                              endDate: endDate.toISOString().split('T')[0]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              durationMinutes: newValue
                            }));
                          }
                        }}
                        min={formData.durationUnit === 'days' ? 1 : 1}
                        max={formData.durationUnit === 'days' ? 365 : 1440} // Max 1440 minutes (24 hours)
                        step={1}
                        className="w-full"
                      />
                      {/* Preset markers */}
                      <div className="flex justify-between mt-2 text-xs" style={{ color: "rgba(255,255,255,0.4)", fontFamily: '"Chakra Petch", sans-serif' }}>
                        {formData.durationUnit === 'days' ? (
                          <>
                            <span>1d</span>
                            <span>40d</span>
                            <span>90d</span>
                            <span>180d</span>
                            <span>365d</span>
                          </>
                        ) : (
                          <>
                            <span>1m</span>
                            <span>5m</span>
                            <span>15m</span>
                            <span>30m</span>
                            <span>60m</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Duration Preset Badge */}
                    <motion.div
                      key={formData.durationUnit === 'days' ? getDurationPreset(formData.durationDays) : `Minutes_${formData.durationMinutes}`}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-400/30"
                    >
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-bold" style={{ color: '#FFD700', fontFamily: '"Chakra Petch", sans-serif' }}>
                        {formData.durationUnit === 'days' 
                          ? getDurationPreset(formData.durationDays) 
                          : getMinutesPreset(formData.durationMinutes)}
                      </span>
                    </motion.div>
                  </div>

                  {/* Start Date */}
                  <div className="space-y-2">
                    <Label htmlFor="startDate" style={{ color: '#FFD700', fontFamily: '"Chakra Petch", sans-serif' }} className="text-sm font-medium">
                      Start Date
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => {
                        const startDate = e.target.value;
                        if (formData.durationUnit === 'days') {
                          const endDate = new Date(startDate);
                          endDate.setDate(endDate.getDate() + formData.durationDays);
                          setFormData(prev => ({
                            ...prev,
                            startDate,
                            endDate: endDate.toISOString().split('T')[0]
                          }));
                        } else {
                          // For minutes, we keep the same start date
                          setFormData(prev => ({
                            ...prev,
                            startDate
                          }));
                        }
                      }}
                      className="bg-black/20 border-amber-400/20 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/30 text-white color-scheme-dark transition-all"
                    />
                  </div>

                  {/* End Date Display */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-400/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)", fontFamily: '"Chakra Petch", sans-serif' }}>
                        {formData.durationUnit === 'days' ? 'End Date:' : 'Duration:'}
                      </span>
                      <span className="text-lg font-bold" style={{ color: '#FFD700', fontFamily: '"Chakra Petch", sans-serif' }}>
                        {formData.durationUnit === 'days' 
                          ? new Date(formData.endDate).toLocaleDateString()
                          : `${formData.durationMinutes} minute${formData.durationMinutes > 1 ? 's' : ''}`}
                      </span>
                    </div>
                  </div>
                </div>

                <Hexagon className="absolute -bottom-3 -left-3 w-6 h-6 fill-black" style={{ color: '#FFD700' }} />
                <Hexagon className="absolute -bottom-3 -right-3 w-6 h-6 fill-black" style={{ color: '#FFD700' }} />
              </div>
            </motion.div>
          </div>

          {/* Draft Name and Description */}
          {onSaveAsDraft && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="pt-6 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="draftName" style={{ color: '#FFFFFF', fontFamily: '"Chakra Petch", sans-serif' }} className="text-sm font-medium">
                    Draft Name *
                  </Label>
                  <Input
                    id="draftName"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    placeholder="Give your draft a name"
                    className="bg-black/20 border-blue-400/20 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/30 text-white placeholder:text-white/30 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="draftDescription" style={{ color: '#FFFFFF', fontFamily: '"Chakra Petch", sans-serif' }} className="text-sm font-medium">
                    Description
                  </Label>
                  <Input
                    id="draftDescription"
                    value={draftDescription}
                    onChange={(e) => setDraftDescription(e.target.value)}
                    placeholder="Brief description of your practice"
                    className="bg-black/20 border-blue-400/20 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/30 text-white placeholder:text-white/30 transition-all"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="pt-10 space-y-4"
          >
            <p className="text-sm uppercase tracking-widest animate-pulse text-center" style={{ color: '#FFD700' }}>
              Ready to manifest your spiritual intentions?
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 border-amber-400/30 hover:bg-red-500/10 hover:border-red-400/50 text-white bg-black/20 transition-all"
              >
                Cancel
              </Button>
              
              {onSaveAsDraft && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (onSaveAsDraft && draftName.trim() !== "") {
                      onSaveAsDraft({
                        ...formData,
                        name: draftName,
                        description: draftDescription
                      } as any);
                    }
                  }}
                  disabled={draftName.trim() === ""}
                  className="flex-1 border-blue-400/30 hover:bg-blue-500/10 hover:border-blue-400/50 text-white bg-black/20 transition-all"
                >
                  Save as Draft
                </Button>
              )}
              
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={!validateForm()}
                size="lg"
                className="flex-1 relative overflow-hidden group/btn px-10 py-6 rounded-none clip-path-polygon disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #DC143C 0%, #8B0000 100%)',
                  border: '1px solid rgba(255, 215, 0, 0.31)'
                }}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                <div className="flex items-center gap-3 relative z-10">
                  <Zap className="w-5 h-5 fill-current" />
                  <span className="text-lg font-bold tracking-wider">CREATE_SADHANA</span>
                  <Sparkles className="w-5 h-5 fill-current" />
                </div>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SadhanaSetupForm;