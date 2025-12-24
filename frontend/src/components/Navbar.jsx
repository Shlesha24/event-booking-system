import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Detects current URL
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  // Helper to check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white border-b sticky top-0 z-50">
      <Link to="/" className="text-2xl font-black text-blue-600 tracking-tighter">
        EventBooker
      </Link>

      <div className="flex items-center gap-6">
        {/* Home Link with conditional color */}
        <Link 
          to="/" 
          className={`font-bold transition-colors ${isActive('/') ? 'text-blue-600' : 'text-gray-800 hover:text-blue-600'}`}
        >
          Home
        </Link>

        {userInfo ? (
          <>
            {/* My Tickets Link with conditional color */}
            <Link 
              to="/my-tickets" 
              className={`font-bold transition-colors ${isActive('/my-tickets') ? 'text-blue-600' : 'text-gray-800 hover:text-blue-600'}`}
            >
              My Tickets
            </Link>

            {userInfo.role === 'admin' && (
              <Link 
                to="/admin" 
                className={`font-bold transition-colors ${isActive('/admin') ? 'text-orange-600' : 'text-gray-800 hover:text-orange-600'}`}
              >
                Admin Panel
              </Link>
            )}
            
            <span className="text-gray-800 font-black ml-2">Hi, {userInfo.name}</span>
            <button 
              onClick={logoutHandler}
              className="border border-red-500 text-red-500 px-4 py-1.5 rounded-lg font-bold hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-800 font-bold hover:text-blue-600">Login</Link>
            <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;