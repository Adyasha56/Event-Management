import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { formatDate, getAvailableSpots } from '../../utils/constants';

const EventDetail = ({ event, onClose, onUpdate }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasRSVP, setHasRSVP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      checkRSVP();
    }
  }, [event._id, user]);

  const checkRSVP = async () => {
    try {
      const { data } = await api.get(`/rsvp/${event._id}/check`);
      setHasRSVP(data.hasRSVP);
    } catch (err) {
      console.error('Failed to check RSVP status');
    }
  };

  const handleRSVP = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (hasRSVP) {
        await api.delete(`/rsvp/${event._id}`);
        setMessage({ type: 'success', text: 'RSVP cancelled successfully' });
        setHasRSVP(false);
      } else {
        await api.post(`/rsvp/${event._id}`);
        setMessage({ type: 'success', text: 'RSVP successful!' });
        setHasRSVP(true);
      }
      onUpdate();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to process RSVP' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await api.delete(`/events/${event._id}`);
      setMessage({ type: 'success', text: 'Event deleted successfully' });
      setTimeout(() => {
        onUpdate();
        onClose();
      }, 1000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete event' });
    }
  };

  const availableSpots = getAvailableSpots(event.capacity, event.currentAttendees);
  const isFull = availableSpots === 0;
  const isCreator = user?._id === event.creator._id;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-64 object-cover rounded-t-2xl"
            />
          ) : (
            <div className="w-full h-64 bg-[--color-light-blue]/20 flex items-center justify-center rounded-t-2xl">
              <span className="text-9xl">📅</span>
            </div>
          )}
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition"
          >
            ✕
          </button>
        </div>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-[--color-dark] mb-4">
            {event.title}
          </h2>

          {message.text && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-600'
                : 'bg-red-50 border border-red-200 text-red-600'
            }`}>
              {message.text}
            </div>
          )}

          <div className="space-y-4 mb-6 text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-xl">📝</span>
              <p>{event.description}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xl">📍</span>
              <span>{event.location}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xl">📅</span>
              <span>{formatDate(event.date)}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xl">🕐</span>
              <span>{event.time}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xl">👥</span>
              <span>
                <span className={`font-semibold ${isFull ? 'text-red-600' : 'text-[--color-blue]'}`}>
                  {availableSpots} spots available
                </span>
                <span className="text-gray-500"> (Capacity: {event.capacity})</span>
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xl">👤</span>
              <span>Created by {event.creator.name}</span>
            </div>
          </div>

          <div className="flex gap-4">
            {isCreator ? (
              <>
                <button
                  onClick={() => navigate(`/edit-event/${event._id}`)}
                  className="flex-1 py-3 bg-[--color-blue] text-white rounded-lg hover:bg-[--color-light-blue] transition font-medium"
                >
                  Edit Event
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                  Delete Event
                </button>
              </>
            ) : (
              <button
                onClick={handleRSVP}
                disabled={loading || (!hasRSVP && isFull)}
                className={`flex-1 py-3 rounded-lg transition font-medium ${
                  hasRSVP
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : isFull
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[--color-blue] hover:bg-[--color-light-blue] text-white'
                }`}
              >
                {loading ? 'Processing...' : hasRSVP ? 'Cancel RSVP' : isFull ? 'Event Full' : 'RSVP Now'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;