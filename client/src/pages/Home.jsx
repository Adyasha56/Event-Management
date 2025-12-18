import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[--color-dark] mb-6">
            Discover Amazing Events
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Create, share, and attend events in your community. Connect with people who share your interests.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/events"
              className="px-8 py-4 bg-[--color-blue] text-white rounded-lg hover:bg-[--color-light-blue] transition font-medium text-lg"
            >
              Browse Events
            </Link>
            
            {user ? (
              <Link
                to="/create-event"
                className="px-8 py-4 bg-white text-[--color-blue] border-2 border-[--color-blue] rounded-lg hover:bg-[--color-blue] hover:text-white transition font-medium text-lg"
              >
                Create Event
              </Link>
            ) : (
              <Link
                to="/signup"
                className="px-8 py-4 bg-white text-[--color-blue] border-2 border-[--color-blue] rounded-lg hover:bg-[--color-blue] hover:text-white transition font-medium text-lg"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-6">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-[--color-dark] mb-2">
              Easy to Create
            </h3>
            <p className="text-gray-600">
              Set up your event in minutes with our simple, intuitive interface.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-[--color-dark] mb-2">
              RSVP Management
            </h3>
            <p className="text-gray-600">
              Track attendees and manage capacity with real-time updates.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-[--color-dark] mb-2">
              Secure & Reliable
            </h3>
            <p className="text-gray-600">
              Your data is protected with industry-standard security measures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;