import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventForm from '../components/events/EventForm';
import api from '../utils/api';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const { data } = await api.get(`/events/${id}`);
      setEvent(data);
    } catch (err) {
      console.error('Failed to fetch event');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    await api.put(`/events/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    navigate('/events');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-[--color-blue] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[--color-dark] mb-8">
          Edit Event
        </h1>
        <EventForm
          onSubmit={handleSubmit}
          initialData={event}
          submitText="Update Event"
        />
      </div>
    </div>
  );
};

export default EditEvent;