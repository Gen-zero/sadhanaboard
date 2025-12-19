import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle, Circle, Zap, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { generateCalendarMonth, getMonthName, getWeekdayNames } from '@/services/calendarService';
import { CalendarMonthData, CalendarDay } from '@/types/calendar';
import { GlassMorphismContainer, TransparentGlassMorphismContainer, SacredCircuitPattern, CornerBracket } from '@/components/design/SadhanaDesignComponents';
import Layout from '@/components/Layout';
import SadhanaCompletionMarker from '@/components/SadhanaCompletionMarker';

const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState<CalendarMonthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  const loadCalendarData = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await generateCalendarMonth(
        currentDate.getMonth(),
        currentDate.getFullYear(),
        user.id
      );
      setCalendarData(data);
    } catch (error) {
      console.error('Failed to load calendar data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentDate, user]);

  useEffect(() => {
    loadCalendarData();
  }, [loadCalendarData]);

  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() + direction, 1);
      return newDate;
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const renderCalendarDay = (day: CalendarDay, index: number) => {
    const isSelected = selectedDay?.date === day.date;
    const isCompleted = day.sadhanaData?.completed;
    const hasFestivals = day.festivals && day.festivals.length > 0;
    
    // Check if this day is a Sadhana start or end date
    const isSadhanaStart = day.sadhanaData?.sadhanaIds.some(id => id.startsWith('start-'));
    const isSadhanaEnd = day.sadhanaData?.sadhanaIds.some(id => id.startsWith('end-'));
    
    // Theme logic: Dark stone backgrounds, Red for special days
    const bgColor = isSadhanaStart || isSadhanaEnd ? 'bg-[#1a0505]' : 'bg-[#1c1917]'; // Deepest red-black vs Dark stone
    const borderColor = 'border-red-900/30';
    
    // Text Colors
    const dateColor = isSadhanaStart || isSadhanaEnd ? 'text-red-600 group-hover:text-red-500' : 'text-stone-200 group-hover:text-white'; // Blood red or Bone white
    const tithiColor = 'text-stone-400 group-hover:text-stone-300';
    const subTextColor = 'text-stone-500 group-hover:text-stone-400';
    
    return (
      <div 
        key={index} 
        className={`
          relative border-r border-b ${borderColor} min-h-[80px] md:min-h-[140px] p-1 flex flex-col justify-between 
          ${bgColor} transition-all duration-300 ease-out cursor-pointer group overflow-hidden
          hover:z-20 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:border-red-700/60
          hover:bg-[#251f1d]
          ${isSelected ? 'ring-2 ring-yellow-500 scale-105 shadow-yellow-500/30 z-20' : ''}
        `}
        onClick={() => setSelectedDay(day)}
      >
        {/* Background decoration (faint skull watermark) - Z-0 */}
        <div className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl md:text-6xl pointer-events-none grayscale transition-all duration-700 ease-in-out z-0
          ${(isSadhanaStart || isSadhanaEnd) ? 'opacity-[0.05] group-hover:opacity-[0.15] group-hover:scale-125 group-hover:rotate-12' : 'opacity-0'}
        `}>
          💀
        </div>
        
        {/* Top Row: Tithi & Paksha - Z-10 */}
        <div className={`relative z-10 flex justify-between items-start text-[9px] md:text-[10px] leading-tight font-medium ${tithiColor} uppercase transition-colors`}>
          <span className="w-full md:w-2/3 truncate">
            {isSadhanaStart ? 'Sadhana Start' : isSadhanaEnd ? 'Sadhana End' : ''}
          </span>
          <span className="hidden md:inline opacity-60 text-xs group-hover:opacity-100 transition-opacity">
            {isSadhanaStart || isSadhanaEnd ? 'ॐ' : ''}
          </span>
        </div>
        
        {/* Main Content: Date - Responsive sizing - Z-10 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full z-10">
          <span className={`text-xl sm:text-2xl md:text-4xl font-bold font-serif ${dateColor} drop-shadow-lg transition-all duration-300 group-hover:scale-110 block`}>
            {day.dayNumber}
          </span>
        </div>
        
        {/* Festival/Sadhana Indicators - Z-20 */}
        {/* Mobile: Simple indicator */}
        {(hasFestivals || isSadhanaStart || isSadhanaEnd) && (
          <div className="md:hidden absolute bottom-1 right-1 z-20">
            <span className="text-[10px] animate-pulse">
              {hasFestivals ? '🌺' : isSadhanaStart || isSadhanaEnd ? 'ॐ' : ''}
            </span>
          </div>
        )}
        
        {/* Desktop: Full List */}
        {(hasFestivals || isSadhanaStart || isSadhanaEnd) && (
          <div className="hidden md:flex absolute top-8 right-1 flex-col items-end gap-1 z-20">
            {hasFestivals && day.festivals?.slice(0, 2).map((fest, idx) => (
              <div key={idx} className="bg-red-900/90 border border-red-700 text-red-100 text-[9px] px-1.5 py-0.5 rounded-sm shadow-black shadow-md max-w-[85px] truncate text-right flex items-center gap-1 hover:bg-red-700 transition-colors">
                {fest} <span className="animate-pulse">🌺</span>
              </div>
            ))}
            {(isSadhanaStart || isSadhanaEnd) && (
              <div className="bg-purple-900/90 border border-purple-700 text-purple-100 text-[9px] px-1.5 py-0.5 rounded-sm shadow-black shadow-md max-w-[85px] truncate text-right flex items-center gap-1 hover:bg-purple-700 transition-colors">
                {isSadhanaStart ? 'Start' : 'End'} <span className="animate-pulse">ॐ</span>
              </div>
            )}
          </div>
        )}
        
        {/* Bottom Content Container - Desktop Only - Z-10 */}
        <div className="hidden md:block mt-auto z-10 relative">
          {/* Completion Status */}
          <div className={`flex justify-between text-[10px] ${subTextColor} font-mono mb-1 transition-colors`}>
            <span className="flex items-center gap-1 group-hover:text-green-600/90">
              <span className="text-green-600/70">
                {isCompleted ? '✓' : '○'}
              </span>
              {isCompleted ? 'Done' : 'Pending'}
            </span>
            <span className="flex items-center gap-1 group-hover:text-purple-500/90">
              {day.isToday ? 'Today' : ''}
              <span className="text-purple-700/70">
                {day.isToday ? '★' : ''}
              </span>
            </span>
          </div>
          
          {/* Sadhana Completion Markers */}
          {day.sadhanaData?.sadhanaIds && day.sadhanaData.sadhanaIds.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {day.sadhanaData.sadhanaIds
                .filter(id => !id.startsWith('start-') && !id.startsWith('end-'))
                .map((sadhanaId, idx) => (
                  <SadhanaCompletionMarker 
                    key={`${sadhanaId}-${day.date}`}
                    sadhanaId={sadhanaId}
                    date={day.date}
                  />
                ))
              }
            </div>
          )}
          
          {/* Additional Info */}
          <div className={`border-t border-red-900/30 pt-1 text-[10px] text-center ${subTextColor} leading-tight transition-colors group-hover:border-red-700/50`}>
            <div className="flex items-center justify-center gap-1 font-semibold text-stone-400 group-hover:text-stone-200">
              <span className="group-hover:tracking-wider transition-all duration-300">
                {hasFestivals ? `${day.festivals?.length} Festival${day.festivals && day.festivals.length > 1 ? 's' : ''}` : ''}
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 text-[9px]">
              <span>
                {isSadhanaStart || isSadhanaEnd ? (isSadhanaStart ? 'Start Date' : 'End Date') : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedDay) {
        setSelectedDay(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedDay]);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in w-full">
        <style>
          {`
            @keyframes scaleIn {
              from {
                transform: scale(0.9);
                opacity: 0;
              }
              to {
                transform: scale(1);
                opacity: 1;
              }
            }
            
            .animate-scale-in {
              animation: scaleIn 0.2s ease-out forwards;
            }
          `}
        </style>
        <TransparentGlassMorphismContainer>
          <div className="mb-4 sm:mb-8 relative overflow-hidden rounded-xl sm:rounded-2xl">
            {/* Sacred Circuit Pattern Overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <SacredCircuitPattern color="#DC143C" />
            </div>
            
            {/* Corner Brackets - hidden on mobile */}
            <div className="hidden sm:block">
              <CornerBracket position="top-left" color="#FFD700" />
              <CornerBracket position="top-right" color="#FFD700" />
              <CornerBracket position="bottom-left" color="#FFD700" />
              <CornerBracket position="bottom-right" color="#FFD700" />
            </div>
            
            <div className="relative z-10 p-4 sm:p-6">
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-3">
                <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
                <span>Your Sadhana Calendar</span>
              </h1>
              <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
                Track your daily spiritual practices and maintain your streak
              </p>
            </div>
          </div>

        {/* Controls */}
        <GlassMorphismContainer className="border border-red-900/30 p-4 sm:p-6 mb-4 sm:mb-6 bg-gradient-to-r from-red-900/20 to-black/30">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <button 
                onClick={() => navigateMonth(-1)}
                className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-900/50 to-black/40 hover:from-red-800/60 hover:to-black/50 transition-all duration-300 border border-red-800/50 shadow-lg hover:scale-105 flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              </button>
              
              <h2 className="text-xl sm:text-2xl font-bold min-w-[150px] sm:min-w-[200px] text-center bg-gradient-to-r from-yellow-500/20 to-red-500/20 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-red-900/30">
                {formatDate(currentDate)}
              </h2>
              
              <button 
                onClick={() => navigateMonth(1)}
                className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-900/50 to-black/40 hover:from-red-800/60 hover:to-black/50 transition-all duration-300 border border-red-800/50 shadow-lg hover:scale-105 flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              </button>
              
              <button 
                onClick={() => {
                  setCurrentDate(new Date());
                  loadCalendarData();
                }}
                className="px-3 py-2 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 transition-all duration-300 text-xs sm:text-sm font-medium shadow-lg hover:scale-105 border border-red-600/50"
              >
                <span className="hidden xs:inline sm:inline">Today</span>
                <span className="xs:hidden sm:hidden">T</span>
              </button>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm bg-black/30 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-red-900/30">
                <div className="flex items-center gap-1">
                  <Circle className="w-2 h-2 sm:w-3 sm:h-3 text-green-500" />
                  <span className="text-gray-300 hidden xs:inline">Completed</span>
                  <span className="text-gray-300 xs:hidden">✔</span>
                </div>
                <div className="flex items-center gap-1">
                  <Circle className="w-2 h-2 sm:w-3 sm:h-3 text-gray-600" />
                  <span className="text-gray-300 hidden xs:inline">Incomplete</span>
                  <span className="text-gray-300 xs:hidden">○</span>
                </div>
              </div>
            </div>
          </div>
        </GlassMorphismContainer>

        {/* Calendar Grid */}
        <GlassMorphismContainer className="border border-red-900/30 p-3 sm:p-6 bg-gradient-to-br from-red-900/10 to-black/20">
          {loading ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-3 sm:mt-4 text-gray-400 text-base sm:text-lg">Loading calendar...</p>
            </div>
          ) : calendarData ? (
            <>
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-3">
                {getWeekdayNames().map(day => (
                  <div key={day} className="text-center py-2 sm:py-3 text-xs sm:text-sm font-bold text-yellow-400 bg-black/30 rounded-lg sm:rounded-xl border border-red-900/30 shadow-inner relative overflow-hidden">
                    {/* Sacred Circuit Pattern Overlay */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none">
                      <SacredCircuitPattern color="#DC143C" />
                    </div>
                    
                    {/* Corner Brackets - hidden on mobile */}
                    <div className="hidden sm:block">
                      <CornerBracket position="top-left" color="#FFD700" />
                      <CornerBracket position="top-right" color="#FFD700" />
                      <CornerBracket position="bottom-left" color="#FFD700" />
                      <CornerBracket position="bottom-right" color="#FFD700" />
                    </div>
                    
                    <div className="relative z-10">{day.charAt(0)}</div>
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {calendarData.days.map((day, index) => 
                  renderCalendarDay(day, index)
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-400 text-base sm:text-lg">No calendar data available</p>
            </div>
          )}
        </GlassMorphismContainer>

        {/* Modal for Selected Day Details */}
        {selectedDay && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={(e) => {
              // Close modal when clicking on the backdrop
              if (e.target === e.currentTarget) {
                setSelectedDay(null);
              }
            }}
          >
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
                  onClick={() => setSelectedDay(null)}
                  className="absolute top-3 right-3 md:top-4 md:right-4 text-red-500 hover:text-red-300 transition-colors transform hover:rotate-90 duration-300 z-20 bg-black/50 rounded-full p-1"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                
                <div className="flex justify-between items-end">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl md:text-2xl animate-bounce" style={{animationDuration: '2s'}}>ॐ</span>
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-red-500 tracking-wider drop-shadow-md">
                        {selectedDay.dayNumber} {getMonthName(new Date(selectedDay.date).getMonth())} {new Date(selectedDay.date).getFullYear()}
                      </h2>
                    </div>
                    <p className="text-stone-400 uppercase tracking-widest text-[10px] md:text-xs font-semibold pl-1">
                      {new Date(selectedDay.date).toLocaleDateString('en-US', { weekday: 'long' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg md:text-xl text-stone-300">
                      {selectedDay.sadhanaData?.sadhanaDetails && selectedDay.sadhanaData.sadhanaDetails.length > 0 
                        ? `${selectedDay.sadhanaData.sadhanaDetails.length} Sadhana${selectedDay.sadhanaData.sadhanaDetails.length > 1 ? 's' : ''}` 
                        : 'No Sadhanas'}
                    </div>
                    <div className="text-xs md:text-sm text-red-400 italic">
                      {selectedDay.isToday ? 'Today' : ''}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4 md:p-6 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]">
                
                {selectedDay.festivals && selectedDay.festivals.length > 0 && (
                  <div className="mb-6 p-4 bg-red-950/30 border border-red-900/50 rounded-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-1 opacity-10 text-4xl group-hover:scale-125 transition-transform duration-500">🌺</div>
                    <h3 className="text-red-500 font-bold uppercase text-xs tracking-[0.2em] mb-3">Rituals & Festivals</h3>
                    <div className="flex flex-wrap gap-2 relative z-10">
                      {selectedDay.festivals.map((f, i) => (
                        <span key={i} className="bg-red-900/80 text-red-50 border border-red-700 px-3 py-1 rounded-sm text-xs md:text-sm font-medium shadow-[0_2px_5px_rgba(0,0,0,0.5)]">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Sadhana Completion Status */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-stone-900/50 rounded border border-stone-800 hover:border-stone-600 transition-colors">
                    <div className="text-xs text-stone-500 uppercase font-bold mb-1">Practice Status</div>
                    <div className="text-lg md:text-xl font-mono text-stone-300">
                      {selectedDay.sadhanaData?.completed ? 'Completed' : 'Pending'}
                    </div>
                  </div>
                  <div className="p-3 bg-stone-900/50 rounded border border-stone-800 hover:border-stone-600 transition-colors">
                    <div className="text-xs text-stone-500 uppercase font-bold mb-1">Sadhana Count</div>
                    <div className="text-lg md:text-xl font-mono text-stone-300">
                      {selectedDay.sadhanaData?.sadhanaIds.length || 0}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {/* Sadhana Details */}
                  {selectedDay.sadhanaData?.sadhanaDetails && selectedDay.sadhanaData.sadhanaDetails.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-stone-800">
                      <h4 className="font-bold text-red-500 mb-2 flex items-center gap-2">
                        <span className="animate-pulse">ॐ</span> Sadhana Papers
                      </h4>
                      <div className="space-y-3">
                        {selectedDay.sadhanaData.sadhanaDetails.map((sadhana, index) => (
                          <div key={index} className="p-3 bg-stone-900/50 rounded border border-stone-800 hover:border-stone-600 transition-colors">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-bold text-stone-200">{sadhana.name}</div>
                                <div className="text-xs text-stone-500 mt-1">
                                  {sadhana.type === 'start' ? 'Start Date' : 'End Date'}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-stone-400">
                                  {new Date(sadhana.startDate).toLocaleDateString()} - {new Date(sadhana.endDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <div className={`px-2 py-1 rounded text-xs font-medium ${sadhana.type === 'start' ? 'bg-purple-900/80 text-purple-200' : 'bg-indigo-900/80 text-indigo-200'}`}>
                                {sadhana.type === 'start' ? 'Starting' : 'Ending'}
                              </div>
                              {/* Completion Marker for this Sadhana */}
                              {!sadhana.id.startsWith('start-') && !sadhana.id.startsWith('end-') && (
                                <SadhanaCompletionMarker 
                                  sadhanaId={sadhana.id}
                                  date={selectedDay.date}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Completion Actions */}
                  {!selectedDay.sadhanaData?.completed && (
                    <div className="mt-4 pt-4 border-t border-stone-800">
                      <h4 className="font-bold text-red-500 mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Mark Practice
                      </h4>
                      <button className="w-full py-3 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 rounded-lg border border-red-700/50 text-stone-100 font-medium transition-all duration-300 shadow-lg hover:shadow-red-900/30">
                        Mark as Completed
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Footer */}
              <div className="bg-[#151312] border-t border-stone-900 p-3 text-center text-[9px] md:text-[10px] text-stone-600 font-medium uppercase tracking-widest shrink-0">
                Sadhana Calendar • Jay Maa Kali
              </div>
            </div>
          </div>
        )}
        </TransparentGlassMorphismContainer>
      </div>
    </Layout>
  );
};

export default CalendarPage;