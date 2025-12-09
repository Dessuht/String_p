import { motion } from "framer-motion";
import { useState } from "react";
import { Star, Video, MapPin, Clock, Heart, HeartHandshake, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { KnotStatus, calculateTimeRemaining } from "@/lib/mockData";

interface ConnectionKnotProps {
  messageCount: number;
  user1MessageCount: number;
  user2MessageCount: number;
  knotStatus: KnotStatus;
  chatExpiresAt: Date;
  onGradeUnlock: () => void;
  onTieKnot: () => void;
  onSuggestDate: () => void;
  canRequestKnot: boolean;
  knotRequestedBy?: string;
  currentUserId: string;
}

export function ConnectionKnot({ 
  messageCount, 
  user1MessageCount,
  user2MessageCount,
  knotStatus,
  chatExpiresAt,
  onGradeUnlock, 
  onTieKnot,
  onSuggestDate,
  canRequestKnot,
  knotRequestedBy,
  currentUserId
}: ConnectionKnotProps) {
  const [showKnotConfirm, setShowKnotConfirm] = useState(false);
  const threshold = 5;
  const myMessages = currentUserId === "me" ? user1MessageCount : user2MessageCount;
  const theirMessages = currentUserId === "me" ? user2MessageCount : user1MessageCount;
  
  const myProgress = Math.min(myMessages / threshold, 1);
  const theirProgress = Math.min(theirMessages / threshold, 1);
  const overallProgress = Math.min((myProgress + theirProgress) / 2, 1);
  
  const isUnlocked = myMessages >= threshold && theirMessages >= threshold;
  const isKnotted = knotStatus === "knotted" || knotStatus === "permanently_knotted";
  
  const timeRemaining = calculateTimeRemaining(chatExpiresAt);
  const isUrgent = timeRemaining.hours < 12 && !timeRemaining.expired;

  const handleKnotClick = () => {
    if (knotRequestedBy && knotRequestedBy !== currentUserId) {
      onTieKnot();
    } else {
      setShowKnotConfirm(true);
    }
  };

  const confirmKnot = () => {
    setShowKnotConfirm(false);
    onTieKnot();
  };

  return (
    <>
      <div className="w-full bg-card/50 backdrop-blur-sm border-b p-2 flex flex-col items-center justify-center gap-2 overflow-hidden">
        
        {!isKnotted && !timeRemaining.expired && (
          <div className={`flex items-center gap-1.5 text-xs ${isUrgent ? 'text-destructive' : 'text-muted-foreground'}`}>
            <Clock className="w-3 h-3" />
            <span>
              {timeRemaining.hours}h {timeRemaining.minutes}m remaining to tie the knot
            </span>
            {isUrgent && <AlertTriangle className="w-3 h-3" />}
          </div>
        )}
        
        {timeRemaining.expired && !isKnotted && (
          <div className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertTriangle className="w-3 h-3" />
            <span>Time expired - Chat will be archived</span>
          </div>
        )}

        <div className="relative w-64 h-12 flex items-center justify-center">
          <div className="absolute w-full h-[1px] bg-border/50" />

          <motion.div
            className="absolute left-1/2 h-1 bg-primary origin-right rounded-full shadow-[0_0_10px_hsl(var(--primary))]"
            style={{ width: "60px", top: "50%", marginTop: "-2px" }}
            initial={{ x: -100 }}
            animate={{ x: -10 + (myProgress * 10) }}
          />

          <motion.div
            className="absolute right-1/2 h-1 bg-primary origin-left rounded-full shadow-[0_0_10px_hsl(var(--primary))]"
            style={{ width: "60px", top: "50%", marginTop: "-2px" }}
            initial={{ x: 100 }}
            animate={{ x: 10 - (theirProgress * 10) }}
          />

          <div className="relative z-10 flex items-center justify-center w-12 h-12">
            {isKnotted ? (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <HeartHandshake className="w-8 h-8 text-primary" />
              </motion.div>
            ) : isUnlocked ? (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                  <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                </svg>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="text-xs font-medium text-muted-foreground bg-background/80 px-2 py-0.5 rounded-full border">
                  {myMessages}/{threshold}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">you</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 h-8">
          {isKnotted ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2"
            >
              <Badge variant="secondary" className="gap-1 text-xs">
                <HeartHandshake className="w-3 h-3" />
                Knotted
              </Badge>
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5" onClick={onSuggestDate} data-testid="button-suggest-date">
                <MapPin className="w-3 h-3" />
                Suggest Date
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5 border-primary/20 bg-primary/5 text-primary" onClick={onGradeUnlock} data-testid="button-grade-connection">
                <Star className="w-3 h-3 fill-current" />
                Grade
              </Button>
            </motion.div>
          ) : isUnlocked ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2"
            >
              {knotRequestedBy ? (
                knotRequestedBy === currentUserId ? (
                  <Badge variant="secondary" className="text-xs">Waiting for response...</Badge>
                ) : (
                  <Button 
                    size="sm" 
                    className="h-7 text-xs gap-1.5 bg-primary" 
                    onClick={handleKnotClick}
                    data-testid="button-accept-knot"
                  >
                    <Heart className="w-3 h-3 fill-current" />
                    Accept Knot Request
                  </Button>
                )
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 text-xs gap-1.5 border-primary/20 bg-primary/5 text-primary" 
                  onClick={handleKnotClick}
                  disabled={!canRequestKnot}
                  data-testid="button-tie-knot"
                >
                  <Heart className="w-3 h-3" />
                  Tie the Knot
                </Button>
              )}
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5" onClick={onGradeUnlock} data-testid="button-grade-connection">
                <Star className="w-3 h-3 fill-current" />
                Grade
              </Button>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-0.5">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                Exchange {threshold} messages each to tie the knot
              </p>
              <p className="text-[9px] text-muted-foreground">
                You: {myMessages}/{threshold} | Them: {theirMessages}/{threshold}
              </p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showKnotConfirm} onOpenChange={setShowKnotConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Tie the Knot?
            </DialogTitle>
            <DialogDescription>
              By tying the knot, you're committing to this connection. This will:
              <ul className="list-disc list-inside mt-2 space-y-1 text-left">
                <li>Make this chat permanent (no expiry timer)</li>
                <li>Unlock all features including date suggestions</li>
                <li>Grant you both +0.1 Star Rating and 50 FP on mutual acceptance</li>
              </ul>
              <p className="mt-3 text-sm font-medium text-destructive">
                Note: Refusing after the other person accepts will result in a -0.2 Star Rating penalty.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowKnotConfirm(false)}>
              Not Yet
            </Button>
            <Button onClick={confirmKnot} data-testid="button-confirm-knot">
              <Heart className="w-4 h-4 mr-2" />
              Tie the Knot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
