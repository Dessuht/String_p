import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface GradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerName: string;
  onGrade: (grade: number) => void;
}

export function GradingModal({ isOpen, onClose, partnerName, onGrade }: GradingModalProps) {
  const [selectedGrade, setSelectedGrade] = useState<number>(0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-center">Grade Your Connection</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            You've exchanged 5 messages with {partnerName}. How is the conversation going?
            <br />
            <span className="text-xs italic mt-2 block">This helps us ensure high quality connections.</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center gap-2 py-8">
          {[1, 2, 3, 4, 5].map((grade) => (
            <motion.button
              key={grade}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedGrade(grade)}
              className={`p-2 rounded-full transition-colors ${
                selectedGrade >= grade ? "text-primary" : "text-muted-foreground/30"
              }`}
            >
              <Star 
                className={`w-8 h-8 ${selectedGrade >= grade ? "fill-primary" : ""}`} 
              />
            </motion.button>
          ))}
        </div>

        <DialogFooter className="sm:justify-center">
          <Button 
            onClick={() => onGrade(selectedGrade)}
            disabled={selectedGrade === 0}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full h-12"
          >
            Submit Grade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
