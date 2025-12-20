import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle, Circle, Zap, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { generateCalendarMonth, getMonthName, getWeekdayNames } from '@/services/calendarService';
import { CalendarMonthData, CalendarDay } from '@/types/calendar';
import { GlassMorphismContainer, TransparentGlassMorphismContainer, SacredCircuitPattern, CornerBracket } from '@/components/design/SadhanaDesignComponents';
import Layout from '@/components/Layout';

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
        user.id.toString()
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
    
    return (
      <div 
        key={index} 
        className={`h-24 sm:h-28 p-1 sm:p-2 cursor-pointer transition-all duration-300 rounded-lg sm:rounded-xl shadow-lg relative overflow-hidden ${
          isSelected 
            ? 'ring-2 ring-yellow-500 bg-gradient-to-br from-yellow-500/30 to-yellow-700/20 scale-105 shadow-yellow-500/30' 
            : isSadhanaStart || isSadhanaEnd
              ? 'border-2 border-purple-500 bg-gradient-to-br from-purple-900/40 to-black/30 hover:from-purple-800/50 hover:to-black/40 hover:scale-102'
              : day.isToday 
                ? 'border border-blue-500 bg-gradient-to-br from-blue-500/30 to-blue-700/20 shadow-blue-500/20' 
                : day.isCurrentMonth
                  ? 'border border-red-900/50 bg-gradient-to-br from-red-900/40 to-black/30 hover:from-red-800/50 hover:to-black/40 hover:scale-102'
                  : 'border border-gray-800 bg-gradient-to-br from-gray-900/40 to-black/20 text-gray-600'
        }`}
        onClick={() => setSelectedDay(day)}
      >
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
        
        <div className="flex justify-between items-start relative z-10">
          <span className={`text-base sm:text-lg font-bold ${
            day.isToday ? 'text-blue-400' : 
            day.isCurrentMonth ? 'text-gray-200' : 'text-gray-600'
          }`}>
            {day.dayNumber}
          </span>
          <div className="flex gap-1">
            {isCompleted && (
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 drop-shadow-lg" />
            )}
            {(isSadhanaStart || isSadhanaEnd) && (
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-purple-500 shadow-lg" title="Sadhana Start/End Date" />
            )}
            {hasFestivals && (
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 shadow-lg" title={`${day.festivals?.length} festival(s)`} />
            )}
          </div>
        </div>
        
        <div className="mt-1 sm:mt-2 flex flex-col gap-1 relative z-10">
          {isCompleted && day.sadhanaData && (
            <div className="flex flex-wrap gap-1">
              {day.sadhanaData.sadhanaIds.slice(0, 2).map((id, idx) => (
                <div 
                  key={idx} 
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-500 shadow-sm"
                  title={`Sadhana: ${id}`}
                />
              ))}
              {day.sadhanaData.sadhanaIds.length > 2 && (
                <div className="text-[10px] sm:text-xs text-gray-400">+{day.sadhanaData.sadhanaIds.length - 2}</div>
              )}
            </div>
          )}
          
          {hasFestivals && (
            <div className="mt-1">
              <div className="text-[10px] sm:text-xs text-red-300 font-medium truncate" title={day.festivals?.join(', ')}>
                {day.festivals?.[0]}
                {day.festivals && day.festivals.length > 1 && (
                  <span className="text-red-400 hidden sm:inline"> (+{day.festivals.length - 1})</span>
                )}
              </div>
            </div>
          )}
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={(e) => {
              // Close modal when clicking on the backdrop
              if (e.target === e.currentTarget) {
                setSelectedDay(null);
              }
            }}
          >
            <div className="relative max-w-md w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-red-900/30 bg-gradient-to-br from-red-900/15 to-black/25 shadow-2xl animate-scale-in">
              {/* Sacred Circuit Pattern Overlay */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <SacredCircuitPattern color="#DC143C" />
              </div>
              
              {/* Corner Brackets */}
              <CornerBracket position="top-left" color="#FFD700" />
              <CornerBracket position="top-right" color="#FFD700" />
              <CornerBracket position="bottom-left" color="#FFD700" />
              <CornerBracket position="bottom-right" color="#FFD700" />
              
              <div className="relative z-10 p-4 sm:p-6">
                <div className="flex justify-between items-start mb-4 pb-3 border-b border-red-900/30">
                  <h3 className="text-xl sm:text-2xl font-bold text-yellow-400">
                    {new Date(selectedDay.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <button 
                    onClick={() => setSelectedDay(null)}
                    className="p-1 sm:p-2 rounded-lg hover:bg-red-900/40 transition-all duration-300 border border-red-800/50"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-white" />
                  </button>
                </div>
                
                <div className="mt-2">
                  <div className="space-y-4 sm:space-y-5">
                    {selectedDay.sadhanaData?.completed ? (
                      <div className="space-y-3 sm:space-y-4 bg-gradient-to-r from-purple-900/30 to-black/20 p-3 sm:p-5 rounded-lg sm:rounded-xl border border-purple-800/30 shadow-lg relative overflow-hidden">
                        {/* Sacred Circuit Pattern Overlay */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none">
                          <SacredCircuitPattern color="#DC143C" />
                        </div>
                        
                        {/* Corner Brackets */}
                        <CornerBracket position="top-left" color="#FFD700" />
                        <CornerBracket position="top-right" color="#FFD700" />
                        <CornerBracket position="bottom-left" color="#FFD700" />
                        <CornerBracket position="bottom-right" color="#FFD700" />
                        
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 drop-shadow-lg" />
                            <span className="font-bold text-base sm:text-lg text-green-400">Sadhana Completed</span>
                          </div>
                          
                          <div className="bg-black/30 p-3 sm:p-4 rounded-lg sm:rounded-lg border border-purple-900/40 mt-3 sm:mt-4">
                            <h4 className="font-bold text-purple-400 mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-1 sm:gap-2">
                              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                              Practices Done
                            </h4>
                            <div className="space-y-2 sm:space-y-3">
                              {selectedDay.sadhanaData.sadhanaIds.map((id, index) => (
                                <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-purple-900/20 to-black/30 rounded-lg sm:rounded-lg border border-purple-800/30 hover:from-purple-800/30 hover:to-black/40 transition-all duration-300 relative overflow-hidden">
                                  {/* Sacred Circuit Pattern Overlay */}
                                  <div className="absolute inset-0 opacity-5 pointer-events-none">
                                    <SacredCircuitPattern color="#DC143C" />
                                  </div>
                                  
                                  {/* Corner Brackets */}
                                  <CornerBracket position="top-left" color="#FFD700" />
                                  <CornerBracket position="top-right" color="#FFD700" />
                                  <CornerBracket position="bottom-left" color="#FFD700" />
                                  <CornerBracket position="bottom-right" color="#FFD700" />
                                  
                                  <div className="relative z-10 flex items-center gap-2 sm:gap-3 w-full">
                                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                                    <span className="text-gray-200 text-sm sm:text-base">Sadhana Practice #{id.split('-')[1]}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 sm:py-6 bg-gradient-to-r from-gray-900/30 to-black/20 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-gray-800/30 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-5 pointer-events-none">
                          <SacredCircuitPattern color="#DC143C" />
                        </div>
                        
                        {/* Corner Brackets */}
                        <CornerBracket position="top-left" color="#FFD700" />
                        <CornerBracket position="top-right" color="#FFD700" />
                        <CornerBracket position="bottom-left" color="#FFD700" />
                        <CornerBracket position="bottom-right" color="#FFD700" />
                        
                        <div className="relative z-10">
                          <Circle className="w-8 h-8 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-2 sm:mb-3" />
                          <p className="text-gray-400 text-base sm:text-lg mb-2">No sadhana completed on this day</p>
                          <button className="mt-2 sm:mt-3 px-4 py-2 sm:px-5 sm:py-2 bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 rounded-lg sm:rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:scale-105 border border-purple-600/50">
                            Mark as Completed
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {selectedDay.festivals && selectedDay.festivals.length > 0 && (
                      <div className="bg-gradient-to-r from-red-900/20 to-black/20 p-3 sm:p-5 rounded-lg sm:rounded-xl border border-red-800/30 shadow-lg relative overflow-hidden">
                        {/* Sacred Circuit Pattern Overlay */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none">
                          <SacredCircuitPattern color="#DC143C" />
                        </div>
                        
                        {/* Corner Brackets */}
                        <CornerBracket position="top-left" color="#FFD700" />
                        <CornerBracket position="top-right" color="#FFD700" />
                        <CornerBracket position="bottom-left" color="#FFD700" />
                        <CornerBracket position="bottom-right" color="#FFD700" />
                        
                        <div className="relative z-10">
                          <h4 className="font-bold text-red-400 mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-1 sm:gap-2">
                            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-500 shadow-lg"></div>
                            Festivals
                          </h4>
                          <div className="space-y-2">
                            {selectedDay.festivals.map((festival, index) => (
                              <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-black/30 rounded-lg sm:rounded-lg border border-red-900/30 hover:bg-red-900/20 transition-all duration-300 relative overflow-hidden">
                                {/* Sacred Circuit Pattern Overlay */}
                                <div className="absolute inset-0 opacity-5 pointer-events-none">
                                  <SacredCircuitPattern color="#DC143C" />
                                </div>
                                
                                {/* Corner Brackets */}
                                <CornerBracket position="top-left" color="#FFD700" />
                                <CornerBracket position="top-right" color="#FFD700" />
                                <CornerBracket position="bottom-left" color="#FFD700" />
                                <CornerBracket position="bottom-right" color="#FFD700" />
                                
                                <div className="relative z-10 flex items-center gap-2 sm:gap-3 w-full">
                                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 shadow-sm"></div>
                                  <span className="text-gray-200 font-medium text-sm sm:text-base">{festival}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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