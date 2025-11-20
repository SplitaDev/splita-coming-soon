export function GridPattern() {
  return (
    <div className="grid-wrapper fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div 
        className="grid-background absolute inset-0"
        style={{
          backgroundColor: '#f8fafc',
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: '20px 30px',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
        }}
      />
    </div>
  );
}

