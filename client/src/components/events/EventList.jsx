import { useState, useEffect } from 'react';
import api from '../../utils/api';
import EventCard from './EventCard';
import EventDetail from './EventDetail';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/events');
      setEvents(data);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-12 text-[--color-blue]">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search events by title or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-6 py-4 rounded-xl border border-[--color-light-blue]/30 focus:outline-none focus:ring-2 focus:ring-[--color-blue] shadow-sm"
        />
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            {searchTerm ? 'No events found matching your search.' : 'No events available yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <div key={event._id} onClick={() => setSelectedEvent(event)} className="cursor-pointer">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}

      {selectedEvent && (
        <EventDetail
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onUpdate={fetchEvents}
        />
      )}
    </>
  );
};

export default EventList;