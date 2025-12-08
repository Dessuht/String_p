import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Crown, Eye, MessageSquare, Video } from "lucide-react";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#1a1a1a] border-primary/20 p-0 overflow-hidden gap-0">
        <div className="h-32 bg-gradient-to-b from-primary/20 to-background flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
            <Crown className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-center">Upgrade to Premium</DialogTitle>
            <DialogDescription className="text-center">
              Cut the strings that hold you back. Get full access.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <FeatureRow icon={MessageSquare} text="See all messages (even unreplied)" />
            <FeatureRow icon={Video} text="Video & Voice calling unlocked" />
            <FeatureRow icon={Eye} text="View user's last 3 grades" />
            <FeatureRow icon={Crown} text="Unlimited Likes" />
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90 rounded-full h-12 font-semibold text-lg mt-4">
            Get Premium - $9.99/mo
          </Button>
          
          <button onClick={onClose} className="w-full text-sm text-muted-foreground hover:text-foreground">
            Maybe later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FeatureRow({ icon: Icon, text }: { icon: any, text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}
