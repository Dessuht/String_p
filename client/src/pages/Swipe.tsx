import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Star, Radio, MapPin } from "lucide-react";
import { MOCK_USERS } from "@/lib/mockData";
import { NavBar } from "@/components/NavBar";
import { MatchOverlay } from "@/components/MatchOverlay";
import { useLocation } from "wouter";

export default function Swipe() {
  const [matchData, setMatchData] = useState<any>(null);
  const [, setLocation] = useLocation();
  const me = MOCK_USERS.find(u => u.id === "me");
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter out "me" from the feed
  const feedUsers = MOCK_USERS.filter(u => u.id !== "me");

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 relative overflow-hidden flex flex-col">
      {/* Header */}
      <header className="px-6 pt-6 pb-2 flex justify-between items-end bg-background/80 backdrop-blur-md sticky top-0 z-30 border-b border-border/5">
        <div>
          <h1 className="text-3xl font-serif text-primary">The Thread</h1>
          <p className="text-xs text-muted-foreground">Follow the string to find your match</p>
        </div>
        <Badge variant="outline" className="border-primary/50 text-primary">
          {feedUsers.length} Nearby
        </Badge>
      </header>

      {/* The Continuous Thread Visual */}
      <div className="absolute left-6 top-0 bottom-0 w-1 bg-border/50 z-0 hidden md:block" /> 
      {/* Mobile Thread Line (Left aligned) */}
      <div className="fixed left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-primary/20 to-transparent z-0" />

      {/* Feed Container */}
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-12 relative z-10" ref={containerRef}>
        {feedUsers.map((user, index) => (
          <motion.div
            key={`${user.id}-${index}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6 }}
            className="relative pl-8"
          >
            {/* The Knot/Node on the string */}
            <div className="absolute left-0 top-12 -ml-[5px] w-3 h-3 rounded-full bg-primary ring-4 ring-background z-20" />
            
            {/* Connection Line from main thread to card */}
            <div className="absolute left-0 top-12 w-8 h-0.5 bg-primary/20" />

            {/* Profile Card */}
            <div className="bg-card rounded-3xl overflow-hidden shadow-sm border border-border/50 group relative">
              <div className="relative aspect-[4/5] md:aspect-video w-full overflow-hidden">
                {/* Blurred Image */}
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-full h-full object-cover blur-xl scale-110 transition-transform duration-700"
                />
                
                {/* Dark Overlay for text readability */}
                <div className="absolute inset-0 bg-black/40" />
                
                {/* Center Action Button */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                   <Button 
                     onClick={() => setLocation("/radar")}
                     className="rounded-full h-16 px-8 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white shadow-2xl group-hover:scale-105 transition-all duration-300"
                   >
                     <Radio className="w-5 h-5 mr-2 animate-pulse text-primary" />
                     <span className="font-semibold tracking-wide">Find to Tug</span>
                   </Button>
                </div>

                {/* Overlay Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10 pointer-events-none">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-3xl font-serif">{user.name}, {user.age}</h2>
                        {user.isVerified && <ShieldCheck className="w-5 h-5 text-blue-400" />}
                      </div>
                      <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
                         <MapPin className="w-3 h-3" />
                         <span>{user.distance}m away</span>
                      </div>
                      <p className="text-white/80 line-clamp-2 font-light max-w-[80%]">{user.bio}</p>
                    </div>
                  </div>
                </div>

                {/* Top Right Stats */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-10">
                   <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-white/10">
                     <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                     <span className="text-xs font-bold text-white">4.8</span>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        <div className="h-24 flex items-center justify-center text-muted-foreground text-sm italic">
          You've reached the end of the thread... for now.
        </div>
      </div>
      
      {matchData && me && (
        <MatchOverlay 
          isOpen={!!matchData} 
          onClose={() => setMatchData(null)}
          matchedUser={matchData}
          currentUser={me}
        />
      )}

      <NavBar />
    </div>
  );
}
