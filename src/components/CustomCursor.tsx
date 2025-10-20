import { useState, useEffect } from "react";

const CURSOR_SIZE = 30;

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    
    const onMouseDown = () => {
      setIsClicking(true);
    };
    
    const onMouseUp = () => {
      setIsClicking(false);
    };
    
    const onMouseLeave = () => setVisible(false);
    
    // Add hover detection for interactive elements
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, .interactive, .cursor-pointer')) {
        setIsHovering(true);
      }
    };
    
    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, .interactive, .cursor-pointer')) {
        setIsHovering(false);
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  // Hide when not visible (e.g. page not focused)
  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[10000]"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: CURSOR_SIZE,
        height: CURSOR_SIZE,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Spiritual fire-themed cursor with cremation ground symbolism */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Outer fire glow ring - deep red */}
        <div className={`absolute inset-0 rounded-full border-2 border-red-900/40 transition-all duration-200 ${isClicking ? 'scale-75' : isHovering ? 'scale-125' : 'scale-100'}`}></div>
        
        {/* Middle animated fire ring - orange to red with pulse animation */}
        <div className={`absolute inset-0 rounded-full border border-orange-700/50 fire-pulse transition-all duration-200 ${isClicking ? 'scale-90' : isHovering ? 'scale-110' : 'scale-100'}`}></div>
        
        {/* Main cursor core with sacred fire glow - gold to deep red */}
        <div className={`absolute w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 via-orange-600 to-red-900 shadow-[0_0_32px_8px_rgba(245,158,11,0.6)] fire-pulse border-2 border-amber-200 transition-all duration-200 ${isClicking ? 'scale-90' : isHovering ? 'scale-110' : 'scale-100'}`}></div>
        
        {/* Inner white dot for focus - representing the soul/spirit */}
        <div className={`w-3 h-3 rounded-full bg-amber-100 shadow-[0_0_18px_6px_rgba(251,191,36,0.7)] border border-amber-300 transition-all duration-200 ${isClicking ? 'scale-75' : isHovering ? 'scale-125' : 'scale-100'}`}></div>
        
        {/* Subtle ash/smoke particles for cremation ground theme */}
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gray-400 opacity-60 ash-float"
            style={{
              top: `${50 + 30 * Math.sin((i * Math.PI) / 2)}%`,
              left: `${50 + 30 * Math.cos((i * Math.PI) / 2)}%`,
              transform: 'translate(-50%, -50%)',
              animation: `ash-float 2s infinite ${i * 0.5}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default CustomCursor;