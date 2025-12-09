import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, AlertCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface GradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerName: string;
  onSubmit: (isPositive: boolean, reason?: string) => void;
  isSubmitting?: boolean;
}

const NEGATIVE_REASONS = [
  { value: "flaky", label: "Flaky (didn't show up or cancelled)" },
  { value: "offensive", label: "Offensive behavior" },
  { value: "ghosting", label: "Ghosting / No response" },
  { value: "boring", label: "Boring conversation" },
  { value: "not_as_described", label: "Not as described in profile" },
  { value: "other", label: "Other" },
];

export function GradingModal({ isOpen, onClose, partnerName, onSubmit, isSubmitting = false }: GradingModalProps) {
  const [selectedRating, setSelectedRating] = useState<"positive" | "negative" | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>("");

  const handleSubmit = () => {
    if (selectedRating === "positive") {
      onSubmit(true);
    } else if (selectedRating === "negative" && selectedReason) {
      onSubmit(false, selectedReason);
    }
  };

  const canSubmit = selectedRating === "positive" || (selectedRating === "negative" && selectedReason);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-primary/20" data-testid="modal-grade-connection">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-center">Rate Your Connection</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            You've exchanged enough messages with {partnerName}. How was the experience?
            <br />
            <span className="text-xs italic mt-2 block">Your honest feedback helps maintain community quality.</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center gap-4 py-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedRating("positive");
              setSelectedReason("");
            }}
            className={`flex flex-col items-center gap-2 p-6 rounded-2xl border-2 transition-all ${
              selectedRating === "positive" 
                ? "border-green-500 bg-green-500/10" 
                : "border-border hover-elevate"
            }`}
            data-testid="button-rate-positive"
          >
            <ThumbsUp 
              className={`w-12 h-12 ${
                selectedRating === "positive" ? "text-green-500 fill-green-500" : "text-muted-foreground"
              }`} 
            />
            <span className="text-sm font-medium">Good</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedRating("negative")}
            className={`flex flex-col items-center gap-2 p-6 rounded-2xl border-2 transition-all ${
              selectedRating === "negative" 
                ? "border-red-500 bg-red-500/10" 
                : "border-border hover-elevate"
            }`}
            data-testid="button-rate-negative"
          >
            <ThumbsDown 
              className={`w-12 h-12 ${
                selectedRating === "negative" ? "text-red-500 fill-red-500" : "text-muted-foreground"
              }`} 
            />
            <span className="text-sm font-medium">Bad</span>
          </motion.button>
        </div>

        {selectedRating === "negative" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-500/10 p-3 rounded-md">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Please select a reason to help us improve the community</span>
            </div>
            
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
              {NEGATIVE_REASONS.map((reason) => (
                <div key={reason.value} className="flex items-center space-x-2" data-testid={`radio-reason-${reason.value}`}>
                  <RadioGroupItem value={reason.value} id={reason.value} />
                  <Label htmlFor={reason.value} className="text-sm cursor-pointer flex-1">
                    {reason.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </motion.div>
        )}

        <DialogFooter className="sm:justify-center gap-2">
          <Button 
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1"
            data-testid="button-cancel-rating"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            data-testid="button-submit-rating"
          >
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
