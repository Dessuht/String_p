import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { useLocation } from "wouter";

interface MatchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  matchedUser: {
    id: string;
    name: string;
    avatar: string;
  };
  currentUser: {
    avatar: string;
  };
}

export function MatchOverlay({ isOpen, onClose, matchedUser, currentUser }: MatchOverlayProps) {
  const [, setLocation] = useLocation();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-6"
      >
        {/* Animated Strings Connecting */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="w-full h-full">
            <motion.path
              d="M -100 300 Q 200 100 500 300"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            <motion.path
              d="M 500 300 Q 800 500 1200 300"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
            />
          </svg>
        </div>

        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative z-10 text-center space-y-8"
        >
          <div className="space-y-2">
            <h1 className="text-5xl font-serif text-white italic">It's a Tie!</h1>
            <p className="text-white/60 text-lg font-light">You've found a new string.</p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-2xl">
                <img src={currentUser.avatar} className="w-full h-full object-cover" />
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg z-20 -mx-6 border-4 border-black"
            >
              &
            </motion.div>

            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-2xl">
                <img src={matchedUser.avatar} className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>

          <div className="pt-8 space-y-3">
            <Button 
              size="lg" 
              className="w-full h-14 text-lg rounded-full bg-primary hover:bg-primary/90"
              onClick={() => setLocation(`/chat/${matchedUser.id}`)}
            >
              <MessageCircle className="w-5 h-5 mr-2 fill-current" />
              Say Hello
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full text-white/50 hover:text-white hover:bg-white/10"
              onClick={onClose}
            >
              Keep Swiping
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
