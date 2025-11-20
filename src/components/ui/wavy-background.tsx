import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, useCallback } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: unknown;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);
  const noiseRef = useRef(createNoise3D());
  const scrollYRef = useRef(0);
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);
  const isHoveringRef = useRef(false);
  
  const getSpeed = useCallback(() => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  }, [speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = ctx.canvas.width = window.innerWidth;
    let h = ctx.canvas.height = window.innerHeight;
    ctx.filter = `blur(${blur}px)`;
    let nt = 0;

    const waveColors = colors ?? [
      "#38bdf8",
      "#818cf8",
      "#c084fc",
      "#e879f9",
      "#22d3ee",
    ];

    const drawWave = (n: number) => {
      nt += getSpeed();
      
      // Calculate mouse influence
      const mouseInfluence = isHoveringRef.current ? 1 : 0.3;
      const mouseDistanceY = (mouseYRef.current - h / 2) / h;
      
      // Add parallax offset based on scroll
      const parallaxOffset = scrollYRef.current * 0.3;
      
      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth || 50;
        
        // Make each line vibrant and clear with full opacity
        const color = waveColors[i % waveColors.length];
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.6; // Vibrant, clear lines
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Different speeds for different wave layers (multi-motion effect)
        const layerSpeed = 1 + (i * 0.2); // Each layer moves at different speed
        const timeOffset = nt * layerSpeed;
        
        // Wave amplitude varies by layer and mouse position
        const baseAmplitude = 100;
        const mouseAmplitude = mouseDistanceY * 50 * mouseInfluence;
        const amplitude = baseAmplitude + mouseAmplitude + (i * 15);
        
        // Wave frequency varies by layer
        const frequency = 800 + (i * 100);
        
        for (let x = 0; x < w; x += 4) {
          // Base wave using noise
          const noiseY = noiseRef.current(x / frequency, 0.3 * i, timeOffset) * amplitude;
          
          // Mouse interaction - waves react to mouse position
          const mouseDist = Math.sqrt(
            Math.pow(x - mouseXRef.current, 2) + 
            Math.pow((noiseY + h * 0.5) - mouseYRef.current, 2)
          );
          const mouseEffect = mouseInfluence * (200 / (mouseDist + 1)) * Math.sin(timeOffset + x * 0.01);
          
          // Combine multiple motion effects
          const waveY = noiseY + mouseEffect + parallaxOffset;
          
          // Add secondary wave motion (ripple effect)
          const ripple = Math.sin((x * 0.02) + (timeOffset * 2)) * 20 * (i % 2 === 0 ? 1 : -1);
          
          // Final Y position with all effects
          const finalY = waveY + h * 0.5 + ripple;
          
          ctx.lineTo(x, finalY);
        }
        ctx.stroke();
        ctx.closePath();
      }
      // Reset global alpha for background fill
      ctx.globalAlpha = waveOpacity || 0.5;
    };

    const render = () => {
      // Clear canvas with background fill (subtle)
      ctx.fillStyle = backgroundFill || "black";
      ctx.globalAlpha = waveOpacity || 0.5;
      ctx.fillRect(0, 0, w, h);
      
      // Draw vibrant, clear waves
      drawWave(5);
      
      animationIdRef.current = requestAnimationFrame(render);
    };

    const handleResize = () => {
      w = ctx.canvas.width = window.innerWidth;
      h = ctx.canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseXRef.current = e.clientX;
      mouseYRef.current = e.clientY;
      isHoveringRef.current = true;
    };

    const handleMouseLeave = () => {
      isHoveringRef.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseXRef.current = e.touches[0].clientX;
        mouseYRef.current = e.touches[0].clientY;
        isHoveringRef.current = true;
      }
    };

    const handleTouchEnd = () => {
      isHoveringRef.current = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [blur, speed, waveOpacity, colors, waveWidth, backgroundFill, getSpeed]);

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    // I'm sorry but i have got to support it on safari.
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      className={cn(
        "h-screen w-full",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0 w-full h-full"
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      ></canvas>
      {children && (
        <div className={cn("relative z-10", className)} {...props}>
          {children}
        </div>
      )}
    </div>
  );
};

