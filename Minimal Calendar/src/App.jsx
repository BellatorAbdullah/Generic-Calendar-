import { useState, useEffect, useMemo } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  isToday 
} from 'date-fns';
import { getMonthDays } from './utils/calendarHelpers';
import './index.css';

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [inputValue, setInputValue] = useState("");

  // 1. Persistence: Load from localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) setEvents(JSON.parse(savedEvents));
  }, []);

  // 2. Persistence: Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const days = useMemo(() => getMonthDays(currentDate), [currentDate]);

  // Modal Logic
  const openModal = (dateKey) => {
    setSelectedDate(dateKey);
    setInputValue(events[dateKey] || "");
    setIsModalOpen(true);
  };

  const saveEvent = () => {
    setEvents(prev => ({ ...prev, [selectedDate]: inputValue }));
    setIsModalOpen(false);
    setInputValue("");
  };

  return (
   <div className="max-w-lg mx-auto mt-12 p-6 bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl border border-white/50 font-sans text-gray-800">
      
      {/* Header with Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors" 
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
        >
          &lt;
        </button>
        <h1 className="text-xl font-bold tracking-tight">
          {format(currentDate, 'MMMM yyyy')}
        </h1>
        <button 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors" 
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
        >
          &gt;
        </button>
      </div>

      {/* Weekday Header */}
      <div className="grid grid-cols-7 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-100 border border-gray-100 rounded-lg overflow-hidden">
        {days.map((day) => {
          const isTodayDate = isToday(day.date);
          
          return (
            <div 
              key={day.key}
              onClick={() => openModal(day.key)}
              className={`h-24 bg-white p-3 cursor-pointer transition-all duration-200 hover:bg-gray-50 flex flex-col justify-between 
                ${!day.isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}
                ${isTodayDate ? 'bg-blue-50/30' : ''}`}
            >
              <span className={`text-xs font-medium ${isTodayDate ? 'text-blue-600' : ''}`}>
                {format(day.date, 'd')}
              </span>
              <div className="flex-grow flex items-center justify-center text-2xl">
                {events[day.key] || ''}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Add Event</h2>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type an emoji..."
              className="w-full p-3 border border-gray-200 rounded-xl mb-6 outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
            <div className="flex gap-2">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="flex-1 py-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={saveEvent} 
                className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}