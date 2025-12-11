import React from 'react';
import { Car, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userName = user.name || 'User';

  // Generate initials safely
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    const first = parts[0]?.charAt(0).toUpperCase() || '';
    const second = parts[1]?.charAt(0).toUpperCase() || '';
    return first + second;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">

      {/* Header */}
      <header className="w-full bg-black bg-opacity-30 backdrop-blur-md border-b border-purple-500 border-opacity-30 px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Car className="text-pink-400" size={32} />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            SmartRide
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition font-medium"
          >
            Dashboard
          </button>

          <div className="flex items-center space-x-2">
            {/* User Initials */}
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
              {getInitials(userName)}
            </div>

            {/* Full Name */}
            <span className="text-white font-medium">{userName}</span>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-white hover:bg-opacity-10 rounded text-white"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 flex justify-center items-center">
        <div className="w-full max-w-3xl bg-black bg-opacity-40 backdrop-blur-md rounded-2xl shadow-2xl p-10 border border-purple-500 border-opacity-30 text-center">

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-purple-700 bg-opacity-30 flex items-center justify-center border border-purple-400 border-opacity-30">
              <Car className="text-pink-300" size={38} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Smart Ride Sharing System
          </h1>

          {/* Subtitle */}
          <p className="text-purple-200 mb-8 text-lg leading-relaxed">
            Travel together, save costs, and enjoy a smoother journey with people going your way.
          </p>

          {/* Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
