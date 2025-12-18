import { useNavigate } from 'react-router-dom';
import EventForm from '../components/events/EventForm';
import api from '../utils/api';

const CreateEvent = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    await api.post('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    navigate('/events');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[--color-dark] mb-8">
          Create New Event
        </h1>
        <EventForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default CreateEvent;