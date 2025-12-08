import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import imgString from "@assets/generated_images/single_piece_of_twine_string_on_white.png";
import imgBroken from "@assets/generated_images/broken_twine_string_on_white.png";
import imgKnot from "@assets/generated_images/knotted_twine_string_on_white.png";

export default function Home() {
  const [, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 0,
      image: imgString,
      title: "Discover your ideal string",
      subtitle: (
        <>
          Please read our <span className="underline cursor-pointer">privacy policy</span>
          <br /> and <span className="underline cursor-pointer">policy regarding</span> before registering.
        </>
      ),
    },
    {
      id: 1,
      image: imgBroken,
      title: "No Strings Attached",
      subtitle: (
        <>
          Please read our <span className="underline cursor-pointer">privacy policy</span>
          <br /> and <span className="underline cursor-pointer">policy regarding</span> before registering.
        </>
      ),
    },
    {
      id: 2,
      image: imgKnot,
      title: "Tie the Knot",
      subtitle: (
        <>
          Please read our <span className="underline cursor-pointer">privacy policy</span>
          <br /> and <span className="underline cursor-pointer">policy regarding</span> before registering.
        </>
      ),
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      setLocation("/survey");
    }
  };

  const handleSkip = () => {
    setLocation("/survey");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between items-center text-center px-6 py-8 relative max-w-md mx-auto">
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center text-xs font-medium text-black/60 pt-2 px-2">
        {/* Placeholder for status bar time/icons if we wanted to mimic the screenshot exactly, 
            but usually in web we leave this blank or put a logo. 
            The screenshot has '11:10', wifi, battery etc. 
            We will skip replicating the system status bar as it's a web app. */}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full mt-10">
        
        {/* Logo S */}
        <motion.div 
          className="text-6xl text-gray-500 mb-8 font-sans font-normal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          S
        </motion.div>

        {/* Carousel Image */}
        <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide}
              src={slides[currentSlide].image}
              alt="String illustration"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="object-contain w-full h-full mix-blend-multiply" 
            />
          </AnimatePresence>
        </div>

        {/* Text Content */}
        <div className="space-y-4 mb-8">
          <AnimatePresence mode="wait">
            <motion.h1 
              key={currentSlide}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-2xl font-bold text-black tracking-tight"
            >
              {slides[currentSlide].title}
            </motion.h1>
          </AnimatePresence>
          
          <p className="text-[10px] text-gray-400 leading-tight max-w-[200px] mx-auto">
            {slides[currentSlide].subtitle}
          </p>
        </div>

        {/* Pagination Dots */}
        <div className="flex gap-2 mb-8">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === slide.id 
                  ? "w-6 bg-black" 
                  : "w-1.5 bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="w-full space-y-4 mb-4">
        <Button 
          onClick={handleNext}
          className="w-full bg-black hover:bg-black/90 text-white rounded-xl h-12 text-sm font-semibold tracking-wide"
        >
          Next
        </Button>
        
        <button 
          onClick={handleSkip}
          className="w-full text-sm font-semibold text-black py-2"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
