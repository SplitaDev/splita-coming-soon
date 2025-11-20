import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface SplitParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  splitProgress: number;
  targetX: number;
  targetY: number;
  isSplitting: boolean;
  rotation: number;
  rotationSpeed: number;
  pulse: number;
  sectionY: number; // Y position relative to content sections
}

interface MoneyFlow {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
}

export const SplitaBackground = ({
  children,
  className,
  containerClassName,
  ...props
}: {
  children?: any;
  className?: string;
  containerClassName?: string;
  [key: string]: any;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);
  const particlesRef = useRef<SplitParticle[]>([]);
  const moneyFlowsRef = useRef<MoneyFlow[]>([]);
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);
  const isHoveringRef = useRef(false);
  const scrollYRef = useRef(0);
  const lastMoneySpawnRef = useRef(0);

  const colors = ["#02B7A0", "#02D4B8", "#00A693", "#01C9B7"];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (ctx.canvas.width = window.innerWidth);
    let h = (ctx.canvas.height = window.innerHeight);

    // Content area dimensions (matching App.tsx layout)
    const contentCenterX = w / 2;
    
    // Hero section position (top of content area)
    const heroY = 200 + scrollYRef.current * 0.3; // Approximate hero position
    const sectionGap = 64; // gap-16 = 4rem

    // Initialize particles - positioned relative to content sections
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = 8; // Fewer particles for cleaner look
      
      // Position particles around hero section and calculator area
      const sections = [
        { y: heroY, radius: 120 }, // Hero section
        { y: heroY + sectionGap * 2, radius: 100 }, // Calculator area
        { y: heroY + sectionGap * 4, radius: 80 }, // Waitlist area
      ];

      sections.forEach((section, sectionIndex) => {
        const particlesPerSection = Math.floor(particleCount / sections.length);
        
        for (let i = 0; i < particlesPerSection; i++) {
          const angle = (Math.PI * 2 * i) / particlesPerSection;
          const offset = sectionIndex * 0.3; // Slight rotation per section
          
          particlesRef.current.push({
            id: sectionIndex * particlesPerSection + i,
            x: contentCenterX + Math.cos(angle + offset) * section.radius,
            y: section.y + Math.sin(angle + offset) * (section.radius * 0.6),
            vx: Math.cos(angle + offset) * 0.3,
            vy: Math.sin(angle + offset) * 0.3,
            size: 6 + Math.random() * 3,
            color: colors[i % colors.length],
            splitProgress: 0,
            targetX: contentCenterX + Math.cos(angle + offset) * section.radius,
            targetY: section.y + Math.sin(angle + offset) * (section.radius * 0.6),
            isSplitting: false,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.015,
            pulse: Math.random() * Math.PI * 2,
            sectionY: section.y,
          });
        }
      });
    };

    initParticles();

    const drawParticle = (particle: SplitParticle, time: number) => {
      const pulseSize = particle.size + Math.sin(particle.pulse + time * 0.002) * 1.5;
      
      // Subtle glow
      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        pulseSize * 3
      );
      gradient.addColorStop(0, `${particle.color}30`);
      gradient.addColorStop(0.5, `${particle.color}10`);
      gradient.addColorStop(1, `${particle.color}00`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, pulseSize * 3, 0, Math.PI * 2);
      ctx.fill();

      // Main particle
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(0, 0, pulseSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Split indicator
      if (particle.isSplitting) {
        const splitOffset = Math.sin(particle.splitProgress * Math.PI) * 15;
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.moveTo(-splitOffset, -pulseSize);
        ctx.lineTo(-splitOffset, pulseSize);
        ctx.moveTo(splitOffset, -pulseSize);
        ctx.lineTo(splitOffset, pulseSize);
        ctx.stroke();
      }
      
      ctx.restore();
      ctx.globalAlpha = 1;
    };

    const drawMoneyFlow = (flow: MoneyFlow) => {
      ctx.save();
      ctx.globalAlpha = flow.opacity * 0.5;
      ctx.fillStyle = "#02B7A0";
      
      ctx.font = `${flow.size}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("$", flow.x, flow.y);
      
      ctx.restore();
    };

    const drawSplitVisualization = (time: number) => {
      const particles = particlesRef.current;
      
      // Draw central bill at hero section position
      const billX = contentCenterX;
      const billY = heroY;
      const billPulse = Math.sin(time * 0.002) * 3;
      const billSize = 30 + billPulse;
      
      // Outer glow
      const billGradient = ctx.createRadialGradient(billX, billY, 0, billX, billY, billSize * 2.5);
      billGradient.addColorStop(0, "rgba(2, 183, 160, 0.15)");
      billGradient.addColorStop(1, "rgba(2, 183, 160, 0)");
      ctx.fillStyle = billGradient;
      ctx.beginPath();
      ctx.arc(billX, billY, billSize * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Main bill circle
      ctx.fillStyle = "rgba(2, 183, 160, 0.1)";
      ctx.beginPath();
      ctx.arc(billX, billY, billSize, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#02B7A0";
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(billX, billY, billSize, 0, Math.PI * 2);
      ctx.stroke();

      // Dollar sign
      ctx.fillStyle = "#02B7A0";
      ctx.globalAlpha = 0.7;
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("$", billX, billY);
      ctx.globalAlpha = 1;

      // Draw splitting lines to particles
      particles.forEach((particle, index) => {
        const distance = Math.sqrt(
          Math.pow(particle.x - billX, 2) + Math.pow(particle.y - billY, 2)
        );
        const opacity = Math.max(0, 0.3 - distance / 500);
        const pulse = (Math.sin(time * 0.0015 + index) + 1) / 2;
        const waveEffect = Math.sin(time * 0.003 + index * 0.4) * 8;

        const midX = (billX + particle.x) / 2;
        const midY = (billY + particle.y) / 2;
        const angle = Math.atan2(particle.y - billY, particle.x - billX);
        const perpX = Math.cos(angle + Math.PI / 2) * waveEffect;
        const perpY = Math.sin(angle + Math.PI / 2) * waveEffect;

        ctx.beginPath();
        ctx.moveTo(billX, billY);
        ctx.quadraticCurveTo(midX + perpX, midY + perpY, particle.x, particle.y);
        ctx.strokeStyle = `rgba(2, 183, 160, ${opacity * pulse * 0.3})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Arrow
        const arrowX = particle.x - Math.cos(angle) * 15;
        const arrowY = particle.y - Math.sin(angle) * 15;
        ctx.save();
        ctx.translate(arrowX, arrowY);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-6, -4);
        ctx.lineTo(-6, 4);
        ctx.closePath();
        ctx.fillStyle = `rgba(2, 183, 160, ${opacity * pulse * 0.4})`;
        ctx.fill();
        ctx.restore();
      });
    };

    const updateParticles = (time: number) => {
      const particles = particlesRef.current;
      const mouseInfluence = isHoveringRef.current ? 1 : 0.2;
      const mouseForce = 30 * mouseInfluence;

      particles.forEach((particle, index) => {
        // Calculate angle from center of its section
        const sectionCenterY = particle.sectionY;
        const angle = (Math.PI * 2 * index) / particles.length;
        const radius = 100;

        // Target position relative to content center
        particle.targetX = contentCenterX + Math.cos(angle + time * 0.00008) * radius;
        particle.targetY = sectionCenterY + Math.sin(angle + time * 0.00008) * (radius * 0.6);

        // Mouse interaction
        const mouseDx = mouseXRef.current - particle.x;
        const mouseDy = mouseYRef.current - particle.y;
        const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
        const mouseForceX = (mouseDx / (mouseDist + 1)) * mouseForce;
        const mouseForceY = (mouseDy / (mouseDist + 1)) * mouseForce;

        // Spring toward target
        const targetDx = particle.targetX - particle.x;
        const targetDy = particle.targetY - particle.y;
        const spring = 0.04;
        particle.vx += targetDx * spring;
        particle.vy += targetDy * spring;

        // Apply mouse force
        particle.vx += mouseForceX * 0.008;
        particle.vy += mouseForceY * 0.008;

        // Damping
        particle.vx *= 0.96;
        particle.vy *= 0.96;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Update rotation and pulse
        particle.rotation += particle.rotationSpeed;
        particle.pulse += 0.015;

        // Split animation
        if (Math.random() < 0.002) {
          particle.isSplitting = true;
          particle.splitProgress = 0;
        }

        if (particle.isSplitting) {
          particle.splitProgress += 0.04;
          if (particle.splitProgress >= 1) {
            particle.isSplitting = false;
            particle.splitProgress = 0;
          }
        }
      });

      // Update money flows
      const billX = contentCenterX;
      const billY = heroY;
      
      if (time - lastMoneySpawnRef.current > 2500) {
        const angle = Math.random() * Math.PI * 2;
        moneyFlowsRef.current.push({
          id: Date.now(),
          x: billX,
          y: billY,
          vx: Math.cos(angle) * 1.5,
          vy: Math.sin(angle) * 1.5,
          size: 10 + Math.random() * 6,
          opacity: 0.5,
          life: 1,
        });
        lastMoneySpawnRef.current = time;
      }

      // Update and remove old flows
      moneyFlowsRef.current = moneyFlowsRef.current
        .map((flow) => {
          flow.x += flow.vx;
          flow.y += flow.vy;
          flow.life -= 0.008;
          flow.opacity = flow.life * 0.5;
          flow.vx *= 0.97;
          flow.vy *= 0.97;
          return flow;
        })
        .filter((flow) => flow.life > 0 && flow.opacity > 0);
    };

    const render = (time: number) => {
      // Clear with white background
      ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
      ctx.fillRect(0, 0, w, h);

      // Update particles
      updateParticles(time);

      // Draw split visualization
      drawSplitVisualization(time);

      // Draw money flows
      moneyFlowsRef.current.forEach((flow) => {
        drawMoneyFlow(flow);
      });

      // Draw particles
      particlesRef.current.forEach((particle) => {
        drawParticle(particle, time);
      });

      animationIdRef.current = requestAnimationFrame((t) => render(t));
    };

    const handleResize = () => {
      w = ctx.canvas.width = window.innerWidth;
      h = ctx.canvas.height = window.innerHeight;
      initParticles();
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

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    const animate = (currentTime: number) => {
      render(currentTime);
    };
    
    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return (
    <div
      className={cn("h-screen w-full relative overflow-hidden", containerClassName)}
    >
      <canvas
        className="absolute inset-0 z-0 w-full h-full"
        ref={canvasRef}
        id="splita-background-canvas"
      />
      {children && (
        <div className={cn("relative z-10", className)} {...props}>
          {children}
        </div>
      )}
    </div>
  );
};
