import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, ShieldCheck, MapPin, Heart, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_USERS } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/StarRating";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/lib/mockData";

export default function UserProfile() {
  const [, params] = useRoute("/user/:id");
  const [, setLocation] = useLocation();
  const userId = params?.id;
  const user = MOCK_USERS.find(u => u.id === userId);
  const { toast } = useToast();
  const [hasTugged, setHasTugged] = useState(false);

  // Get current user's data to show daily tugs remaining
  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/users", "me"],
    enabled: false, // Using mock data for now
    initialData: MOCK_USERS.find(u => u.id === "me"),
  });

  // Check if already tugged this user
  const { data: tugCheckData } = useQuery({
    queryKey: ["/api/tugs/check", "me", userId],
    enabled: false, // Using local state for now
  });

  // Tug mutation
  const tugMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/tugs", {
        fromUserId: "me",
        toUserId: userId,
      });
    },
    onSuccess: (data: any) => {
      setHasTugged(true);
      
      if (data.isMutual) {
        toast({
          title: "It's a Match! 🎉",
          description: `You and ${user?.name} have matched! Start chatting now.`,
          duration: 5000,
        });
        // Navigate to chat after a brief delay
        setTimeout(() => {
          setLocation(`/chat/${userId}`);
        }, 1500);
      } else {
        toast({
          title: "Tug sent!",
          description: `${user?.name} will be notified of your interest.`,
        });
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/users", "me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tugs/check"] });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Failed to send tug";
      
      if (errorMessage.includes("No tugs remaining")) {
        toast({
          title: "Out of Tugs",
          description: "You've used all your tugs for today. Come back tomorrow or use Fidelity Points to refill!",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
  });

  const handleTug = () => {
    if (!hasTugged && !tugMutation.isPending) {
      tugMutation.mutate();
    }
  };

  if (!user) return <div className="p-8 text-center">User not found</div>;

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Full Screen Image Header */}
      <div className="relative h-[50vh] w-full">
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background" />
        
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute top-4 left-4 rounded-full bg-white/20 backdrop-blur-md border-white/20 hover:bg-white/40 text-white"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
      </div>

      <div className="px-6 -mt-12 relative z-10 space-y-6">
        {/* Main Info Card */}
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-4xl font-serif text-foreground">{user.name}, {user.age}</h1>
              {user.isVerified && <ShieldCheck className="w-6 h-6 text-blue-400" />}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MapPin className="w-4 h-4" />
              <span>{Math.round(user.distance / 1609)} miles away</span>
            </div>
          </div>
          
          <StarRating 
            rating={user.starRating} 
            totalRatings={user.totalRatingsReceived}
            size="lg"
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">About</h3>
          <p className="text-lg leading-relaxed font-light">{user.bio}</p>
        </div>

        {/* Tags/Interests (Mocked) */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {["Art", "Coffee", "Photography", "Travel", "Indie Music"].map(tag => (
              <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Daily Tugs Counter */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground" data-testid="text-tugs-remaining">
            {currentUser?.dailyTugsRemaining ?? 10} Tugs remaining today
          </span>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 grid grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            size="lg" 
            className="rounded-full h-14 w-14 p-0 border-2 border-destructive text-destructive col-span-1"
            data-testid="button-pass"
            onClick={() => window.history.back()}
          >
            <X className="w-8 h-8" />
          </Button>
          <Button 
            size="lg" 
            className="rounded-full h-14 text-lg bg-primary hover:bg-primary/90 col-span-3 shadow-lg shadow-primary/20"
            onClick={handleTug}
            disabled={hasTugged || tugMutation.isPending || (currentUser?.dailyTugsRemaining ?? 0) <= 0}
            data-testid="button-tug"
          >
            {tugMutation.isPending ? (
              "Sending..."
            ) : hasTugged ? (
              <>
                <Heart className="w-6 h-6 mr-2 fill-current" />
                Tugged!
              </>
            ) : (
              <>
                <Zap className="w-6 h-6 mr-2" />
                Tug
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
