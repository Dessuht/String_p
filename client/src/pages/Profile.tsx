import { MOCK_USERS } from "@/lib/mockData";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Settings, Crown, Star } from "lucide-react";

import { Link } from "wouter";

export default function Profile() {
  const me = MOCK_USERS.find(u => u.id === "me");

  if (!me) return null;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Profile Header */}
      <div className="relative h-64 bg-muted overflow-hidden">
        <img 
          src={me.avatar} 
          alt="Profile Cover" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        <Link href="/profile/edit">
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-4 right-4 rounded-full bg-background/50 backdrop-blur-md border-0 text-white"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      <div className="px-6 -mt-12 relative z-10">
        <div className="flex justify-between items-end mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-background overflow-hidden bg-card">
            <img src={me.avatar} alt={me.name} className="w-full h-full object-cover" />
          </div>
          
          <Link href="/profile/edit">
            <Button className="bg-primary hover:bg-primary/90 rounded-full px-6">
              Edit Profile
            </Button>
          </Link>
        </div>

        <div className="space-y-1 mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-serif">{me.name}, {me.age}</h1>
            {me.isVerified && (
              <ShieldCheck className="w-6 h-6 text-blue-400 fill-blue-400/20" />
            )}
          </div>
          <p className="text-muted-foreground">{me.bio}</p>
        </div>

        {/* Stats / Grades */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-yellow-500">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-bold text-xl">4.7</span>
            </div>
            <p className="text-xs text-muted-foreground">Average Grade</p>
          </Card>
          
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Crown className="w-5 h-5" />
              <span className="font-bold text-xl">Premium</span>
            </div>
            <p className="text-xs text-muted-foreground">Active Member</p>
          </Card>
        </div>

        {/* Verification Status */}
        <Card className="p-6 border-blue-500/20 bg-blue-500/5 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-blue-100 mb-1">ID Verified</h3>
              <p className="text-sm text-blue-200/60 leading-relaxed">
                Your government ID has been verified. You appear as an authentic profile to others.
              </p>
            </div>
          </div>
        </Card>

      </div>

      <NavBar />
    </div>
  );
}
