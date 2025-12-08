import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroImg from "@assets/generated_images/abstract_red_string_connecting_points_in_dark_void.png";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center text-center p-6">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-serif text-primary mb-2 tracking-tighter">
            String
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 font-light tracking-wide">
            Deeper Connections. <br/>
            <span className="text-primary italic">No Strings Attached? No, we want strings.</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="space-y-4"
        >
          <div className="glass-panel p-6 rounded-2xl text-left space-y-3">
            <h3 className="font-serif text-xl text-primary">Why String?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Verified ID checks (No bots, No catfish)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Messages appear only after they reply
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Grade your matches to ensure quality
              </li>
            </ul>
          </div>

          <Link href="/swipe">
            <Button className="w-full h-14 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)] transition-all hover:scale-[1.02]">
              Start Weaving Your Story
            </Button>
          </Link>
          
          <p className="text-xs text-muted-foreground">
            By joining, you agree to our Terms & String Theory.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
