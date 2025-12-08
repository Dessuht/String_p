import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, X, Heart, Star } from "lucide-react";
import { MOCK_USERS } from "@/lib/mockData";
import { NavBar } from "@/components/NavBar";

export default function Swipe() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const currentUser = MOCK_USERS[currentIndex];

  const handleSwipe = (direction: "left" | "right") => {
    // In a real app, this would create a match or pass
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % MOCK_USERS.length);
      x.set(0);
    }, 200);
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 relative overflow-hidden">
      {/* Decorative string background */}
      <svg className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none z-0">
        <path d="M-100,100 C200,300 400,0 600,200 S900,100 1200,400" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
        <path d="M-100,300 C100,100 500,500 800,200" stroke="hsl(var(--primary))" strokeWidth="1" fill="none" />
      </svg>

      <div className="relative z-10 flex flex-col items-center pt-8 px-4 h-[85vh]">
        <header className="w-full flex justify-between items-center mb-6 max-w-md">
          <h1 className="text-3xl font-serif text-primary">String</h1>
          <Badge variant="outline" className="border-primary/50 text-primary">
            {MOCK_USERS.length} Potential Strings
          </Badge>
        </header>

        <div className="relative w-full max-w-md flex-1 flex items-center justify-center">
          <AnimatePresence>
            <motion.div
              key={currentUser.id}
              style={{ x, rotate, opacity }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.x > 100) handleSwipe("right");
                else if (offset.x < -100) handleSwipe("left");
              }}
              className="absolute inset-0"
            >
              <Card className="h-full w-full overflow-hidden rounded-3xl border-0 bg-card shadow-2xl relative group cursor-grab active:cursor-grabbing">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-4xl font-serif text-white">{currentUser.name}, {currentUser.age}</h2>
                      {currentUser.isVerified && (
                        <ShieldCheck className="w-6 h-6 text-blue-400 fill-blue-400/20" />
                      )}
                    </div>
                    
                    {/* Grades Display */}
                    <div className="flex gap-1 mb-2">
                      {currentUser.grades.map((grade, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>

                    <p className="text-lg text-white/80 font-light leading-relaxed">
                      "{currentUser.bio}"
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex gap-6 mt-8">
          <Button 
            size="icon" 
            variant="outline" 
            className="w-16 h-16 rounded-full border-2 border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors"
            onClick={() => handleSwipe("left")}
          >
            <X className="w-8 h-8" />
          </Button>
          <Button 
            size="icon" 
            variant="outline" 
            className="w-16 h-16 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors shadow-[0_0_20px_-5px_hsl(var(--primary))]"
            onClick={() => handleSwipe("right")}
          >
            <Heart className="w-8 h-8 fill-current" />
          </Button>
        </div>
      </div>
      
      <NavBar />
    </div>
  );
}
