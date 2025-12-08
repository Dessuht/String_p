import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Star, Video, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ConnectionKnotProps {
  messageCount: number;
  onGradeUnlock: () => void;
}

export function ConnectionKnot({ messageCount, onGradeUnlock }: ConnectionKnotProps) {
  const threshold = 5;
  const progress = Math.min(messageCount / threshold, 1);
  const isUnlocked = messageCount >= threshold;

  // Animation variants for the string ends
  const leftStringVariants = {
    initial: { x: -50, opacity: 0 },
    animate: (custom: number) => ({
      x: -50 + (custom * 50), // Move from -50 to 0 based on progress
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    })
  };

  const rightStringVariants = {
    initial: { x: 50, opacity: 0 },
    animate: (custom: number) => ({
      x: 50 - (custom * 50), // Move from 50 to 0 based on progress
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    })
  };

  return (
    <div className="w-full bg-card/50 backdrop-blur-sm border-b p-2 flex flex-col items-center justify-center gap-2 overflow-hidden">
      
      {/* The String Visual */}
      <div className="relative w-64 h-12 flex items-center justify-center">
        {/* Background Guide Line (faint) */}
        <div className="absolute w-full h-[1px] bg-border/50" />

        {/* Left String Segment */}
        <motion.div
          className="absolute left-1/2 h-1 bg-primary origin-right rounded-full shadow-[0_0_10px_hsl(var(--primary))]"
          style={{ width: "60px", top: "50%", marginTop: "-2px" }}
          initial={{ x: -100 }}
          animate={{ x: -10 + (progress * 10) }} // Moves closer to center
        />

        {/* Right String Segment */}
        <motion.div
          className="absolute right-1/2 h-1 bg-primary origin-left rounded-full shadow-[0_0_10px_hsl(var(--primary))]"
          style={{ width: "60px", top: "50%", marginTop: "-2px" }}
          initial={{ x: 100 }}
          animate={{ x: 10 - (progress * 10) }} // Moves closer to center
        />

        {/* The Knot (Center) */}
        <div className="relative z-10 flex items-center justify-center w-12 h-12">
           {isUnlocked ? (
             <motion.div
               initial={{ scale: 0, rotate: -180 }}
               animate={{ scale: 1, rotate: 0 }}
               transition={{ type: "spring", stiffness: 200, damping: 15 }}
             >
                {/* Stylized Knot SVG */}
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                  <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                </svg>
             </motion.div>
           ) : (
             <div className="text-xs font-medium text-muted-foreground bg-background/80 px-2 py-0.5 rounded-full border">
               {messageCount}/{threshold}
             </div>
           )}
        </div>
      </div>

      {/* Unlocked Features / Status Text */}
      <div className="flex items-center gap-4 h-8">
        {isUnlocked ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2"
          >
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5 border-primary/20 bg-primary/5 text-primary" onClick={onGradeUnlock}>
              <Star className="w-3 h-3 fill-current" />
              Grade Connection
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5">
              <Video className="w-3 h-3" />
              Call
            </Button>
          </motion.div>
        ) : (
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
            Tie the knot to unlock features
          </p>
        )}
      </div>
    </div>
  );
}
