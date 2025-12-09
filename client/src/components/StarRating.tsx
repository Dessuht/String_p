import { useState } from "react";
import { Star, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  totalRatings?: number;
  size?: "sm" | "md" | "lg";
  showExplanation?: boolean;
  className?: string;
}

export function StarRating({ 
  rating, 
  totalRatings = 0,
  size = "md", 
  showExplanation = true,
  className 
}: StarRatingProps) {
  const [showModal, setShowModal] = useState(false);
  
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };
  
  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl"
  };

  const displayRating = rating > 0 ? rating.toFixed(1) : "New";
  
  return (
    <>
      <button
        onClick={() => showExplanation && setShowModal(true)}
        className={cn(
          "flex flex-col items-center gap-1 bg-card/80 backdrop-blur-sm p-3 rounded-2xl border shadow-sm",
          showExplanation && "hover-elevate cursor-pointer",
          !showExplanation && "cursor-default",
          className
        )}
        disabled={!showExplanation}
        data-testid="button-star-rating"
      >
        <div className="flex items-center gap-1 text-yellow-500">
          <Star className={cn(sizeClasses[size], "fill-current")} />
          {showExplanation && <Info className="w-3 h-3 text-muted-foreground" />}
        </div>
        <span className={cn("font-bold", textSizeClasses[size])} data-testid="text-star-rating-value">
          {displayRating}
        </span>
        {totalRatings > 0 && (
          <span className="text-xs text-muted-foreground" data-testid="text-rating-count">
            {totalRatings} {totalRatings === 1 ? "rating" : "ratings"}
          </span>
        )}
      </button>

      {showExplanation && (
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-md" data-testid="dialog-star-explanation">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                Star Rating System
              </DialogTitle>
              <DialogDescription className="sr-only">
                Learn how star ratings work
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">How It Works</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Star ratings reflect reliability and positive experiences in the String community. 
                  After exchanging messages, connections can rate each other to build trust and accountability.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Calculation</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Rating = (Positive Ratings ÷ Total Ratings) × 5
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Example: 8 positive out of 10 total = (8/10) × 5 = 4.0 stars
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Rating Criteria</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">👍</span>
                    <div>
                      <span className="font-medium text-foreground">Positive:</span> Respectful, engaging, 
                      showed up for plans, good communication
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">👎</span>
                    <div>
                      <span className="font-medium text-foreground">Negative:</span> Flaky, offensive, 
                      ghosting, or poor behavior
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-muted/50 p-3 rounded-md">
                <h4 className="font-semibold mb-1 text-xs uppercase tracking-wider">Why It Matters</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Higher ratings increase visibility in Radar Scans and help build a more reliable, 
                  respectful community. Each positive rating you receive also earns you 5 Fidelity Points!
                </p>
              </div>

              <Button 
                onClick={() => setShowModal(false)} 
                className="w-full"
                data-testid="button-close-explanation"
              >
                Got It
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
