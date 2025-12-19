
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Download, Loader2, Trash2, RefreshCw, ShieldCheck, Zap, Database, CheckCircle2, Moon, Star, Sun, AlertTriangle } from 'lucide-react';
import { Region, CalendarMonthData, PanchangDay, UserLocation } from './types';
import { REGIONS_LIST, WEEKDAYS } from './constants';
import { fetchCalendarData } from './services/geminiService';

const CACHE_PREFIX = 'bharat_cal_v10_final_';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [region, setRegion] = useState<Region>(Region.MALAYALAM);
  const [calendarData, setCalendarData] = useState<CalendarMonthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<PanchangDay | null>(null);
  const [location, setLocation] = useState<UserLocation | undefined>();
  const [error, setError] = useState<string | null>(null);
  
  // Pre-loading states
  const [syncStatus, setSyncStatus] = useState<{ total: number; current: number; active: boolean }>({ total: 12, current: 0, active: false });

  const lastRequestKey = useRef<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const isPreloading = useRef<boolean>(false);

  const getCacheKey = (month: number, year: number, reg: Region, loc?: UserLocation) => {
    const locKey = loc ? `${loc.latitude.toFixed(1)}_${loc.longitude.toFixed(1)}` : 'default';
    return `${CACHE_PREFIX}${year}_${month}_${reg.replace(/\s+/g, '_')}_${locKey}`;
  };

  const saveToCache = (data: CalendarMonthData, loc?: UserLocation) => {
    if (!data.days || data.days.length < 28) return; // Don't cache invalid data
    const key = getCacheKey(data.month, data.year, data.region, loc);
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Cache full, clearing old entries');
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith(CACHE_PREFIX)) localStorage.removeItem(k);
      });
      try { localStorage.setItem(key, JSON.stringify(data)); } catch(e2) {}
    }
  };

  const loadFromCache = (month: number, year: number, reg: Region, loc?: UserLocation): CalendarMonthData | null => {
    const key = getCacheKey(month, year, reg, loc);
    const cached = localStorage.getItem(key);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as CalendarMonthData;
        if (parsed && parsed.days && parsed.days.length >= 28) return parsed;
      } catch (e) {
        localStorage.removeItem(key);
      }
    }
    return null;
  };

  const preLoadRange = useCallback(async (baseDate: Date, reg: Region, loc?: UserLocation) => {
    if (isPreloading.current) return;
    isPreloading.current = true;
    setSyncStatus({ total: 12, current: 0, active: true });

    const monthsToFetch = [];
    for (let i = -6; i <= 6; i++) {
      if (i === 0) continue; 
      const d = new Date(baseDate.getFullYear(), baseDate.getMonth() + i, 1);
      monthsToFetch.push({ month: d.getMonth() + 1, year: d.getFullYear() });
    }

    let completed = 0;
    for (const item of monthsToFetch) {
      // Check if user has changed region or view in the meantime
      if (reg !== region) break; 

      const cached = loadFromCache(item.month, item.year, reg, loc);
      if (!cached) {
        try {
          // Use a small delay to prevent overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 500));
          const data = await fetchCalendarData(item.month, item.year, reg, loc);
          saveToCache(data, loc);
        } catch (e) {
          console.error(`Preload failed for ${item.month}/${item.year}`, e);
        }
      }
      completed++;
      setSyncStatus(prev => ({ ...prev, current: completed }));
    }

    setSyncStatus(prev => ({ ...prev, active: false }));
    isPreloading.current = false;
  }, [region]);

  const loadData = useCallback(async (date: Date, reg: Region, loc?: UserLocation, force: boolean = false) => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const requestKey = getCacheKey(month, year, reg, loc);
    
    // Skip if already loading this specific key
    if (!force && lastRequestKey.current === requestKey && calendarData) return;
    
    lastRequestKey.current = requestKey;

    const cachedData = loadFromCache(month, year, reg, loc);
    if (!force && cachedData) {
      setCalendarData(cachedData);
      setLoading(false);
      setError(null);
      const today = new Date();
      if (date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
        const todayData = cachedData.days.find(d => new Date(d.date).getDate() === today.getDate());
        setSelectedDay(todayData || cachedData.days[0]);
      } else {
        setSelectedDay(cachedData.days[0]);
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchCalendarData(month, year, reg, loc);
      
      if (lastRequestKey.current === requestKey) {
        setCalendarData(data);
        saveToCache(data, loc);
        
        const today = new Date();
        if (date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
          const todayData = data.days.find(d => new Date(d.date).getDate() === today.getDate());
          setSelectedDay(todayData || data.days[0]);
        } else {
          setSelectedDay(data.days[0]);
        }

        // Start background sync after foreground is safe
        if (!isPreloading.current) {
          preLoadRange(date, reg, loc);
        }
      }
    } catch (err) {
      if (lastRequestKey.current === requestKey) {
        setError(`Failed to synchronize ${month}/${year}. Please try refreshing.`);
        setLoading(false);
      }
    } finally {
      if (lastRequestKey.current === requestKey) {
        setLoading(false);
      }
    }
  }, [calendarData, preLoadRange]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => console.warn("Using default coordinates.")
      );
    }
  }, []);

  useEffect(() => {
    loadData(currentDate, region, location);
  }, [currentDate, region, location, loadData]);

  const clearAllCache = () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    window.location.reload();
  };

  const handlePrevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRegion(e.target.value as Region);
    isPreloading.current = false; 
    setSyncStatus({ total: 12, current: 0, active: false });
  };

  const exportToCSV = () => {
    if (!calendarData) return;
    const headers = ['Date', 'Day', 'Month(Reg)', 'Tithi', 'Paksha', 'Nakshatra', 'Sunrise', 'Sunset', 'Rahu Kaalam', 'Gulika Kaalam', 'Festivals', 'Holiday'];
    const rows = calendarData.days.map(day => {
      const d = new Date(day.date);
      return [
        day.date,
        WEEKDAYS[d.getDay()],
        day.regionalMonthName || 'N/A',
        day.tithi,
        day.paksha,
        day.nakshatra,
        day.sunrise,
        day.sunset,
        day.rahuKaalam || 'N/A',
        day.gulikaKaalam || 'N/A',
        day.festivals.join(' | ') || 'None',
        day.publicHoliday || 'No'
      ];
    });
    
    const csvContent = [
      headers.join(','), 
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BharatCalendar_${region}_${currentDate.getFullYear()}_${currentDate.getMonth()+1}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isCurrentViewSaved = calendarData && 
    calendarData.month === (currentDate.getMonth() + 1) && 
    calendarData.year === currentDate.getFullYear() && 
    calendarData.region === region;

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfcf6] text-stone-800">
      <header className="bg-stone-900 text-white shadow-xl sticky top-0 z-50 px-4 py-3 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-orange-600 p-2 rounded-2xl shadow-lg rotate-3">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black font-sanskrit leading-none tracking-tight">Bharat Calendar Pro</h1>
            <div className="flex items-center gap-1.5 text-[9px] text-orange-400 uppercase tracking-widest font-black mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Drik-Ganit • Instant JSON Cache</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {syncStatus.active && (
            <div className="hidden md:flex items-center gap-2 bg-stone-800 px-3 py-1.5 rounded-xl border border-white/5 animate-in fade-in zoom-in">
              <Database className="w-3 h-3 text-orange-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-tighter text-stone-400">
                Syncing: {syncStatus.current}/{syncStatus.total}
              </span>
            </div>
          )}
          <button onClick={() => loadData(currentDate, region, location, true)} className="p-2.5 hover:bg-stone-800 rounded-2xl transition-all active:scale-95" title="Recalculate Month">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={exportToCSV} disabled={!calendarData} className="p-2.5 bg-stone-800 hover:bg-stone-700 rounded-2xl transition-all disabled:opacity-20" title="Download Verified CSV">
            <Download className="w-4 h-4 text-white" />
          </button>
          <button onClick={clearAllCache} className="p-2.5 bg-stone-800 hover:bg-red-900 rounded-2xl transition-all" title="Reset JSON Cache">
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
          <select value={region} onChange={handleRegionChange} className="bg-orange-600 border-none rounded-xl px-4 py-2 text-sm font-bold outline-none cursor-pointer focus:ring-4 focus:ring-orange-500/20 transition-all shadow-lg text-white">
            {REGIONS_LIST.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-stone-200/60">
            <button onClick={handlePrevMonth} className="p-3 hover:bg-stone-50 rounded-full transition-all active:scale-75 border border-stone-100"><ChevronLeft className="w-6 h-6 text-stone-400" /></button>
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-black capitalize text-stone-900 tracking-tighter">
                {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin text-orange-600" />}
                {!loading && isCurrentViewSaved && (
                   <div className="flex items-center gap-2 text-[10px] bg-green-50 text-green-700 px-4 py-1.5 rounded-full font-black uppercase tracking-[0.2em] shadow-sm border border-green-100 animate-in fade-in zoom-in duration-500">
                     <CheckCircle2 className="w-3.5 h-3.5" /> Verified & Cached
                   </div>
                )}
                {error && (
                  <div className="flex items-center gap-2 text-[10px] bg-red-50 text-red-700 px-4 py-1.5 rounded-full font-black uppercase tracking-[0.2em] shadow-sm border border-red-100">
                    <AlertTriangle className="w-3.5 h-3.5" /> Sync Error
                  </div>
                )}
              </div>
            </div>
            <button onClick={handleNextMonth} className="p-3 hover:bg-stone-50 rounded-full transition-all active:scale-75 border border-stone-100"><ChevronRight className="w-6 h-6 text-stone-400" /></button>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-stone-200 overflow-hidden min-h-[600px] relative transition-all duration-700">
            <div className="grid grid-cols-7 bg-stone-50 border-b border-stone-200">
              {WEEKDAYS.map(day => <div key={day} className="py-5 text-center text-[11px] font-black text-stone-400 uppercase tracking-[0.3em]">{day}</div>)}
            </div>

            {loading && (
              <div className="absolute inset-0 z-40 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center gap-10 p-12 text-center animate-in fade-in duration-300">
                <div className="relative group">
                  <div className="w-32 h-32 border-4 border-stone-100 rounded-full"></div>
                  <div className="w-32 h-32 border-4 border-orange-600 border-t-transparent rounded-full animate-spin absolute top-0 shadow-2xl shadow-orange-500/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Database className="w-10 h-10 text-orange-500 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-4 max-w-lg">
                  <h3 className="text-stone-900 font-black text-3xl tracking-tight">Accessing Cosmic Data</h3>
                  <p className="text-stone-500 text-base leading-relaxed font-medium">
                    Calculations for {region} are in progress. Results are stored locally for instant future access.
                  </p>
                </div>
              </div>
            )}

            {!loading && error && (
               <div className="absolute inset-0 z-40 bg-white flex flex-col items-center justify-center p-12 text-center">
                 <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
                 <h3 className="text-stone-900 font-black text-2xl mb-4">Sync Interrupted</h3>
                 <p className="text-stone-500 mb-8 max-w-sm">{error}</p>
                 <button onClick={() => loadData(currentDate, region, location, true)} className="bg-stone-900 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-stone-800 transition-all flex items-center gap-2">
                   <RefreshCw className="w-4 h-4" /> Retry Sync
                 </button>
               </div>
            )}

            <div className="grid grid-cols-7 border-collapse">
              {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="h-28 md:h-40 bg-stone-50/10 border-stone-100 border-r border-b"></div>
              ))}

              {calendarData?.days.map((day) => (
                <div 
                  key={day.date}
                  onClick={() => setSelectedDay(day)}
                  className={`h-28 md:h-40 p-4 border-r border-b cursor-pointer transition-all hover:bg-orange-50/40 group relative overflow-hidden
                    ${day.isPournami ? 'bg-orange-50/50' : day.isAmavasya ? 'bg-stone-50' : 'bg-white'} 
                    ${selectedDay?.date === day.date ? 'ring-4 ring-orange-600/20 z-10 shadow-2xl bg-orange-50/80' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-xl font-black leading-none ${day.publicHoliday ? 'text-red-600 underline decoration-red-200' : 'text-stone-900'}`}>
                      {new Date(day.date).getDate()}
                    </span>
                    <div className="flex gap-1.5">
                      {day.isPournami && <Moon className="w-5 h-5 text-orange-500 fill-orange-500 shadow-sm" />}
                      {day.isAmavasya && <Moon className="w-5 h-5 text-stone-900 fill-stone-900" />}
                      {day.isEkadashi && <Star className="w-5 h-5 text-amber-500 fill-amber-500" />}
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-1.5">
                    <p className="text-xs font-black text-orange-950 truncate tracking-tight">{day.tithi}</p>
                    <p className="text-[10px] font-bold text-stone-400 truncate tracking-wide uppercase">{day.nakshatra}</p>
                  </div>

                  {day.festivals && day.festivals.length > 0 && (
                    <div className="absolute bottom-4 right-4">
                      <div className="w-3 h-3 bg-orange-600 rounded-full shadow-lg border-2 border-white ring-2 ring-orange-100"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-[3rem] shadow-2xl border border-stone-200 overflow-hidden sticky top-24 group transition-all duration-500">
            <div className="bg-gradient-to-br from-stone-900 to-black p-10 text-white relative">
              <h3 className="text-2xl font-black tracking-tighter leading-none mb-3">
                {selectedDay ? new Date(selectedDay.date).toLocaleDateString('default', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Panchang Stats'}
              </h3>
              <p className="text-orange-500 text-[11px] font-black uppercase tracking-[0.4em]">
                {selectedDay?.regionalMonthName || 'Select a date'}
              </p>
            </div>

            {selectedDay ? (
              <div className="p-10 space-y-8 animate-in slide-in-from-bottom-6 duration-500">
                <div className="grid grid-cols-2 gap-5">
                  <div className="bg-stone-50 p-6 rounded-[2rem] border border-stone-100 shadow-sm">
                    <p className="text-[11px] font-black text-stone-400 uppercase tracking-widest mb-3">Tithi</p>
                    <p className="text-2xl font-black text-stone-900 leading-tight">{selectedDay.tithi}</p>
                  </div>
                  <div className="bg-stone-50 p-6 rounded-[2rem] border border-stone-100 shadow-sm">
                    <p className="text-[11px] font-black text-stone-400 uppercase tracking-widest mb-3">Nakshatra</p>
                    <p className="text-2xl font-black text-stone-900 leading-tight">{selectedDay.nakshatra}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-stone-50/50 rounded-[2rem] p-6 border border-stone-100 shadow-inner">
                  <div className="text-center">
                    <Sun className="w-7 h-7 text-amber-500 mx-auto mb-3" />
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Sunrise</p>
                    <p className="text-base font-black text-stone-900">{selectedDay.sunrise}</p>
                  </div>
                  <div className="h-16 w-[2px] bg-stone-200/50"></div>
                  <div className="text-center">
                    <Moon className="w-7 h-7 text-stone-400 mx-auto mb-3" />
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Sunset</p>
                    <p className="text-base font-black text-stone-900">{selectedDay.sunset}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <TimingRow label="Rahu Kaalam" value={selectedDay.rahuKaalam} color="text-red-600" bg="bg-red-50" border="border-red-100" />
                  <TimingRow label="Gulika Kaalam" value={selectedDay.gulikaKaalam} color="text-stone-600" bg="bg-stone-50" border="border-stone-200" />
                </div>

                {selectedDay.festivals && selectedDay.festivals.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-stone-100">
                    <h4 className="text-[12px] font-black text-stone-400 uppercase tracking-[0.4em]">Rituals & Festivals</h4>
                    {selectedDay.festivals.map((fest, idx) => (
                      <div key={idx} className="bg-orange-50/60 p-6 rounded-[2rem] border border-orange-100 flex items-start gap-5 shadow-sm">
                        <div className="w-3 h-3 bg-orange-600 rounded-full mt-1.5 shrink-0" />
                        <p className="text-base font-black text-orange-950 leading-tight">{fest}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-32 text-center opacity-30">
                <Zap className="w-20 h-20 text-stone-200 mx-auto mb-8 animate-pulse" />
                <p className="text-stone-500 text-[11px] font-black uppercase tracking-[0.5em] leading-relaxed text-center">
                  Touch a cell for verified data
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-stone-200 py-16 px-10 text-center">
        <p className="text-stone-900 text-[12px] font-black uppercase tracking-[0.8em] leading-none">Bharat Calendar Pro</p>
        <p className="text-stone-400 text-[10px] font-bold tracking-tight mt-4">Calculations based on fixed Drik-Ganit algorithms. JSON cache provides instant offline delivery.</p>
      </footer>
    </div>
  );
};

const TimingRow: React.FC<{ label: string; value: string; color: string; bg: string; border: string }> = ({ label, value, color, bg, border }) => (
  <div className={`${bg} ${border} border px-7 py-5 rounded-[1.5rem] flex justify-between items-center transition-all hover:translate-x-1`}>
    <p className={`text-[11px] font-black ${color} uppercase tracking-[0.3em]`}>{label}</p>
    <p className="text-base font-black text-stone-900">{value}</p>
  </div>
);

export default App;
