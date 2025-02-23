import React, { useState, useRef, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa';

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'Job Interview' | 'Conference' | 'Mentor Session' | 'Anniversary' | 'Event' | 'Post Schedule';
  location?: string;
}

const EventCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState<'Day' | 'Month' | 'Year'>('Month');
  const [showEventTypeSelect, setShowEventTypeSelect] = useState(false);
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Job Interview',
      date: new Date(2025, 0, 29),
      time: '4:00PM',
      type: 'Job Interview',
      location: 'Bhaskararama Hospital & Research Institute'
    },
    {
      id: '2',
      title: 'Conference',
      date: new Date(2025, 0, 2),
      time: '1:00PM',
      type: 'Conference',
      location: 'India Ophthalmology Forum: Advancing Eye...'
    }
  ]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({});
  const [selectedDayEvents, setSelectedDayEvents] = useState<{ events: Event[], position: { x: number, y: number } } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const eventTypes = [
    { type: 'Job Interview', color: 'bg-red-200 border-red-400 text-red-800' },
    { type: 'Conference', color: 'bg-green-200 border-green-400 text-green-800' },
    { type: 'Mentor Session', color: 'bg-purple-200 border-purple-400 text-purple-800' },
    { type: 'Anniversary', color: 'bg-pink-200 border-pink-400 text-pink-800' },
    { type: 'Event', color: 'bg-blue-200 border-blue-400 text-blue-800' },
    { type: 'Post Schedule', color: 'bg-orange-200 border-orange-400 text-orange-800' }
  ];

  const eventColors = {
    'Job Interview': 'bg-red-100 text-red-800',
    'Conference': 'bg-green-100 text-green-800',
    'Mentor Session': 'bg-purple-100 text-purple-800',
    'Anniversary': 'bg-pink-100 text-pink-800',
    'Event': 'bg-blue-100 text-blue-800',
    'Post Schedule': 'bg-orange-100 text-orange-800'
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  const handleEventTypeSelect = (type: Event['type']) => {
    setNewEvent({ ...newEvent, type });
    setShowEventTypeSelect(false);
    setShowAddEvent(true);
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.time && newEvent.type) {
      setEvents([...events, { id: Date.now().toString(), ...newEvent } as Event]);
      setShowAddEvent(false);
      setNewEvent({});
    }
  };

  const handleDayClick = (day: Date, events: Event[], event: React.MouseEvent) => {
    if (events.length > 0) {
      console.log(day)
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      setSelectedDayEvents({
        events,
        position: {
          x: rect.left + window.scrollX,
          y: rect.bottom + window.scrollY
        }
      });
    } else {
      setSelectedDayEvents(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setSelectedDayEvents(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg">
      <div className="flex flex-col space-y-4">
        {/* Month and Year Selection */}
        <div className="flex justify-between flex-row items-center lg:justify-between lg:space-y-0">
          <div className="flex items-center justify-between lg:justify-start lg:space-x-2">
            <div className="flex items-center space-x-2">
              <select 
                value={format(currentDate, 'MMMM')}
                onChange={(e) => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(new Date(Date.parse(`${e.target.value} 1, 2025`)).getMonth());
                  setCurrentDate(newDate);
                }}
                className="text-lg font-medium text-gray-700 border-none focus:ring-0"
              >
                {Array.from({ length: 12 }, (_, i) => new Date(2025, i, 1)).map(date => (
                  <option key={format(date, 'MMMM')} value={format(date, 'MMMM')}>
                    {format(date, 'MMMM')}
                  </option>
                ))}
              </select>
              <select
                value={format(currentDate, 'yyyy')}
                onChange={(e) => {
                  const newDate = new Date(currentDate);
                  newDate.setFullYear(parseInt(e.target.value));
                  setCurrentDate(newDate);
                }}
                className="text-lg font-medium text-gray-700 border-none focus:ring-0"
              >
                {[2024, 2025, 2026].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => setSelectedView('Day')}
              className={`px-4 py-1 rounded-full text-sm ${
                selectedView === 'Day' ? 'bg-maincl text-white' : 'bg-gray-100 text-fillc'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setSelectedView('Month')}
              className={`px-4 py-1 rounded-full text-sm ${
                selectedView === 'Month' ? 'bg-maincl text-white' : 'bg-gray-100 text-fillc'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setSelectedView('Year')}
              className={`px-4 py-1 rounded-full text-sm ${
                selectedView === 'Year' ? 'bg-maincl text-white' : 'bg-gray-100 text-fillc'
              }`}
            >
              Year
            </button>
          </div>

          <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowEventTypeSelect(true)}
                className="flex items-center space-x-1 bg-maincl text-white px-2 py-2 rounded-full hover:bg-fillc text-sm"
              >
                <FaPlus className="w-3 h-3" />
              </button>
            </div>  
            
              

        </div>

        {/* Event Type Legend */}
        <div className="flex flex-wrap gap-2 pt-4 items-center text-sm overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {eventTypes.map(({ type, color }) => (
            <div key={type} className="flex items-center space-x-1 whitespace-nowrap">
              <div className={`w-3 h-3 rounded-full ${color.replace('bg-', 'bg-')}`}></div>
              <span>{type}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mt-4 min-w-[300px] overflow-x-auto">
        {['MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT', 'SUN'].map(day => (
          <div key={day} className="text-center bg-buttonclr text-sm font-medium py-2">
            {day}
          </div>
        ))}
        {daysInMonth.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          return (
            <div
              key={index}
              onClick={(e) => handleDayClick(day, dayEvents, e)}
              className={`min-h-[80px] lg:min-h-[120px] p-1 border cursor-pointer transition-colors hover:bg-gray-50 ${
                !isSameMonth(day, currentDate)
                  ? 'bg-gray-50'
                  : isToday(day)
                  ? 'bg-blue-50'
                  : 'bg-white'
              }`}
            >
              <div className="text-right mb-2 text-sm">
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map(event => (
                  <div
                    key={event.id}
                    className={`${eventColors[event.type]} p-1 rounded text-sm`}
                  >
                    <div className="font-semibold truncate">{event.title}</div>
                    <div className="text-xs">{event.time}</div>
                    {event.location && (
                      <div className="text-xs truncate">{event.location}</div>
                    )}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Popup */}
      {selectedDayEvents && (
        <div
          ref={popupRef}
          style={{
            position: 'absolute',
            left: `${selectedDayEvents.position.x}px`,
            top: `${selectedDayEvents.position.y}px`,
            zIndex: 40,
          }}
          className="bg-white rounded-lg shadow-lg p-3 min-w-[300px] max-w-[400px]"
        >
          <div className="space-y-2">
            {selectedDayEvents.events.map(event => (
              <div
                key={event.id}
                className={`${eventColors[event.type]} p-2 rounded-lg`}
              >
                <div className="font-semibold">{event.title}</div>
                <div className="text-sm mt-1">{event.time}</div>
                {event.location && (
                  <div className="text-sm mt-1">{event.location}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Type Selection Modal */}
      {showEventTypeSelect && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Select Event Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {eventTypes.map(({ type, color }) => (
                <button
                  key={type}
                  onClick={() => handleEventTypeSelect(type as Event['type'])}
                  className={`${color} p-3 rounded-lg border text-left hover:opacity-90 transition-opacity`}
                >
                  {type}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowEventTypeSelect(false)}
              className="mt-4 w-full bg-gray-200 p-2 rounded-3xl hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Add New Event</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Title</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={newEvent.title || ''}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-1">Date</label>
                <input
                  type="date"
                  className="w-full border  text-gray-700 rounded p-2"
                  onChange={e => setNewEvent({ ...newEvent, date: new Date(e.target.value) })}
                />
              </div>
              <div>
                <label className="block mb-1">Time</label>
                <input
                  type="time"
                  className="w-full border rounded p-2"
                  onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-1">Location <span className='text-gray-500'> (optional) </span></label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={newEvent.location || ''}
                  onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddEvent}
                  className="bg-maincl text-white px-4 py-1 rounded-3xl hover:bg-blue-600"
                >
                  Add Event
                </button>
                <button
                  onClick={() => {
                    setShowAddEvent(false);
                    setNewEvent({});
                  }}
                  className="bg-gray-200 text-maincl px-4 py-1 rounded-3xl hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
