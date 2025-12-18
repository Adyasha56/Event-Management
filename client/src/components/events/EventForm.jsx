import { useState } from 'react';

const EventForm = ({ onSubmit, initialData = {}, submitText = 'Create Event' }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    date: initialData.date ? initialData.date.split('T')[0] : '',
    time: initialData.time || '',
    location: initialData.location || '',
    capacity: initialData.capacity || '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(initialData.imageUrl || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (image) {
        data.append('image', image);
      }

      await onSubmit(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[--color-dark] mb-2">
          Event Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          maxLength={100}
          className="w-full px-4 py-3 rounded-lg border border-[--color-light-blue]/30 focus:outline-none focus:ring-2 focus:ring-[--color-blue]"
          placeholder="Tech Meetup 2024"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[--color-dark] mb-2">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          maxLength={2000}
          className="w-full px-4 py-3 rounded-lg border border-[--color-light-blue]/30 focus:outline-none focus:ring-2 focus:ring-[--color-blue] resize-none"
          placeholder="Tell people about your event..."
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.description.length}/2000 characters
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[--color-dark] mb-2">
            Date *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 rounded-lg border border-[--color-light-blue]/30 focus:outline-none focus:ring-2 focus:ring-[--color-blue]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[--color-dark] mb-2">
            Time *
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-[--color-light-blue]/30 focus:outline-none focus:ring-2 focus:ring-[--color-blue]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[--color-dark] mb-2">
          Location *
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-lg border border-[--color-light-blue]/30 focus:outline-none focus:ring-2 focus:ring-[--color-blue]"
          placeholder="123 Main St, City, State"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[--color-dark] mb-2">
          Capacity *
        </label>
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          required
          min={initialData.currentAttendees || 1}
          className="w-full px-4 py-3 rounded-lg border border-[--color-light-blue]/30 focus:outline-none focus:ring-2 focus:ring-[--color-blue]"
          placeholder="50"
        />
        {initialData.currentAttendees > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            Minimum capacity: {initialData.currentAttendees} (current attendees)
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-[--color-dark] mb-2">
          Event Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-4 py-3 rounded-lg border border-[--color-light-blue]/30 focus:outline-none focus:ring-2 focus:ring-[--color-blue]"
        />
        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[--color-blue] text-white rounded-lg hover:bg-[--color-light-blue] transition disabled:opacity-50 font-medium text-lg"
      >
        {loading ? 'Saving...' : submitText}
      </button>
    </form>
  );
};

export default EventForm;