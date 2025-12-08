import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MapPin, User, X, Heart } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { MOCK_USERS } from "@/lib/mockData";

export default function Radar() {
  const [isScanning, setIsScanning] = useState(false);
  const [foundMatch, setFoundMatch] = useState<string | null>(null);

  const toggleScan = () => {
    setIsScanning(!isScanning);
    if (!isScanning) {
      // Simulate finding a match after 3 seconds
      setTimeout(() => {
        setFoundMatch("3"); // Taylor
      }, 3000);
    } else {
      setFoundMatch(null);
    }
  };

  const matchedUser = MOCK_USERS.find(u => u.id === foundMatch);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col">
      {/* Map Background Placeholder - Abstract minimalist map */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-6">
        <h1 className="text-2xl font-sans font-bold mb-2">String Radar</h1>
        <p className="text-gray-500 text-sm mb-12 text-center max-w-[250px]">
          Find strings that are physically close to you right now.
        </p>

        {/* Radar Visual */}
        <div className="relative w-80 h-80 flex items-center justify-center">
          {/* Central User Node */}
          <div className="w-4 h-4 bg-black rounded-full z-20 shadow-xl" />
          
          {/* Pulse Rings */}
          {isScanning && (
            <>
              <motion.div
                initial={{ scale: 0.2, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute w-full h-full border border-black/30 rounded-full"
              />
              <motion.div
                initial={{ scale: 0.2, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
                className="absolute w-full h-full border border-black/30 rounded-full"
              />
              <motion.div
                initial={{ scale: 0.2, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1.2 }}
                className="absolute w-full h-full border border-black/30 rounded-full"
              />
            </>
          )}

          {/* Static Rings */}
          <div className="absolute w-40 h-40 border border-black/5 rounded-full" />
          <div className="absolute w-60 h-60 border border-black/5 rounded-full" />
          <div className="absolute w-80 h-80 border border-black/5 rounded-full" />
        </div>

        <Button 
          onClick={toggleScan}
          className={`mt-12 rounded-full px-8 h-12 transition-all ${
            isScanning 
              ? "bg-red-50 text-red-500 hover:bg-red-100" 
              : "bg-black text-white hover:bg-black/90"
          }`}
        >
          {isScanning ? "Stop Scanning" : "Start Radar"}
        </Button>
      </div>

      {/* Match Found Modal */}
      <AnimatePresence>
        {matchedUser && (
          <Dialog open={!!matchedUser} onOpenChange={() => setFoundMatch(null)}>
            <DialogContent className="sm:max-w-md bg-white border-none shadow-2xl p-0 overflow-hidden rounded-3xl">
              <div className="relative h-80">
                <img 
                  src={matchedUser.avatar} 
                  alt={matchedUser.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-green-400">Nearby (50m)</span>
                  </div>
                  <h2 className="text-3xl font-serif">{matchedUser.name}, {matchedUser.age}</h2>
                  <p className="opacity-90 text-sm mt-2 line-clamp-2">{matchedUser.bio}</p>
                </div>

                <Button 
                  size="icon"
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white border-0 rounded-full"
                  onClick={() => setFoundMatch(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-4 flex gap-3">
                 <Button className="flex-1 h-12 bg-black text-white hover:bg-black/90 rounded-xl">
                   <Heart className="w-4 h-4 mr-2 fill-current" />
                   Connect
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
