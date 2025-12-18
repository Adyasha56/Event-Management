import { Link } from 'react-router-dom';
import { formatDate, getAvailableSpots } from '../../utils/constants';

const EventCard = ({ event }) => {
  const availableSpots = getAvailableSpots(event.capacity, event.currentAttendees);
  const isFull = availableSpots === 0;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
      <div className="aspect-video bg-[--color-light-blue]/20 overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[--color-blue]">
            <span className="text-6xl">📅</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-[--color-dark] mb-2">
          {event.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 text-sm text-gray-700 mb-4">
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🕐</span>
            <span>{event.time}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[--color-light-blue]/20">
          <div className="text-sm">
            <span className={`font-semibold ${isFull ? 'text-red-600' : 'text-[--color-blue]'}`}>
              {availableSpots} spots left
            </span>
            <span className="text-gray-500"> / {event.capacity}</span>
          </div>
          
          <Link
            to={`/events`}
            state={{ selectedEvent: event }}
            className="px-4 py-2 bg-[--color-blue] text-white rounded-lg hover:bg-[--color-light-blue] transition text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;