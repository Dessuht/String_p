import { useState } from "react";
import { Link, useLocation } from "wouter";
import { MOCK_MATCHES, MOCK_USERS, MOCK_MESSAGES } from "@/lib/mockData";
import { NavBar } from "@/components/NavBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Lock, Crown } from "lucide-react";
import { PremiumModal } from "@/components/PremiumModal";
import { GradingModal } from "@/components/GradingModal";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Messages() {
  const [, setLocation] = useLocation();
  const [showPremium, setShowPremium] = useState(false);
  const [showGrading, setShowGrading] = useState<string | null>(null);
  const { toast } = useToast();

  const getPartner = (matchId: string) => {
    const match = MOCK_MATCHES.find(m => m.id === matchId);
    if (!match) return null;
    const partnerId = match.users.find(u => u !== "me");
    return MOCK_USERS.find(u => u.id === partnerId);
  };

  const getMatchMessages = (matchId: string) => {
    // In a real app this would filter by matchId properly
    // For demo, we just return all messages for the first user
    return MOCK_MESSAGES.filter(m => m.senderId === "1" || m.receiverId === "1");
  };

  const ratingMutation = useMutation({
    mutationFn: async ({ isPositive, reason }: { isPositive: boolean; reason?: string }) => {
      const partner = getPartner(showGrading!);
      if (!partner) throw new Error("Partner not found");

      return await apiRequest("/api/ratings", {
        method: "POST",
        body: JSON.stringify({
          raterUserId: "me",
          ratedUserId: partner.id,
          isPositive,
          reason,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: (_, variables) => {
      toast({
        title: variables.isPositive ? "Positive rating submitted!" : "Feedback submitted",
        description: variables.isPositive 
          ? "You've earned 5 Fidelity Points for your honest feedback." 
          : "Thank you for helping us maintain community quality.",
      });
      setShowGrading(null);
    },
    onError: () => {
      toast({
        title: "Failed to submit rating",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleRatingSubmit = (isPositive: boolean, reason?: string) => {
    ratingMutation.mutate({ isPositive, reason });
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-6">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-serif text-primary">Strings</h1>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-muted-foreground"
          onClick={() => setShowPremium(true)}
        >
          <Crown className="w-4 h-4 mr-1 text-yellow-500" />
          Get Premium
        </Button>
      </header>

      {/* New Matches Row */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">New Connections</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {MOCK_MATCHES.map(match => {
            const partner = getPartner(match.id);
            if (!partner) return null;
            return (
              <div key={match.id} className="flex flex-col items-center space-y-2 min-w-[80px]">
                <div className="relative">
                  <Avatar className="w-16 h-16 border-2 border-primary p-0.5">
                    <AvatarImage src={partner.avatar} className="object-cover rounded-full" />
                    <AvatarFallback>{partner.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full border border-background">
                    New
                  </div>
                </div>
                <span className="text-sm font-medium">{partner.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Messages List */}
      <div className="space-y-4">
        {MOCK_MATCHES.map(match => {
          const partner = getPartner(match.id);
          if (!partner) return null;
          
          const lastMsg = getMatchMessages(match.id)[0];
          const isBlurred = lastMsg && !lastMsg.isRepliedTo && !lastMsg.isRead && match.users.includes("me"); // Simplified logic for demo

          return (
            <div 
              key={match.id}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
              onClick={() => {
                // If we're clicking the message row, go to chat
                 setLocation(`/chat/${partner.id}`);
              }}
            >
              <Avatar className="w-14 h-14">
                <AvatarImage src={partner.avatar} className="object-cover" />
                <AvatarFallback>{partner.name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-lg">{partner.name}</h3>
                  <span className="text-xs text-muted-foreground">2m ago</span>
                </div>
                
                <div className="relative">
                  <p className={`text-sm text-muted-foreground truncate ${isBlurred ? "blur-sm select-none" : ""}`}>
                    {lastMsg?.content || "Start the conversation..."}
                  </p>
                  
                  {isBlurred && (
                    <div className="absolute inset-0 flex items-center gap-2">
                      <Lock className="w-3 h-3 text-primary" />
                      <span className="text-xs font-medium text-primary bg-background/80 px-2 py-0.5 rounded-full">
                        Reply to reveal
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {match.messageCount >= 5 && !match.graded && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowGrading(match.id);
                  }}
                >
                  Grade
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <PremiumModal isOpen={showPremium} onClose={() => setShowPremium(false)} />
      
      {showGrading && (
        <GradingModal 
          isOpen={!!showGrading} 
          onClose={() => setShowGrading(null)}
          partnerName={getPartner(showGrading)?.name || "Partner"}
          onSubmit={handleRatingSubmit}
          isSubmitting={ratingMutation.isPending}
        />
      )}

      <NavBar />
    </div>
  );
}
