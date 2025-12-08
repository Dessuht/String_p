import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, ShieldCheck, MapPin, Star, Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_USERS } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";

export default function UserProfile() {
  const [, params] = useRoute("/user/:id");
  const [, setLocation] = useLocation();
  const userId = params?.id;
  const user = MOCK_USERS.find(u => u.id === userId);

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
              <span>5 miles away</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-1 bg-card/80 backdrop-blur-sm p-3 rounded-2xl border shadow-sm">
            <div className="flex text-yellow-500">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <span className="font-bold text-lg">4.8</span>
          </div>
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

        {/* Action Buttons */}
        <div className="pt-8 grid grid-cols-4 gap-4">
          <Button variant="outline" size="lg" className="rounded-full h-14 w-14 p-0 border-2 border-destructive text-destructive col-span-1">
            <X className="w-8 h-8" />
          </Button>
          <Button 
            size="lg" 
            className="rounded-full h-14 text-lg bg-primary hover:bg-primary/90 col-span-3 shadow-lg shadow-primary/20"
            onClick={() => setLocation(`/chat/${user.id}`)}
          >
            <Heart className="w-6 h-6 mr-2 fill-current" />
            Message
          </Button>
        </div>
      </div>
    </div>
  );
}
