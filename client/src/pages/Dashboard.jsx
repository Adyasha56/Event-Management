import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import EventCard from '../components/events/EventCard';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myEvents, setMyEvents] = useState([]);
  const [myRSVPs, setMyRSVPs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('created');

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [eventsRes, rsvpsRes] = await Promise.all([
        api.get('/events'),
        api.get('/rsvp/my-rsvps'),
      ]);

      const createdEvents = eventsRes.data.filter(
        event => event.creator?._id === user?._id
      );

      setMyEvents(createdEvents);
      setMyRSVPs(rsvpsRes.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('created')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'created'
              ? 'text-[--color-blue] border-b-2 border-[--color-blue]'
              : 'text-gray-600'
          }`}
        >
          Events I Created ({myEvents.length})
        </button>

        <button
          onClick={() => setActiveTab('attending')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'attending'
              ? 'text-[--color-blue] border-b-2 border-[--color-blue]'
              : 'text-gray-600'
          }`}
        >
          Events I'm Attending ({myRSVPs.length})
        </button>
      </div>

      {/* Created Events */}
      {activeTab === 'created' && (
        <>
          {myEvents.length === 0 ? (
            <div className="text-center">
              <p className="mb-4">You haven't created any events yet.</p>
              <button
                onClick={() => navigate('/create-event')}
                className="px-6 py-3 bg-[--color-blue] text-white rounded-lg"
              >
                Create Your First Event
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {myEvents.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Attending Events */}
      {activeTab === 'attending' && (
        <>
          {myRSVPs.length === 0 ? (
            <div className="text-center">
              <p className="mb-4">You haven't RSVP'd to any events yet.</p>
              <button
                onClick={() => navigate('/events')}
                className="px-6 py-3 bg-[--color-blue] text-white rounded-lg"
              >
                Browse Events
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {myRSVPs.map(rsvp => (
                <EventCard key={rsvp.event._id} event={rsvp.event} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
