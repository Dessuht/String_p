import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Star, Heart, MessageCircle } from "lucide-react";
import { MOCK_USERS } from "@/lib/mockData";
import { NavBar } from "@/components/NavBar";
import { MatchOverlay } from "@/components/MatchOverlay";

export default function Swipe() {
  const [matchData, setMatchData] = useState<any>(null);
  const me = MOCK_USERS.find(u => u.id === "me");
  const containerRef = useRef<HTMLDivElement>(null);

  // We'll just show the mock users repeated to create a "feed" feel
  const feedUsers = [...MOCK_USERS, ...MOCK_USERS, ...MOCK_USERS].filter(u => u.id !== "me");

  const handleConnect = (user: any) => {
    // Simulate match
    setTimeout(() => {
      setMatchData(user);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 relative overflow-hidden flex flex-col">
      {/* Header */}
      <header className="px-6 pt-6 pb-2 flex justify-between items-end bg-background/80 backdrop-blur-md sticky top-0 z-30 border-b border-border/5">
        <div>
          <h1 className="text-3xl font-serif text-primary">The Thread</h1>
          <p className="text-xs text-muted-foreground">Pull a string to connect</p>
        </div>
        <Badge variant="outline" className="border-primary/50 text-primary">
          {feedUsers.length} Active Strings
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
            <div className="bg-card rounded-3xl overflow-hidden shadow-sm border border-border/50 group">
              <div className="relative aspect-[4/5] md:aspect-video w-full overflow-hidden">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                
                {/* Overlay Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-3xl font-serif">{user.name}, {user.age}</h2>
                        {user.isVerified && <ShieldCheck className="w-5 h-5 text-blue-400" />}
                      </div>
                      <p className="text-white/80 line-clamp-2 font-light">{user.bio}</p>
                    </div>
                    
                    <Button 
                      size="icon" 
                      className="rounded-full w-14 h-14 bg-white text-black hover:bg-primary hover:text-white transition-colors shadow-xl"
                      onClick={() => handleConnect(user)}
                    >
                      <Heart className="w-6 h-6 fill-current" />
                    </Button>
                  </div>
                </div>

                {/* Top Right Stats */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                   <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-white/10">
                     <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                     <span className="text-xs font-bold text-white">4.8</span>
                   </div>
                </div>
              </div>

              {/* Quick Prompt/Icebreaker area (Optional expansion) */}
              <div className="p-4 bg-muted/30 hidden">
                 <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Icebreaker</p>
                 <p className="text-sm">"What's the one thing you'd save in a fire?"</p>
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
