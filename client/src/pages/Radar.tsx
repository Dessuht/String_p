import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MapPin, X, Heart, Eye, EyeOff, Radio, Zap } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { MOCK_USERS } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";

export default function Radar() {
  const [isScanning, setIsScanning] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [foundMatch, setFoundMatch] = useState<string | null>(null);
  const [tugState, setTugState] = useState<'idle' | 'sending' | 'waiting' | 'connected'>('idle');
  const [fatePoints, setFatePoints] = useState(120);
  
  // Simulated location of the match relative to center (0,0)
  const [matchPosition, setMatchPosition] = useState({ x: 0, y: 0 });

  const toggleScan = () => {
    if (!isVisible) {
      alert("You must be visible to scan for others.");
      return;
    }
    
    setIsScanning(!isScanning);
    if (!isScanning) {
      // Reset state
      setTugState('idle');
      
      // Simulate finding a match
      setTimeout(() => {
        // Random position on the radar
        const angle = Math.random() * Math.PI * 2;
        const distance = 80; // Fixed distance for UI consistency
        setMatchPosition({
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance
        });
        setFoundMatch("3"); // Taylor
      }, 3000);
    } else {
      setFoundMatch(null);
    }
  };

  const handleTug = () => {
    setTugState('sending');
    setTimeout(() => {
      setTugState('waiting');
      // Simulate them tugging back
      setTimeout(() => {
        setTugState('connected');
        setFatePoints(prev => prev + 50); // Gamification reward
      }, 2000);
    }, 1000);
  };

  const matchedUser = MOCK_USERS.find(u => u.id === foundMatch);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Top Bar Controls */}
      <div className="absolute top-4 left-4 z-20">
         <Badge variant="outline" className="bg-white/80 backdrop-blur-md px-3 py-1.5 gap-2 border-yellow-500/30">
           <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
           <span className="font-bold text-yellow-600">{fatePoints} FP</span>
         </Badge>
      </div>

      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-gray-100 shadow-sm">
        <Label htmlFor="ghost-mode" className="text-xs font-medium cursor-pointer">
          {isVisible ? "Visible" : "Ghost Mode"}
        </Label>
        <Switch 
          id="ghost-mode" 
          checked={isVisible} 
          onCheckedChange={setIsVisible} 
          className="scale-75"
        />
        {isVisible ? <Eye className="w-3 h-3 text-green-500" /> : <EyeOff className="w-3 h-3 text-gray-400" />}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-6 pb-24">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2 tracking-tight">String Radar</h1>
          <p className="text-gray-400 text-xs uppercase tracking-widest">
            {isScanning ? "Scanning frequencies..." : "Tap to scan area"}
          </p>
        </div>

        {/* Radar Visual */}
        <div className="relative w-80 h-80 flex items-center justify-center">
          
          {/* Connection String (Visible when match found) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
            <AnimatePresence>
              {foundMatch && (
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: 1,
                    stroke: tugState === 'connected' ? '#Eab308' : '#ef4444', // Gold when connected
                    strokeWidth: tugState === 'sending' ? 4 : 2
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  d={`M 160 160 Q ${160 + matchPosition.x / 2} ${160 + matchPosition.y / 2 + 50} ${160 + matchPosition.x} ${160 + matchPosition.y}`}
                  stroke="hsl(var(--primary))" 
                  fill="none"
                  strokeDasharray={tugState === 'connected' ? "0" : "4 4"}
                  className="transition-colors duration-500"
                />
              )}
            </AnimatePresence>
          </svg>

          {/* Central User Node */}
          <div className="w-6 h-6 bg-black rounded-full z-20 shadow-xl border-4 border-white flex items-center justify-center">
            <div className={`w-2 h-2 rounded-full transition-colors ${tugState === 'sending' ? 'bg-red-500 animate-ping' : 'bg-white'}`} />
          </div>
          
          {/* Scanning Waves */}
          {isScanning && !foundMatch && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ width: "20px", height: "20px", opacity: 0.8, borderWidth: "1px" }}
                  animate={{ 
                    width: "300px", 
                    height: "300px", 
                    opacity: 0,
                    borderWidth: "0px"
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity, 
                    delay: i * 0.8,
                    ease: "easeOut" 
                  }}
                  className="absolute border border-black/40 rounded-full"
                />
              ))}
            </>
          )}

          {/* Found Match Node */}
          <AnimatePresence>
            {foundMatch && (
              <motion.button
                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                animate={{ 
                  scale: tugState === 'connected' ? 1.2 : 1, 
                  opacity: 1, 
                  x: matchPosition.x, 
                  y: matchPosition.y 
                }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.2 }}
                onClick={() => setFoundMatch(foundMatch)} // Re-trigger dialog if needed
                className={`absolute w-12 h-12 rounded-full border-2 shadow-lg z-30 overflow-hidden cursor-pointer transition-all ${tugState === 'connected' ? 'border-yellow-400 shadow-yellow-200' : 'border-white'}`}
              >
                <img src={matchedUser?.avatar} alt="Match" className={`w-full h-full object-cover transition-all ${tugState === 'idle' ? 'blur-sm grayscale' : ''}`} />
                {tugState === 'connected' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                     <Heart className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-bounce" />
                  </div>
                )}
              </motion.button>
            )}
          </AnimatePresence>

          {/* Static Decoration Rings */}
          <div className="absolute w-40 h-40 border border-black/5 rounded-full pointer-events-none" />
          <div className="absolute w-64 h-64 border border-black/5 rounded-full pointer-events-none" />
        </div>

        {/* Action Button */}
        <div className="mt-16 relative h-20 flex items-center justify-center">
          {!foundMatch ? (
            <Button 
              onClick={toggleScan}
              size="lg"
              className={`rounded-full w-20 h-20 shadow-2xl transition-all duration-500 ${
                isScanning 
                  ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                  : "bg-black hover:bg-black/90"
              }`}
            >
              {isScanning ? (
                <X className="w-8 h-8 text-white" />
              ) : (
                <Radio className="w-8 h-8 text-white" />
              )}
            </Button>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Button 
                onClick={handleTug}
                disabled={tugState !== 'idle'}
                size="lg"
                className={`rounded-full px-8 h-14 shadow-xl transition-all ${
                  tugState === 'connected' 
                    ? "bg-yellow-400 hover:bg-yellow-500 text-black" 
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                {tugState === 'idle' && "Tug String"}
                {tugState === 'sending' && "Sending Pulse..."}
                {tugState === 'waiting' && "Waiting..."}
                {tugState === 'connected' && "Connected! (+50 FP)"}
              </Button>
              {tugState === 'idle' && (
                <p className="text-xs text-muted-foreground animate-pulse">Tap to get their attention</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Match Details Modal (Only show when connected) */}
      <AnimatePresence>
        {foundMatch && matchedUser && tugState === 'connected' && (
          <Dialog open={true} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-md bg-white border-none shadow-2xl p-0 overflow-hidden rounded-[2rem] m-4">
              <div className="relative h-96">
                <img 
                  src={matchedUser.avatar} 
                  alt={matchedUser.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-green-500/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-green-500/30">
                      <MapPin className="w-3 h-3 text-green-400" />
                      <span className="text-xs font-bold text-green-400 tracking-wide">50 METERS AWAY</span>
                    </div>
                  </div>
                  <h2 className="text-4xl font-serif mb-1">{matchedUser.name}, {matchedUser.age}</h2>
                  <p className="text-white/80 text-sm leading-relaxed">{matchedUser.bio}</p>
                </div>

                <Button 
                  size="icon"
                  className="absolute top-4 right-4 bg-black/20 backdrop-blur-md hover:bg-black/40 text-white border-0 rounded-full w-10 h-10"
                  onClick={() => setFoundMatch(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6 bg-white space-y-3">
                 <Button className="w-full h-14 bg-black text-white hover:bg-black/90 rounded-xl text-lg font-medium shadow-lg shadow-black/10">
                   <Heart className="w-5 h-5 mr-2 fill-current text-red-500" />
                   Start Chat
                 </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <NavBar />
    </div>
  );
}
