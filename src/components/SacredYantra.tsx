import { useState, useEffect } from 'react';

interface YantraPoint {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

const SacredYantra = () => {
  const [points, setPoints] = useState<YantraPoint[]>([]);
  const [isRotating, setIsRotating] = useState(true);
  const [ yantraType, setYantraType ] = useState<'sri' | 'kurma' | 'anahata'>('sri');

  // Generate yantra points
  useEffect(() => {
    const generatePoints = () => {
      const newPoints: YantraPoint[] = [];
      
      // Central point (Bindu)
      newPoints.push({ x: 50, y: 50, size: 8, opacity: 1 });
      
      // Inner circle points
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        const radius = 15;
        newPoints.push({
          x: 50 + Math.cos(angle) * radius,
          y: 50 + Math.sin(angle) * radius,
          size: 4,
          opacity: 0.8
        });
      }
      
      // Middle circle points
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12;
        const radius = 25;
        newPoints.push({
          x: 50 + Math.cos(angle) * radius,
          y: 50 + Math.sin(angle) * radius,
          size: 3,
          opacity: 0.6
        });
      }
      
      // Outer circle points
      for (let i = 0; i < 16; i++) {
        const angle = (i * Math.PI * 2) / 16;
        const radius = 35;
        newPoints.push({
          x: 50 + Math.cos(angle) * radius,
          y: 50 + Math.sin(angle) * radius,
          size: 2,
          opacity: 0.4
        });
      }
      
      setPoints(newPoints);
    };
    
    generatePoints();
  }, []);

  // Render different yantra types
  const renderYantra = () => {
    switch (yantraType) {
      case 'sri':
        return (
          <div className="relative w-64 h-64">
            {/* Central bindu (point) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full shadow-lg"></div>
            
            {/* Triangles */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {/* Outer triangle */}
              <div className="w-48 h-48 border-l-2 border-r-2 border-t-2 border-yellow-400/50 rotate-0"></div>
              <div className="w-48 h-48 border-l-2 border-r-2 border-t-2 border-yellow-400/50 rotate-180 absolute top-0 left-0"></div>
              
              {/* Middle triangle */}
              <div className="w-36 h-36 border-l-2 border-r-2 border-t-2 border-yellow-400/40 rotate-45 absolute top-6 left-6"></div>
              <div className="w-36 h-36 border-l-2 border-r-2 border-t-2 border-yellow-400/40 rotate-[225deg] absolute top-6 left-6"></div>
              
              {/* Inner triangle */}
              <div className="w-24 h-24 border-l-2 border-r-2 border-t-2 border-yellow-400/30 rotate-90 absolute top-12 left-12"></div>
              <div className="w-24 h-24 border-l-2 border-r-2 border-t-2 border-yellow-400/30 rotate-[270deg] absolute top-12 left-12"></div>
            </div>
            
            {/* Circles */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-yellow-400/30 rounded-full w-40 h-40"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-yellow-400/20 rounded-full w-32 h-32"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-yellow-400/10 rounded-full w-24 h-24"></div>
            
            {/* Lotus petals */}
            {[...Array(8)].map((_, i) => {
              const angle = (i * Math.PI * 2) / 8;
              const x = 50 + Math.cos(angle) * 40;
              const y = 50 + Math.sin(angle) * 40;
              return (
                <div 
                  key={i}
                  className="absolute w-6 h-6 border-t-2 border-l-2 border-yellow-400/40 rounded-tl-full"
                  style={{
                    top: `${y}%`,
                    left: `${x}%`,
                    transform: `translate(-50%, -50%) rotate(${i * 45}deg)`
                  }}
                ></div>
              );
            })}
          </div>
        );
      case 'kurma':
        return (
          <div className="relative w-64 h-64">
            {/* Kurma Yantra - Turtle Yantra */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-blue-400/50 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-24 border-2 border-blue-400/40 rounded-tl-full rounded-tr-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-16 border-2 border-blue-400/30 rounded-tl-full rounded-tr-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-400 rounded-full"></div>
          </div>
        );
      case 'anahata':
        return (
          <div className="relative w-64 h-64">
            {/* Anahata Yantra - Heart Yantra */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-green-400/50 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-green-400/40 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-green-400/30 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-green-400/20 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-green-400 rounded-full"></div>
          </div>
        );
      default:
        return (
          <div className="relative w-64 h-64">
            {/* Default Sri Yantra */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full"></div>
          </div>
        );
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto p-6">
      <div className="relative aspect-square bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-xl border border-purple-500/30 p-8">
        {/* Yantra container */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Rotating yantra */}
          <div className={`relative ${isRotating ? 'yantra-rotate' : ''}`}>
            {renderYantra()}
          </div>
        </div>
        
        {/* Yantra title and description */}
        <div className="mt-6 text-center">
          <h3 className="text-xl font-semibold text-foreground">
            {yantraType === 'sri' && 'Sri Yantra'}
            {yantraType === 'kurma' && 'Kurma Yantra'}
            {yantraType === 'anahata' && 'Anahata Yantra'}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {yantraType === 'sri' && 'Sacred Geometry of the Universe'}
            {yantraType === 'kurma' && 'Turtle Yantra for Stability and Longevity'}
            {yantraType === 'anahata' && 'Heart Yantra for Love and Compassion'}
          </p>
        </div>
      </div>
      
      {/* Yantra type selector */}
      <div className="mt-4 flex justify-center space-x-2">
        <button 
          onClick={() => setYantraType('sri')}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            yantraType === 'sri' 
              ? 'bg-purple-500/30 border border-purple-500/50' 
              : 'bg-purple-500/10 hover:bg-purple-500/20'
          }`}
        >
          Sri
        </button>
        <button 
          onClick={() => setYantraType('kurma')}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            yantraType === 'kurma' 
              ? 'bg-blue-500/30 border border-blue-500/50' 
              : 'bg-blue-500/10 hover:bg-blue-500/20'
          }`}
        >
          Kurma
        </button>
        <button 
          onClick={() => setYantraType('anahata')}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            yantraType === 'anahata' 
              ? 'bg-green-500/30 border border-green-500/50' 
              : 'bg-green-500/10 hover:bg-green-500/20'
          }`}
        >
          Anahata
        </button>
      </div>
      
      {/* Toggle rotation */}
      <div className="mt-4 flex justify-center">
        <button 
          onClick={() => setIsRotating(!isRotating)}
          className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-sm transition-colors"
        >
          {isRotating ? 'Pause Sacred Rotation' : 'Activate Sacred Rotation'}
        </button>
      </div>
    </div>
  );
};

export default SacredYantra;