import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Camera, Loader2, Plus, X, Mic, Heart, Briefcase, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  MOCK_USERS, 
  CORE_VALUES, 
  DEEP_DIVE_PROMPTS,
  RelationshipGoal,
  LifeStage,
  getRelationshipGoalLabel,
  getLifeStageLabel
} from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function EditProfile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const user = MOCK_USERS.find(u => u.id === "me");
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    age: user?.age?.toString() || "",
    bio: user?.bio || "",
    relationshipGoal: user?.relationshipGoal || "the_knot" as RelationshipGoal,
    investmentLevel: user?.investmentLevel || 3,
    coreValues: user?.coreValues || [],
    deepDivePrompts: user?.deepDivePrompts || [],
    lifeStage: user?.lifeStage || "building_career" as LifeStage,
  });

  const [showPromptSelector, setShowPromptSelector] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [promptAnswer, setPromptAnswer] = useState("");

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (user) {
        user.name = formData.name;
        user.age = Number(formData.age);
        user.bio = formData.bio;
        user.relationshipGoal = formData.relationshipGoal;
        user.investmentLevel = formData.investmentLevel;
        user.coreValues = formData.coreValues;
        user.deepDivePrompts = formData.deepDivePrompts;
        user.lifeStage = formData.lifeStage;
      }
      
      setIsLoading(false);
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
      setLocation("/profile");
    }, 1000);
  };

  const toggleValue = (value: string) => {
    const current = formData.coreValues;
    if (current.includes(value)) {
      setFormData({ ...formData, coreValues: current.filter(v => v !== value) });
    } else if (current.length < 5) {
      setFormData({ ...formData, coreValues: [...current, value] });
    } else {
      toast({
        title: "Maximum 5 values",
        description: "Remove a value before adding another.",
        variant: "destructive"
      });
    }
  };

  const addPrompt = () => {
    if (!selectedPrompt || !promptAnswer.trim()) return;
    
    const newPrompt = { prompt: selectedPrompt, answer: promptAnswer.trim() };
    setFormData({ 
      ...formData, 
      deepDivePrompts: [...formData.deepDivePrompts, newPrompt] 
    });
    setSelectedPrompt(null);
    setPromptAnswer("");
    setShowPromptSelector(false);
  };

  const removePrompt = (index: number) => {
    const updated = formData.deepDivePrompts.filter((_, i) => i !== index);
    setFormData({ ...formData, deepDivePrompts: updated });
  };

  const availablePrompts = DEEP_DIVE_PROMPTS.filter(
    p => !formData.deepDivePrompts.some(dp => dp.prompt === p)
  );

  const getInvestmentLabel = (level: number) => {
    switch(level) {
      case 1: return "Casual browser";
      case 2: return "Open to connection";
      case 3: return "Actively seeking";
      case 4: return "Very invested";
      case 5: return "All in";
      default: return "Actively seeking";
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center gap-3 p-4 border-b bg-white dark:bg-background sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/profile")} data-testid="button-back">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-serif font-semibold">Edit Profile</h1>
        <div className="flex-1" />
        <Button onClick={handleSave} disabled={isLoading} className="rounded-full" data-testid="button-save">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
        </Button>
      </header>

      <div className="p-6 space-y-8 max-w-md mx-auto w-full pb-20">
        <div className="flex flex-col items-center gap-4">
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-muted">
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>
          <span className="text-sm text-primary font-medium cursor-pointer">Change Photo</span>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              data-testid="input-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input 
              id="age" 
              type="number"
              value={formData.age} 
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              data-testid="input-age"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              value={formData.bio} 
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              className="min-h-[120px] resize-none"
              placeholder="Tell your story..."
              data-testid="input-bio"
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.bio.length}/500
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              Relationship Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select 
              value={formData.relationshipGoal} 
              onValueChange={(v) => setFormData({...formData, relationshipGoal: v as RelationshipGoal})}
            >
              <SelectTrigger data-testid="select-relationship-goal">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="the_knot">The Knot - Looking for something serious</SelectItem>
                <SelectItem value="red_thread">Red Thread - Open to seeing where it goes</SelectItem>
                <SelectItem value="casual_string">Casual String - Just here to meet people</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {formData.relationshipGoal === "the_knot" && "You're looking for a committed relationship"}
              {formData.relationshipGoal === "red_thread" && "Open to connections that could develop naturally"}
              {formData.relationshipGoal === "casual_string" && "Keeping things light and casual"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              Life Stage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.lifeStage} 
              onValueChange={(v) => setFormData({...formData, lifeStage: v as LifeStage})}
            >
              <SelectTrigger data-testid="select-life-stage">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="building_career">Building Career</SelectItem>
                <SelectItem value="established_career">Established Career</SelectItem>
                <SelectItem value="transitioning">Transitioning</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Investment Level
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">How invested are you?</span>
                <span className="font-medium">{getInvestmentLabel(formData.investmentLevel)}</span>
              </div>
              <Slider 
                value={[formData.investmentLevel]}
                onValueChange={(v) => setFormData({...formData, investmentLevel: v[0]})}
                min={1}
                max={5}
                step={1}
                className="py-2"
                data-testid="slider-investment"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Casual</span>
                <span>All in</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Core Values</CardTitle>
            <p className="text-xs text-muted-foreground">Select up to 5 values that matter most to you</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {CORE_VALUES.map((value) => {
                const isSelected = formData.coreValues.includes(value);
                return (
                  <Badge
                    key={value}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-all",
                      isSelected && "bg-primary"
                    )}
                    onClick={() => toggleValue(value)}
                    data-testid={`badge-value-${value.toLowerCase()}`}
                  >
                    {value}
                  </Badge>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {formData.coreValues.length}/5 selected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between gap-2">
              <span>Deep Dive Prompts</span>
              {formData.deepDivePrompts.length < 3 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowPromptSelector(true)}
                  data-testid="button-add-prompt"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              )}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Answer prompts to help others get to know you (max 3)
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.deepDivePrompts.map((dp, index) => (
              <div key={index} className="relative bg-muted/50 rounded-lg p-3 pr-10">
                <p className="text-xs font-medium text-muted-foreground italic">"{dp.prompt}"</p>
                <p className="text-sm mt-1">{dp.answer}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 w-6 h-6"
                  onClick={() => removePrompt(index)}
                  data-testid={`button-remove-prompt-${index}`}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}

            {formData.deepDivePrompts.length === 0 && !showPromptSelector && (
              <div className="text-center py-6 text-muted-foreground">
                <p className="text-sm">No prompts yet</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setShowPromptSelector(true)}
                  data-testid="button-add-first-prompt"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add your first prompt
                </Button>
              </div>
            )}

            {showPromptSelector && (
              <div className="space-y-3 border rounded-lg p-3">
                <Select value={selectedPrompt || ""} onValueChange={setSelectedPrompt}>
                  <SelectTrigger data-testid="select-prompt">
                    <SelectValue placeholder="Choose a prompt..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePrompts.map((prompt) => (
                      <SelectItem key={prompt} value={prompt}>
                        {prompt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedPrompt && (
                  <>
                    <Textarea
                      value={promptAnswer}
                      onChange={(e) => setPromptAnswer(e.target.value)}
                      placeholder="Your answer..."
                      className="min-h-[80px] resize-none"
                      data-testid="input-prompt-answer"
                    />
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setShowPromptSelector(false);
                          setSelectedPrompt(null);
                          setPromptAnswer("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={addPrompt}
                        disabled={!promptAnswer.trim()}
                        data-testid="button-save-prompt"
                      >
                        Save Prompt
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Mic className="w-4 h-4 text-primary" />
              Voice Prompt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full gap-2" data-testid="button-record-voice">
              <Mic className="w-4 h-4" />
              Record Voice Introduction
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              A 30-second audio clip helps you stand out
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
