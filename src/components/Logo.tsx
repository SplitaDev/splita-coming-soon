interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

export default function Logo({ size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "h-10 w-auto",
    md: "h-14 w-auto",
    lg: "h-20 w-auto",
    xl: "h-28 w-auto",
    "2xl": "h-36 w-auto",
  };

  const logoSize = sizeClasses[size];

  return (
    <div className={`flex items-center group cursor-pointer transition-all duration-300 ${className}`} style={{ background: 'transparent' }}>
      <div className={`${logoSize} flex-shrink-0 relative`} style={{ background: 'transparent' }}>
        <img
          src="/logo.png"
          alt="Splita Logo"
          className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg group-active:scale-95"
          style={{
            filter: "drop-shadow(0 0 0 rgba(2, 183, 160, 0))",
            transition: "all 0.3s ease",
            background: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "drop-shadow(0 4px 12px rgba(2, 183, 160, 0.4))";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "drop-shadow(0 0 0 rgba(2, 183, 160, 0))";
          }}
          onError={(e) => {
            // Fallback to gradient if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            if (target.parentElement) {
              target.parentElement.innerHTML = `
                <div class="w-full h-full bg-gradient-to-br from-[#02B7A0] to-[#02D4B8] rounded-lg transition-all duration-300 group-hover:scale-110"></div>
              `;
            }
          }}
        />
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-[rgb(var(--primary))] opacity-0 blur-xl group-hover:opacity-20 transition-opacity duration-300 -z-10" />
      </div>
    </div>
  );
}
