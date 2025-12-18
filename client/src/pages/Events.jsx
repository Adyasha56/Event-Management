import EventList from '../components/events/EventList';

const Events = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-[--color-dark] mb-8">
        All Events
      </h1>
      <EventList />
    </div>
  );
};

export default Events;