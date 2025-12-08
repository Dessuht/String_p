import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { ChevronRight, ArrowRight, MessageSquare } from "lucide-react";

export default function OnboardingSurvey() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);

  const steps = [
    {
      id: "demographics",
      title: "First, a quick check.",
      subtitle: "We're focusing on building a community for 18-30 year olds right now.",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>How old are you?</Label>
            <Input type="number" placeholder="24" className="bg-white/5 border-white/10" />
          </div>
        </div>
      )
    },
    {
      id: "competitors",
      title: "The Competition",
      subtitle: "Which apps have you tried before?",
      component: (
        <div className="grid grid-cols-2 gap-4">
          {["Tinder", "Hinge", "Bumble", "Raya", "Grindr", "OkCupid"].map((app) => (
            <div key={app} className="flex items-center space-x-2 bg-white/5 p-3 rounded-lg">
              <Checkbox id={app} />
              <label htmlFor={app} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {app}
              </label>
            </div>
          ))}
        </div>
      )
    },
    {
      id: "frustrations",
      title: "Vent to us.",
      subtitle: "What is your biggest frustration with those apps?",
      component: (
        <RadioGroup defaultValue="ghosting" className="space-y-3">
          {[
            { value: "ghosting", label: "Ghosting / Flaky people" },
            { value: "catfish", label: "Catfishing / Fake profiles" },
            { value: "boring", label: "Boring conversations" },
            { value: "superficial", label: "Too superficial" },
            { value: "paywalls", label: "Constant paywalls" },
          ].map((item) => (
            <div key={item.value} className="flex items-center space-x-2 bg-white/5 p-4 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
              <RadioGroupItem value={item.value} id={item.value} className="border-primary text-primary" />
              <Label htmlFor={item.value} className="flex-1 cursor-pointer">{item.label}</Label>
            </div>
          ))}
        </RadioGroup>
      )
    },
    {
      id: "success",
      title: "Success Stories",
      subtitle: "Have you ever had a relationship last >1 year from an app?",
      component: (
        <RadioGroup defaultValue="no" className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center space-y-2 bg-white/5 p-6 rounded-xl border-2 border-transparent hover:border-primary cursor-pointer">
            <RadioGroupItem value="yes" id="yes" className="sr-only" />
            <Label htmlFor="yes" className="text-xl font-serif cursor-pointer">Yes</Label>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2 bg-white/5 p-6 rounded-xl border-2 border-transparent hover:border-primary cursor-pointer">
            <RadioGroupItem value="no" id="no" className="sr-only" />
            <Label htmlFor="no" className="text-xl font-serif cursor-pointer">No</Label>
          </div>
        </RadioGroup>
      )
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setLocation("/swipe");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[-20%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-serif text-primary mb-2">Help Us Build String</h1>
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-300 ${
                  i <= step ? "w-8 bg-primary" : "w-2 bg-white/20"
                }`} 
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-card/50 backdrop-blur-xl border-white/10 p-6 md:p-8 min-h-[400px] flex flex-col">
              <div className="mb-8">
                <h2 className="text-3xl font-serif mb-2">{steps[step].title}</h2>
                <p className="text-muted-foreground">{steps[step].subtitle}</p>
              </div>

              <div className="flex-1">
                {steps[step].component}
              </div>

              <div className="mt-8 flex justify-end">
                <Button 
                  onClick={handleNext}
                  size="lg"
                  className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground group"
                >
                  {step === steps.length - 1 ? "Start Matching" : "Next"}
                  <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
