import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-[--color-light-blue]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-[--color-blue]">
            EventHub
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/events" className="text-[--color-dark] hover:text-[--color-blue] transition">
              Events
            </Link>
            
            {user ? (
              <>
                <Link to="/create-event" className="text-[--color-dark] hover:text-[--color-blue] transition">
                  Create Event
                </Link>
                <Link to="/dashboard" className="text-[--color-dark] hover:text-[--color-blue] transition">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-[--color-blue] text-white rounded-lg hover:bg-[--color-light-blue] transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-[--color-dark] hover:text-[--color-blue] transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-[--color-blue] text-white rounded-lg hover:bg-[--color-light-blue] transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;