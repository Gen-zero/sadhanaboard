import React from 'react';
import { PanchangDay } from '../types';

interface DetailModalProps {
  day: PanchangDay | null;
  onClose: () => void;
  monthName: string;
  year: number;
}

const DetailModal: React.FC<DetailModalProps> = ({ day, onClose, monthName, year }) => {
  if (!day) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300" onClick={onClose}>
      <div 
        className="bg-[#1c1917] w-[95%] md:w-full max-w-lg rounded-xl shadow-[0_0_40px_rgba(220,38,38,0.4)] border-2 border-red-900 overflow-hidden text-stone-200 modal-animate-in relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-red-700 z-10"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-red-700 z-10"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-red-700 z-10"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-red-700 z-10"></div>

        {/* Header - Blood Red Gradient */}
        <div className="bg-gradient-to-r from-red-950 via-black to-red-950 border-b border-red-900 p-4 md:p-6 relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 md:top-4 md:right-4 text-red-500 hover:text-red-300 transition-colors transform hover:rotate-90 duration-300 z-20 bg-black/50 rounded-full p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex justify-between items-end">
            <div>
               <div className="flex items-center gap-2 mb-1">
                 <span className="text-xl md:text-2xl animate-bounce" style={{animationDuration: '2s'}}>🔱</span>
                 <h2 className="text-2xl md:text-3xl font-serif font-bold text-red-500 tracking-wider drop-shadow-md">{day.date} {monthName}</h2>
               </div>
               <p className="text-stone-400 uppercase tracking-widest text-[10px] md:text-xs font-semibold pl-1">{day.dayOfWeek} • {year}</p>
            </div>
            <div className="text-right">
              <div className="text-lg md:text-xl text-stone-300">{day.tithi.name}</div>
              <div className="text-xs md:text-sm text-red-400 italic">{day.tithi.paksha} Paksha</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]">
          
          {day.festivals.length > 0 && (
            <div className="mb-6 p-4 bg-red-950/30 border border-red-900/50 rounded-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-1 opacity-10 text-4xl group-hover:scale-125 transition-transform duration-500">🌺</div>
              <h3 className="text-red-500 font-bold uppercase text-xs tracking-[0.2em] mb-3">Rituals & Festivals</h3>
              <div className="flex flex-wrap gap-2 relative z-10">
                {day.festivals.map((f, i) => (
                  <span key={i} className="bg-red-900/80 text-red-50 border border-red-700 px-3 py-1 rounded-sm text-xs md:text-sm font-medium shadow-[0_2px_5px_rgba(0,0,0,0.5)]">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 bg-stone-900/50 rounded border border-stone-800 hover:border-stone-600 transition-colors">
               <div className="text-xs text-stone-500 uppercase font-bold mb-1">Sunrise</div>
               <div className="text-lg md:text-xl font-mono text-stone-300">{day.sunrise}</div>
            </div>
            <div className="p-3 bg-stone-900/50 rounded border border-stone-800 hover:border-stone-600 transition-colors">
               <div className="text-xs text-stone-500 uppercase font-bold mb-1">Sunset</div>
               <div className="text-lg md:text-xl font-mono text-stone-300">{day.sunset}</div>
            </div>
          </div>

          <div className="space-y-3">
             <InfoRow label="Nakshatra" value={day.nakshatra.name} sub={day.nakshatra.endTime ? `Ends at ${day.nakshatra.endTime}` : ''} />
             <InfoRow label="Moon Sign (Rashi)" value={day.moonSign} />
             <InfoRow label="Rahu Kalam" value={day.details?.rahuKalam || 'Check local listing'} />
             
             {day.details?.description && (
               <div className="mt-4 pt-4 border-t border-stone-800">
                 <h4 className="font-bold text-red-500 mb-2 flex items-center gap-2">
                    <span className="animate-pulse">💀</span> Daily Insight
                 </h4>
                 <p className="text-stone-400 italic leading-relaxed text-sm">{day.details.description}</p>
               </div>
             )}
          </div>

        </div>

        {/* Footer */}
        <div className="bg-[#151312] border-t border-stone-900 p-3 text-center text-[9px] md:text-[10px] text-stone-600 font-medium uppercase tracking-widest shrink-0">
          Timings for New Delhi • Jay Maa Kali
        </div>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{label: string, value: string, sub?: string}> = ({label, value, sub}) => (
  <div className="flex border-b border-stone-800 pb-2 last:border-0 hover:bg-stone-900/30 transition-colors p-1 rounded">
    <span className="w-1/3 text-stone-500 font-medium text-xs md:text-sm">{label}</span>
    <div className="w-2/3">
      <div className="text-stone-300 font-semibold text-sm md:text-base">{value}</div>
      {sub && <div className="text-[10px] md:text-xs text-stone-600">{sub}</div>}
    </div>
  </div>
);

export default DetailModal;