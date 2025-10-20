import { useState, useEffect } from 'react';

interface ChakraData {
  id: number;
  name: string;
  sanskritName: string;
  color: string;
  element: string;
  location: string;
  isActive: boolean;
  bijaMantra: string;
  description: string;
}

const ChakraVisualization = () => {
  const [activeChakra, setActiveChakra] = useState<number | null>(null);
  const [isPulsing, setIsPulsing] = useState(true);

  const chakras: ChakraData[] = [
    {
      id: 1,
      name: "Root",
      sanskritName: "Muladhara",
      color: "bg-red-500",
      element: "Earth",
      location: "Base of spine",
      isActive: true,
      bijaMantra: "Lam",
      description: "Foundation, stability, and grounding"
    },
    {
      id: 2,
      name: "Sacral",
      sanskritName: "Svadhisthana",
      color: "bg-orange-500",
      element: "Water",
      location: "Below navel",
      isActive: true,
      bijaMantra: "Vam",
      description: "Creativity, sexuality, and emotional balance"
    },
    {
      id: 3,
      name: "Solar Plexus",
      sanskritName: "Manipura",
      color: "bg-yellow-500",
      element: "Fire",
      location: "Upper abdomen",
      isActive: true,
      bijaMantra: "Ram",
      description: "Personal power, confidence, and self-esteem"
    },
    {
      id: 4,
      name: "Heart",
      sanskritName: "Anahata",
      color: "bg-green-500",
      element: "Air",
      location: "Center of chest",
      isActive: true,
      bijaMantra: "Yam",
      description: "Love, compassion, and emotional healing"
    },
    {
      id: 5,
      name: "Throat",
      sanskritName: "Vishuddha",
      color: "bg-blue-500",
      element: "Ether",
      location: "Throat",
      isActive: true,
      bijaMantra: "Ham",
      description: "Communication, self-expression, and truth"
    },
    {
      id: 6,
      name: "Third Eye",
      sanskritName: "Ajna",
      color: "bg-indigo-500",
      element: "Light",
      location: "Forehead",
      isActive: true,
      bijaMantra: "Om",
      description: "Intuition, wisdom, and spiritual insight"
    },
    {
      id: 7,
      name: "Crown",
      sanskritName: "Sahasrara",
      color: "bg-purple-500",
      element: "Thought",
      location: "Top of head",
      isActive: true,
      bijaMantra: "Om",
      description: "Spiritual connection, enlightenment, and cosmic consciousness"
    }
  ];

  // Auto-rotate active chakra
  useEffect(() => {
    if (!isPulsing) return;
    
    const interval = setInterval(() => {
      setActiveChakra(prev => {
        if (prev === null) return 1;
        return prev < 7 ? prev + 1 : 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isPulsing]);

  return (
    <div className="relative w-full max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chakra visualization column */}
        <div className="relative h-96 flex flex-col items-center justify-center">
          <div className="relative flex flex-col items-center justify-between h-full py-8">
            {chakras.map((chakra, index) => (
              <div 
                key={chakra.id}
                className={`relative flex flex-col items-center transition-all duration-500 ${
                  activeChakra === chakra.id ? 'scale-110 z-10' : 'scale-100'
                }`}
                onMouseEnter={() => {
                  setActiveChakra(chakra.id);
                  setIsPulsing(false);
                }}
                onMouseLeave={() => setIsPulsing(true)}
              >
                {/* Chakra energy circle */}
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center
                  ${chakra.color}
                  transition-all duration-300
                  shadow-lg
                  ${activeChakra === chakra.id ? 'animate-chakra-pulse' : ''}
                  relative
                `}>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/30"></div>
                  </div>
                  {/* Bija Mantra in the center */}
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                    {chakra.bijaMantra}
                  </div>
                </div>
                
                {/* Chakra label */}
                <div className="mt-2 text-center">
                  <div className="text-xs font-medium text-foreground">{chakra.name}</div>
                  <div className="text-xs text-muted-foreground">{chakra.sanskritName}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Energy flow line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 transform -translate-x-1/2 opacity-30"></div>
        </div>
        
        {/* Bija Mantras Information Panel */}
        <div className="flex flex-col justify-center">
          <div className="bg-purple-900/20 p-6 rounded-lg border border-purple-500/20 h-full">
            <h3 className="text-xl font-semibold mb-4 text-purple-300">Bija Mantras & Chakra Wisdom</h3>
            <p className="text-muted-foreground mb-4">
              Each chakra is associated with a specific Bija (seed) mantra that resonates with its energy frequency. 
              Chanting these mantras helps activate and balance the corresponding chakra.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-red-900/20 rounded">
                <span className="font-medium">Root (Muladhara)</span>
                <span className="font-mono bg-red-500/20 px-2 py-1 rounded">Lam</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-orange-900/20 rounded">
                <span className="font-medium">Sacral (Svadhisthana)</span>
                <span className="font-mono bg-orange-500/20 px-2 py-1 rounded">Vam</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-yellow-900/20 rounded">
                <span className="font-medium">Solar Plexus (Manipura)</span>
                <span className="font-mono bg-yellow-500/20 px-2 py-1 rounded">Ram</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-green-900/20 rounded">
                <span className="font-medium">Heart (Anahata)</span>
                <span className="font-mono bg-green-500/20 px-2 py-1 rounded">Yam</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-900/20 rounded">
                <span className="font-medium">Throat (Vishuddha)</span>
                <span className="font-mono bg-blue-500/20 px-2 py-1 rounded">Ham</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-indigo-900/20 rounded">
                <span className="font-medium">Third Eye (Ajna)</span>
                <span className="font-mono bg-indigo-500/20 px-2 py-1 rounded">Om</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-purple-900/20 rounded">
                <span className="font-medium">Crown (Sahasrara)</span>
                <span className="font-mono bg-purple-500/20 px-2 py-1 rounded">Om</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-purple-900/30 rounded-lg">
              <h4 className="font-semibold mb-2">How to Practice:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Sit comfortably with spine straight</li>
                <li>• Chant each Bija mantra 3-7 times</li>
                <li>• Focus on the corresponding chakra location</li>
                <li>• Breathe deeply and feel the energy flow</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chakra details panel */}
      {activeChakra && (
        <div className="mt-6 p-4 bg-secondary/30 rounded-lg border border-purple-500/20 transition-all duration-300">
          <div className="text-center">
            <h3 className="text-lg font-semibold">
              {chakras.find(c => c.id === activeChakra)?.name} Chakra ({chakras.find(c => c.id === activeChakra)?.sanskritName})
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              {chakras.find(c => c.id === activeChakra)?.description}
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm mt-2">
              <span className="bg-primary/10 px-2 py-1 rounded">
                {chakras.find(c => c.id === activeChakra)?.element}
              </span>
              <span className="bg-accent/10 px-2 py-1 rounded">
                {chakras.find(c => c.id === activeChakra)?.location}
              </span>
              <span className="bg-purple-500/10 px-2 py-1 rounded text-purple-300">
                Bija: {chakras.find(c => c.id === activeChakra)?.bijaMantra}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Toggle pulsing */}
      <div className="mt-4 flex justify-center">
        <button 
          onClick={() => setIsPulsing(!isPulsing)}
          className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-sm transition-colors"
        >
          {isPulsing ? 'Pause Energy Flow' : 'Resume Energy Flow'}
        </button>
      </div>
    </div>
  );
}

export default ChakraVisualization;