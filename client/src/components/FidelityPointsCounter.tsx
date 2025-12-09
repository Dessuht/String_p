import { Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@/lib/mockData";
import { MOCK_USERS } from "@/lib/mockData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FidelityPointsCounterProps {
  variant?: "default" | "compact";
  showLabel?: boolean;
}

export function FidelityPointsCounter({ 
  variant = "default",
  showLabel = true 
}: FidelityPointsCounterProps) {
  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/users", "me"],
    enabled: false,
    initialData: MOCK_USERS.find(u => u.id === "me"),
  });

  const fidelityPoints = currentUser?.fidelityPoints ?? 0;

  if (variant === "compact") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 hover:border-purple-500/50"
            data-testid="button-fp-counter"
          >
            <Gem className="w-4 h-4 text-purple-400" />
            <span className="font-bold text-purple-400">{fidelityPoints}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gem className="w-6 h-6 text-purple-400" />
              Fidelity Points
            </DialogTitle>
            <DialogDescription className="space-y-4 pt-4">
              <div className="text-center py-6">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-8 py-4 rounded-2xl border border-purple-500/30">
                  <Gem className="w-8 h-8 text-purple-400" />
                  <span className="text-4xl font-bold text-purple-400">{fidelityPoints}</span>
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-left">
                <h4 className="font-semibold text-foreground">What are Fidelity Points?</h4>
                <p className="text-muted-foreground">
                  Fidelity Points (FP) are the currency of trust in String. They reward positive behavior and enable premium features.
                </p>
                
                <h4 className="font-semibold text-foreground pt-2">How to earn FP:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">•</span>
                    <span><strong className="text-foreground">+5 FP</strong> for rating a connection positively</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">•</span>
                    <span><strong className="text-foreground">+10 FP</strong> when someone rates you positively</span>
                  </li>
                </ul>
                
                <h4 className="font-semibold text-foreground pt-2">How to spend FP:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">•</span>
                    <span><strong className="text-foreground">50 FP</strong> for a Radar Scan (1hr priority boost)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">•</span>
                    <span><strong className="text-foreground">20 FP</strong> to refill daily Tugs</span>
                  </li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Badge 
          variant="outline" 
          className="gap-2 px-3 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 hover:border-purple-500/50 cursor-pointer"
          data-testid="badge-fp-counter"
        >
          <Gem className="w-4 h-4 text-purple-400" />
          <span className="font-bold text-purple-400">{fidelityPoints}</span>
          {showLabel && <span className="text-muted-foreground text-xs">FP</span>}
        </Badge>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gem className="w-6 h-6 text-purple-400" />
            Fidelity Points
          </DialogTitle>
          <DialogDescription className="space-y-4 pt-4">
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-8 py-4 rounded-2xl border border-purple-500/30">
                <Gem className="w-8 h-8 text-purple-400" />
                <span className="text-4xl font-bold text-purple-400">{fidelityPoints}</span>
              </div>
            </div>
            
            <div className="space-y-3 text-sm text-left">
              <h4 className="font-semibold text-foreground">What are Fidelity Points?</h4>
              <p className="text-muted-foreground">
                Fidelity Points (FP) are the currency of trust in String. They reward positive behavior and enable premium features.
              </p>
              
              <h4 className="font-semibold text-foreground pt-2">How to earn FP:</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span><strong className="text-foreground">+5 FP</strong> for rating a connection positively</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span><strong className="text-foreground">+10 FP</strong> when someone rates you positively</span>
                </li>
              </ul>
              
              <h4 className="font-semibold text-foreground pt-2">How to spend FP:</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span><strong className="text-foreground">50 FP</strong> for a Radar Scan (1hr priority boost)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span><strong className="text-foreground">20 FP</strong> to refill daily Tugs</span>
                </li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
