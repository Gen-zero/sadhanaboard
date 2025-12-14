import React from 'react';
import { PanchangDay } from '../types';

interface PanchangCellProps {
  day: PanchangDay;
  onClick: (day: PanchangDay) => void;
}

const PanchangCell: React.FC<PanchangCellProps> = ({ day, onClick }) => {
  const isSunday = day.dayOfWeek.toLowerCase() === 'sunday';
  
  // Theme logic: Dark stone backgrounds, Red for Sundays/Holidays
  const bgColor = isSunday ? 'bg-[#1a0505]' : 'bg-[#1c1917]'; // Deepest red-black vs Dark stone
  const borderColor = 'border-red-900/30';
  
  // Text Colors
  const dateColor = day.isHoliday || isSunday ? 'text-red-600 group-hover:text-red-500' : 'text-stone-200 group-hover:text-white'; // Blood red or Bone white
  const tithiColor = 'text-stone-400 group-hover:text-stone-300';
  const subTextColor = 'text-stone-500 group-hover:text-stone-400';

  return (
    <div 
      onClick={() => onClick(day)}
      className={`
        relative border-r border-b ${borderColor} min-h-[80px] md:min-h-[140px] p-1 flex flex-col justify-between 
        ${bgColor} transition-all duration-300 ease-out cursor-pointer group overflow-hidden
        hover:z-20 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:border-red-700/60
        hover:bg-[#251f1d]
      `}
    >
      {/* Background decoration (faint skull watermark) - Z-0 */}
      <div className={`
        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl md:text-6xl pointer-events-none grayscale transition-all duration-700 ease-in-out z-0
        ${day.isHoliday ? 'opacity-[0.05] group-hover:opacity-[0.15] group-hover:scale-125 group-hover:rotate-12' : 'opacity-0'}
      `}>
        💀
      </div>

      {/* Top Row: Tithi & Paksha - Z-10 */}
      <div className={`relative z-10 flex justify-between items-start text-[9px] md:text-[10px] leading-tight font-medium ${tithiColor} uppercase transition-colors`}>
        <span className="w-full md:w-2/3 truncate">{day.tithi.name}</span>
        <span className="hidden md:inline opacity-60 text-xs group-hover:opacity-100 transition-opacity">
          {day.tithi.paksha === 'Shukla' ? '🌕' : '🌑'}
        </span>
      </div>

      {/* Main Content: Date - Responsive sizing - Z-10 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full z-10">
        <span className={`text-xl sm:text-2xl md:text-4xl font-bold font-serif ${dateColor} drop-shadow-lg transition-all duration-300 group-hover:scale-110 block`}>
          {day.date}
        </span>
      </div>

      {/* Festival Indicators - Z-20 */}
      {/* Mobile: Simple indicator */}
      {day.festivals.length > 0 && (
        <div className="md:hidden absolute bottom-1 right-1 z-20">
           <span className="text-[10px] animate-pulse">🌺</span>
        </div>
      )}
      
      {/* Desktop: Full List */}
      {day.festivals.length > 0 && (
        <div className="hidden md:flex absolute top-8 right-1 flex-col items-end gap-1 z-20">
           {day.festivals.map((fest, idx) => (
             <div key={idx} className="bg-red-900/90 border border-red-700 text-red-100 text-[9px] px-1.5 py-0.5 rounded-sm shadow-black shadow-md max-w-[85px] truncate text-right flex items-center gap-1 hover:bg-red-700 transition-colors">
                {fest} <span className="animate-pulse">🌺</span>
             </div>
           ))}
        </div>
      )}

      {/* Bottom Content Container - Desktop Only - Z-10 */}
      <div className="hidden md:block mt-auto z-10 relative">
        {/* Sunrise / Sunset */}
        <div className={`flex justify-between text-[10px] ${subTextColor} font-mono mb-1 transition-colors`}>
           <span className="flex items-center gap-1 group-hover:text-yellow-600/90">
             <span className="text-yellow-600/70">☀</span>
             {day.sunrise}
           </span>
           <span className="flex items-center gap-1 group-hover:text-orange-500/90">
             {day.sunset}
             <span className="text-orange-700/70">▼</span>
           </span>
        </div>

        {/* Nakshatra & Moon Sign */}
        <div className={`border-t border-red-900/30 pt-1 text-[10px] text-center ${subTextColor} leading-tight transition-colors group-hover:border-red-700/50`}>
          <div className="flex items-center justify-center gap-1 font-semibold text-stone-400 group-hover:text-stone-200">
            <span className="group-hover:tracking-wider transition-all duration-300">★ {day.nakshatra.name}</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-[9px]">
             <span>☾ {day.moonSign}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanchangCell;