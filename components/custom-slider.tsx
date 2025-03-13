"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowLeft, ArrowRight, Github, Instagram } from "lucide-react";

type Slide = {
  id: number;
  image: string;
  title: string;
};

const slides: Slide[] = [
  {
    id: 1,
    image: "1.jpg",
    title: "Layout n°001",
  },
  {
    id: 2,
    image: "2.jpg",
    title: "Layout n°002",
  },
  {
    id: 3,
    image: "3.jpg",
    title: "Layout n°003",
  },
  {
    id: 4,
    image: "4.jpg",
    title: "Layout n°004",
  },
];

export default function CustomSlider() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [showSocials, setShowSocials] = useState<boolean>(false);
  const [isStarAnimating, setIsStarAnimating] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const sliderRef = useRef<HTMLDivElement>(null);


  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);


  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const parallaxX = useTransform(mouseX, [0, windowSize.width || 1], [-15, 15]);
  const parallaxY = useTransform(mouseY, [0, windowSize.height || 1], [-15, 15]);


  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);


  useEffect(() => {
    const preloadImages = () => {
      const nextIndex = (currentIndex + 1) % slides.length;
      const img = new Image();
      img.src = slides[nextIndex].image;
    };
    preloadImages();
  }, [currentIndex]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex >= slides.length) nextIndex = 0;
      if (nextIndex < 0) nextIndex = slides.length - 1;
      return nextIndex;
    });
  };

  const handleStarClick = () => {
    setIsStarAnimating(true);
    setTimeout(() => {
      setShowSocials(true);
      setIsStarAnimating(false);
    }, 1000);
  };

  type PixelStarProps = {
    onClick: () => void;
    isAnimating: boolean;
  };

  const PixelStar = ({ onClick, isAnimating }: PixelStarProps) => {
    return (
      <motion.div
        className="inline-block ml-2 cursor-pointer relative top-1"
        onClick={onClick}
        animate={
          isAnimating
            ? {
                rotate: 360,
                scale: [1, 1.5, 1],
                filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
              }
            : {}
        }
        transition={isAnimating ? { duration: 1, ease: "easeInOut" } : {}}
      >
        <div className="w-5 h-5 relative">
          <div className="absolute bg-white w-1 h-1 top-2 left-2"></div>
          <div className="absolute bg-white w-1 h-1 top-1 left-2"></div>
          <div className="absolute bg-white w-1 h-1 top-2 left-1"></div>
          <div className="absolute bg-white w-1 h-1 top-2 left-3"></div>
          <div className="absolute bg-white w-1 h-1 top-3 left-2"></div>
          <div className="absolute bg-white w-1 h-1 top-0 left-2"></div>
          <div className="absolute bg-white w-1 h-1 top-2 left-0"></div>
          <div className="absolute bg-white w-1 h-1 top-2 left-4"></div>
          <div className="absolute bg-white w-1 h-1 top-4 left-2"></div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative h-screen bg-black text-white overflow-hidden font-light">
   
      <div
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] mix-blend-overlay opacity-30 pointer-events-none z-10"
      />

      <motion.div
        className="fixed w-20 h-20 rounded-full bg-white mix-blend-difference pointer-events-none z-50"
        style={{
          x: springX,
          y: springY,
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="absolute top-8 left-8 z-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center">
          <h1 className="text-4xl tracking-tighter flex items-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              AFJAL HUSSEIN
            </motion.span>
            <PixelStar onClick={handleStarClick} isAnimating={isStarAnimating} />
          </h1>
          <div className="text-2xl sm:hidden tracking-tighter mt-1">
            {String(currentIndex + 1).padStart(2, "0")}
            <span className="text-gray-500 mx-1">/</span>
            {String(slides.length).padStart(2, "0")}
          </div>
        </div>
      </div>

      <div className="absolute top-8 right-8 z-20">
        <a
          href="https://afjal-ins.vercel.app/"
          className="text-lg hover:underline tracking-wide group flex items-center"
        >
          <span>INSANE</span>
          <motion.span
            className="inline-block ml-1"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-3 h-3 rounded-full bg-white group-hover:bg-white/70 transition-colors" />
          </motion.span>
        </a>
      </div>

      <div className="absolute left-8 top-4 sm:top-8 md:top-1/2 sm:translate-y-0 md:-translate-y-1/2 z-20 hidden sm:flex flex-col gap-6">
        <div className="text-2xl md:text-6xl tracking-tighter">
          {String(currentIndex + 1).padStart(2, "0")}
          <span className="text-gray-500 mx-2">/</span>
          {String(slides.length).padStart(2, "0")}
        </div>

        <div className="flex gap-4">
          <motion.button
            onClick={() => paginate(-1)}
            className="group relative w-14 h-14 border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/10 overflow-hidden"
          >
            <ArrowLeft className="w-6 h-6 text-white/70 transition-all duration-300" />
          </motion.button>
          <motion.button
            onClick={() => paginate(1)}
            className="group relative w-14 h-14 border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/10 overflow-hidden"
          >
            <ArrowRight className="w-6 h-6 text-white/70 transition-all duration-300" />
          </motion.button>
        </div>
      </div>

      <div className="absolute bottom-8 left-8 z-20">
        {showSocials && (
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            <motion.a
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              href="https://github.com/INSANE0777"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xl tracking-wide hover:text-gray-400 transition-colors"
            >
              <motion.span>
                <Github className="w-5 h-5" />
              </motion.span>
              GitHub
            </motion.a>
            <motion.a
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              href="https://instagram.com/_insaneee7"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xl tracking-wide hover:text-gray-400 transition-colors"
            >
              <motion.span>
                <Instagram className="w-5 h-5" />
              </motion.span>
              Instagram
            </motion.a>
          </motion.div>
        )}
      </div>

      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 md:flex items-center gap-4 hidden">
        <div ref={sliderRef} className="relative w-[50vw] h-[60vh] rounded-xl overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
                scale: { duration: 0.4 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute inset-0"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.2 }}
                className="absolute top-6 left-6 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm tracking-wide z-20"
              >
                {slides[currentIndex].title}
              </motion.div>
            
              <motion.div
                style={{
                  x: parallaxX,
                  y: parallaxY,
                  scale: 1.1,
                }}
                className="absolute inset-0"
              >
                <img
                  src={slides[currentIndex].image}
                  alt={slides[currentIndex].title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
           
              <div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(circle, transparent 40%, rgba(0, 0, 0, 0.4) 100%)",
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-4">
          {slides.map((slide, index) => (
            <motion.div
              key={slide.id}
              animate={{
                opacity: index === currentIndex ? 1 : 0.4,
                scale: index === currentIndex ? 1.1 : 1,
              }}
              className="w-32 h-20 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setCurrentIndex(index)}
            >
              <div className="relative w-full h-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="md:hidden flex flex-col items-center justify-center absolute inset-0 px-4 pt-20 pb-16">
        <div ref={sliderRef} className="relative w-full h-[50vh] rounded-xl overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
                scale: { duration: 0.4 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute inset-0"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-6 left-6 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm tracking-wide z-20"
              >
                {slides[currentIndex].title}
              </motion.div>
              <img
                src={slides[currentIndex].image}
                alt={slides[currentIndex].title}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(circle, transparent 40%, rgba(0, 0, 0, 0.4) 100%)",
                }}
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-4 right-4 flex gap-2 z-30">
            <motion.button
              onClick={() => paginate(-1)}
              className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={() => paginate(1)}
              className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
            >
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        <div className="flex gap-3 mt-4 justify-center">
          {slides.map((slide, index) => (
            <motion.div
              key={`mobile-${slide.id}`}
              animate={{
                opacity: index === currentIndex ? 1 : 0.4,
                scale: index === currentIndex ? 1.1 : 1,
              }}
              className="w-16 h-12 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setCurrentIndex(index)}
            >
              <div className="relative w-full h-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

  
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 text-white/30 text-xs tracking-wider opacity-50 hidden md:flex">
        <div className="border border-white/30 px-2 py-0.5 rounded">←</div>
        <div className="border border-white/30 px-2 py-0.5 rounded">→</div>
        <span>to navigate</span>
      </div>

      <motion.div
        className="absolute inset-0 z-0"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") paginate(-1);
          if (e.key === "ArrowRight") paginate(1);
        }}
        tabIndex={0}
      />

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-10" />
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent z-10" />
    </div>
  );
}
