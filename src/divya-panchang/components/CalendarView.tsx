import React, { useState, useEffect } from 'react';
import { generatePanchangData } from '../services/panchangService';
import { MonthData, PanchangDay } from '../types';
import PanchangCell from './PanchangCell';
import DetailModal from './DetailModal';

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthData, setMonthData] = useState<MonthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<PanchangDay | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await generatePanchangData(
          currentDate.getFullYear(),
          currentDate.getMonth()
        );
        setMonthData(data);
      } catch (err) {
        setError('Failed to load calendar data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const handleDayClick = (day: PanchangDay) => {
    setSelectedDay(day);
  };

  const handleCloseModal = () => {
    setSelectedDay(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-center">
        <p className="text-red-300">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-700 hover:bg-red-600 rounded text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!monthData) {
    return <div>No data available</div>;
  }

  // Calculate padding for the first day of the month
  const startPadding = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  // Create padding cells
  const paddingCells = Array.from({ length: startPadding }).map((_, index) => (
    <div key={`pad-${index}`} className="border-r border-b border-red-900/30 bg-[#1a1817] min-h-[80px] md:min-h-[140px]" />
  ));

  // Create day cells
  const dayCells = monthData.days.map((day) => (
    <PanchangCell key={day.date} day={day} onClick={handleDayClick} />
  ));

  return (
    <div className="calendar-container">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6 p-4 bg-[#1c1917] rounded-lg border border-red-900/30">
        <button 
          onClick={handlePrevMonth}
          className="px-4 py-2 bg-red-900/50 hover:bg-red-800 rounded-lg transition-colors"
        >
          ← Previous
        </button>
        <h2 className="text-2xl font-bold text-white">
          {monthData.monthName} {monthData.year} (Samvat {monthData.samvat})
        </h2>
        <button 
          onClick={handleNextMonth}
          className="px-4 py-2 bg-red-900/50 hover:bg-red-800 rounded-lg transition-colors"
        >
          Next →
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-0 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center p-2 font-bold text-red-500 border border-red-900/30 bg-[#1a1817]">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0 border-t border-l border-red-900/30 rounded-lg overflow-hidden">
        {paddingCells}
        {dayCells}
      </div>

      {/* Detail Modal */}
      {selectedDay && (
        <DetailModal 
          day={selectedDay} 
          onClose={handleCloseModal} 
          monthName={monthData.monthName}
          year={monthData.year}
        />
      )}
    </div>
  );
};

export default CalendarView;