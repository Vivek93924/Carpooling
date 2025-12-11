// src/pages/PassengerDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Star,
  Clock,
  CreditCard,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  DollarSign,
  Car
} from 'lucide-react';
import API from '../api/api'; // axios instance (baseURL + interceptor)
import { useNavigate } from 'react-router-dom';

/*
  PassengerDashboard.jsx
  - Fully updated dashboard that connects to backend via API (../api/api)
  - Fetches profile, bookings, payments, notifications
  - Allows searching rides and booking a ride
  - Handles token redirect to /login
  - Contains small presentational subcomponents inside the same file for ease of copy/paste
  - Tailwind classes are used as in your original design
*/

/* -------------------------
   Helper presentational components
   ------------------------- */

const LoadingSpinner = ({ size = 36 }) => (
  <div className="flex items-center justify-center">
    <svg
      className="animate-spin"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
      <path d="M22 12a10 10 0 00-10-10" stroke="white" strokeWidth="4" strokeLinecap="round" />
    </svg>
  </div>
);



const Avatar = ({ name, size = 40 }) => {
  const initials = name ? name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'U';
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold"
    >
      {initials.toUpperCase()}
    </div>
  );
};

const SidebarButton = ({ active, onClick, icon: Icon, children, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition ${active ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'hover:bg-white hover:bg-opacity-10'}`}
  >
    <Icon size={20} />
    <span>{children}</span>
    {typeof badge === 'number' && badge > 0 && (
      <span className="ml-auto mr-1 bg-pink-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {badge}
      </span>
    )}
  </button>
);

/* -------------------------
   Main page component
   ------------------------- */

const PassengerDashboard = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchParams, setSearchParams] = useState({ source: '', destination: '', date: '', seats: 1 });
  const [sidebarOpen, setSidebarOpen] = useState(true);

const [profile, setProfile] = useState(() => {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      return {
        name: user.name || 'User',
        email: user.email || '',
        phone: user.phone || ''
      };
    });

  // Backend-connected states
  const [availableRides, setAvailableRides] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);


  // UI state
  const [loading, setLoading] = useState({ profile: false, bookings: false, payments: false, notifications: false, search: false, book: false });
  const [error, setError] = useState(null);

  const navigate = useNavigate();




  const token = localStorage.getItem('token');

  // Fetch initial data on mount
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    // load all dashboard data
    loadBookings();
    loadPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------------------------
     Backend fetch functions
     ------------------------- */



  const loadBookings = async () => {
    setLoading(prev => ({ ...prev, bookings: true }));
    setError(null);
    try {
      const res = await API.get('/booking/my-book'); // expected array of booking objects
      setMyBookings(res.data || []);
    } catch (err) {
      console.error('fetch bookings error', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(prev => ({ ...prev, bookings: false }));
    }
  };

  const loadPayments = async () => {
    setLoading(prev => ({ ...prev, payments: true }));
    setError(null);
    try {
      const res = await API.get('/payment/my'); // expected array
      setPaymentHistory(res.data || []);
    } catch (err) {
      console.error('fetch payments error', err);
      setError('Failed to load payments');
    } finally {
      setLoading(prev => ({ ...prev, payments: false }));
    }
  };



  /* -------------------------
     Actions
     ------------------------- */

  const handleSearch = async () => {
    setLoading(prev => ({ ...prev, search: true }));
    setError(null);

    try {
     const res = await API.post('/ride/search', searchParams, {
           headers: {
             Authorization: `Bearer ${token}`,
           },
         });

      setAvailableRides(res.data || []);
      setActiveTab("search");
    } catch (err) {
      console.error("search rides error", err);
      setError("Search failed. Try again.");
    } finally {
      setLoading(prev => ({ ...prev, search: false }));
    }
  };




const handleBooking = async (rideId, seats) => {
  if (!window.confirm(`Book ${seats} seat(s) for this ride?`)) return;

  if (!seats || seats <= 0) {
    alert('Please select at least 1 seat to book.');
    return;
  }

  setLoading(prev => ({ ...prev, book: true }));
  setError(null);

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Please login first.');
      navigate('/login');
      return;
    }

    await API.post(
      '/booking/book',
      { rideId, seats },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    await loadBookings();
    alert(`Successfully booked ${seats} seat(s)!`);

    if (availableRides.length) handleSearch();
  } catch (err) {
    console.error('Booking error:', err);

    if (err.response?.status === 403) {
      alert('You are not authorized to book this ride.');
    } else if (err.response?.status === 401) {
      alert('Session expired. Please login again.');
      navigate('/login');
    } else {
      const msg = err.response?.data?.message || 'Booking failed. Try again.';
      alert(msg);
    }

    setError(err.response?.data?.message || 'Booking failed');
  } finally {
    setLoading(prev => ({ ...prev, book: false }));
  }
};


  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      // DELETE with Authorization header
      await API.delete(`/booking/cancel/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await loadBookings();
      alert('Booking cancelled.');
    } catch (err) {
      console.error('cancel booking error', err);
      alert('Cancellation failed.');
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };



  /* -------------------------
     Small sub-UI render helpers
     ------------------------- */

  const UnauthenticatedState = () => (
    <div className="text-center py-20 text-white">
      <p className="mb-4">You are not logged in.</p>
      <button onClick={() => navigate('/login')} className="px-4 py-2 bg-purple-600 rounded">Go to Login</button>
    </div>
  );

  /* -------------------------
     Render main layout
     ------------------------- */

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-black bg-opacity-30 backdrop-blur-md text-white transition-all duration-300 overflow-hidden border-r border-purple-500 border-opacity-30`}>
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <Car className="text-pink-400" size={32} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">SmartRide</h1>
          </div>

          <nav className="space-y-2">
            <SidebarButton active={activeTab === 'search'} onClick={() => setActiveTab('search')} icon={Search}>Search Rides</SidebarButton>
            <SidebarButton active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} icon={Calendar}>My Bookings</SidebarButton>
            <SidebarButton active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} icon={CreditCard}>Payment History</SidebarButton>
            <SidebarButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={User}>Profile</SidebarButton>
          </nav>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Topbar */}
        <div className="bg-black bg-opacity-30 backdrop-blur-md border-b border-purple-500 border-opacity-30 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(s => !s)} className="p-2 hover:bg-white hover:bg-opacity-10 rounded text-white">
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="hidden md:flex items-center gap-3">
              <Avatar name={profile.name || 'User'} size={40} />
              <div className="flex flex-col">
                <span className="font-medium text-white">{profile.name || 'User'}</span>
                <span className="text-xs text-purple-300">{profile.email || ''}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">

            <button title="Logout" onClick={handleLogout} className="p-2 hover:bg-white hover:bg-opacity-10 rounded text-white">
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-600 bg-opacity-30 border border-red-500 text-white rounded">
              {error}
            </div>
          )}

          {/* --- SEARCH TAB --- */}
          {activeTab === 'search' && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">Search Rides</h2>
                <div className="text-sm text-purple-300">{loading.search ? 'Searching...' : `${availableRides.length} result(s)`}</div>
              </div>

              {/* Search form */}
              <div className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl shadow-2xl p-6 mb-6 border border-purple-500 border-opacity-30">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-purple-200">From</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-green-400" size={18} />
                      <input
                        type="text"
                        placeholder="Source city"
                        value={searchParams.source}
                        onChange={(e) => setSearchParams({ ...searchParams, source: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 bg-purple-900 bg-opacity-50 border border-purple-500 border-opacity-30 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none text-white placeholder-purple-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-purple-200">To</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-red-400" size={18} />
                      <input
                        type="text"
                        placeholder="Destination city"
                        value={searchParams.destination}
                        onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 bg-purple-900 bg-opacity-50 border border-purple-500 border-opacity-30 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none text-white placeholder-purple-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-purple-200">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 text-purple-300" size={18} />
                      <input
                        type="date"
                        value={searchParams.date}
                        onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 bg-purple-900 bg-opacity-50 border border-purple-500 border-opacity-30 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-purple-200">Seats</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 text-purple-300" size={18} />
                      <select
                        value={searchParams.seats}
                        onChange={(e) => setSearchParams({ ...searchParams, seats: Number(e.target.value) })}
                        className="w-full pl-10 pr-3 py-2 bg-purple-900 bg-opacity-50 border border-purple-500 border-opacity-30 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none text-white"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={handleSearch}
                      disabled={loading.search}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-medium shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading.search ? 'Searching...' : 'Find Rides'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Available rides listing */}
              <div className="space-y-4">
                {loading.search && availableRides.length === 0 ? (
                  <div className="p-6 bg-black bg-opacity-40 rounded text-center text-purple-300">
                    <LoadingSpinner size={28} />
                    <p className="mt-2">Searching for rides...</p>
                  </div>
                ) : availableRides.length === 0 ? (
                  <div className="p-6 bg-black bg-opacity-30 rounded text-purple-300">No rides found for selected criteria.</div>
                ) : (
                  availableRides.map((ride) => (
                    <article key={ride.id} className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl shadow-2xl p-6 hover:shadow-pink-500/20 transition border border-purple-500 border-opacity-30">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white">
                              {ride.driver?.name ? ride.driver.name.split(' ').map(n => n[0]).join('') : 'D'}
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{ride.driver?.name || 'Driver'}</h3>
                              <div className="flex items-center space-x-1">
                                <Star className="fill-yellow-400 text-yellow-400" size={16} />
                                <span className="text-sm text-purple-200">{ride.rating ?? '-'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <div className="flex items-center space-x-2 text-purple-200 mb-1">
                                <MapPin className="text-green-400" size={16} />
                                <span className="font-medium">{ride.source}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-purple-200">
                                <MapPin className="text-red-400" size={16} />
                                <span className="font-medium">{ride.destination}</span>
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center space-x-2 text-purple-200 mb-1">
                                <Calendar size={16} />
                                <span>{ride.date}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-purple-200">
                                <Clock size={16} />
                                <span>{ride.time}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-purple-200">
                            <span>🚗 {ride.vehicle}</span>
                            <span>👥 {ride.seats} seats</span>
                            <span>📏 {ride.distance}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">₹{ride.price}</div>
                          <button
                            onClick={() => handleBooking(ride.id,searchParams.seats)}
                            disabled={loading.book}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-medium shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {loading.book ? 'Booking...' : 'Book Now'}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          )}

          {activeTab === 'bookings' && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">My Bookings</h2>
                <div className="text-sm text-purple-300">{myBookings.length} booking(s)</div>
              </div>

              {loading.bookings ? (
                <div className="p-6 bg-black bg-opacity-40 rounded text-center"><LoadingSpinner /></div>
              ) : myBookings.length === 0 ? (
                <div className="p-6 bg-black bg-opacity-30 rounded text-purple-300">No bookings yet.</div>
              ) : (
                <div className="space-y-4">
                  {myBookings.map((booking) => {
                    const ride = booking.ride || {};
                    const driver = ride.driver || {};

                    return (
                      <div key={booking.id} className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-purple-500 border-opacity-30">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${booking.status === 'confirmed' ? 'bg-green-500 bg-opacity-30 text-green-300 border border-green-500' : 'bg-purple-500 bg-opacity-30 text-purple-300 border border-purple-500'}`}>
                              {String(booking.status || 'unknown').toUpperCase()}
                            </span>
                          </div>
                          <div className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                            ₹{(ride.price ?? 0) * (booking.seatsBooked ?? 1)}
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                            {driver.name ? driver.name.split(' ').map(n => n[0]).join('') : 'D'}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{driver.name || 'Driver'}</h3>
                            <div className="flex items-center space-x-1">
                              <Star className="fill-yellow-400 text-yellow-400" size={14} />
                              <span className="text-sm text-purple-200">{ride.rating ?? '-'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center space-x-2 text-purple-200">
                            <MapPin size={16} />
                            <span>{ride.source || '-'} → {ride.destination || '-'}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-purple-200">
                            <Calendar size={16} />
                            <span>{ride.date || '-'} at {ride.time || '-'}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          {booking.status === 'completed' && (
                            <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition">Rate Driver</button>
                          )}
                          {booking.status === 'confirmed' && (
                            <>
                              <button onClick={() => handleCancelBooking(booking.id)} className="flex-1 bg-red-600 bg-opacity-80 text-white py-2 rounded-lg hover:bg-opacity-100 transition">Cancel Ride</button>
                              <button className="flex-1 bg-purple-600 bg-opacity-80 text-white py-2 rounded-lg hover:bg-opacity-100 transition">Contact Driver</button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}



          {/* --- PAYMENTS TAB --- */}
          {activeTab === 'payments' && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">Payment History</h2>
                <div className="text-sm text-purple-300">{paymentHistory.length} transaction(s)</div>
              </div>

              {loading.payments ? (
                <div className="p-6 bg-black bg-opacity-40 rounded text-center"><LoadingSpinner /></div>
              ) : paymentHistory.length === 0 ? (
                <div className="p-6 bg-black bg-opacity-30 rounded text-purple-300">No payment records.</div>
              ) : (
                <div className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-purple-500 border-opacity-30">
                  <table className="w-full">
                    <thead className="bg-purple-900 bg-opacity-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-purple-200">Date</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-purple-200">Ride</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-purple-200">Amount</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-purple-200">Method</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-purple-200">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-500 divide-opacity-30">
                      {paymentHistory.map((payment) => (
                        <tr key={payment.id} className="hover:bg-purple-900 hover:bg-opacity-30">
                          <td className="px-6 py-4 text-white">{payment.date}</td>
                          <td className="px-6 py-4 text-white">{payment.ride}</td>
                          <td className="px-6 py-4 font-semibold text-pink-300">₹{payment.amount}</td>
                          <td className="px-6 py-4 text-white">{payment.method}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-green-500 bg-opacity-30 text-green-300 rounded-full text-sm font-medium border border-green-500">{payment.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}



          {/* --- PROFILE TAB --- */}
          {activeTab === 'profile' && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">My Profile</h2>
                <div className="text-sm text-purple-300">Member since: {profile.memberSince || '-'}</div>
              </div>

              <div className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-purple-500 border-opacity-30">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{profile.name || 'User'}</h3>
                    <p className="text-purple-300">Passenger</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-purple-900 bg-opacity-30 rounded-lg border border-purple-500 border-opacity-30">
                    <User size={20} className="text-purple-300" />
                    <div>
                      <p className="text-sm text-purple-300">Email</p>
                      <p className="font-medium text-white">{profile.email || '-'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-purple-900 bg-opacity-30 rounded-lg border border-purple-500 border-opacity-30">
                    <Users size={20} className="text-purple-300" />
                    <div>
                      <p className="text-sm text-purple-300">Phone</p>
                      <p className="font-medium text-white">{profile.phone || '-'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-purple-900 bg-opacity-30 rounded-lg border border-purple-500 border-opacity-30">
                    <Calendar size={20} className="text-purple-300" />
                    <div>
                      <p className="text-sm text-purple-300">Member Since</p>
                      <p className="font-medium text-white">{profile.memberSince || '-'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-purple-900 bg-opacity-30 rounded-lg border border-purple-500 border-opacity-30">
                    <DollarSign size={20} className="text-purple-300" />
                    <div>
                      <p className="text-sm text-purple-300">Total Rides</p>
                      <p className="font-medium text-white">{profile.totalRides ?? 0} rides</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-medium shadow-lg">Edit Profile</button>
                  <button onClick={handleLogout} className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium">Logout</button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default PassengerDashboard;
