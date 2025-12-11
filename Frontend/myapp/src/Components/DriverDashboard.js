import React, { useState, useEffect } from 'react';
import {
  Plus, X, Car, Navigation, Users, DollarSign, Bell, User, LogOut, Menu,
  Calendar, MapPin, Clock, Edit, Trash2, CheckCircle, Star
} from 'lucide-react';
import API from '../api/api';

const DriverDashboard = () => {
  const [activeTab, setActiveTab] = useState('my-rides');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showPostRideModal, setShowPostRideModal] = useState(false);

  // ===== DATA STATES =====
  const [myPostedRides, setMyPostedRides] = useState([]);
  const [completedRides, setCompletedRides] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [earningsData, setEarningsData] = useState({});
  const [vehicleInfo, setVehicleInfo] = useState({});
  const [notifications, setNotifications] = useState([]);

  const [rideData, setRideData] = useState({
    source: "",
    destination: "",
    date: "",
    time: "",
    availableSeats: "",
    price: ""
  });

  const [profile, setProfile] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    return {
      name: user.name || 'Driver',
      email: user.email || '',
      phone: user.phone || ''
    };
  });

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // ===== FETCH DATA =====
  useEffect(() => {
    fetchDriverData();
  }, []);

const fetchDriverData = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please login.');
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000, // 5 seconds timeout
    };

    // Make all requests in parallel
    const [ridesRes, bookingsRes, earningsRes, vehicleRes, profileRes] = await Promise.all([
      API.get('/driver/rides', config),
      API.get('/ride/booking-requests', config), // Ensure endpoint matches backend
      API.get('/driver/earnings', config),
      API.get('/driver/vehicle', config),
      API.get('/user/profile', config)
    ]);

    const rides = ridesRes.data;
    const now = new Date();

    const parseDateTime = (ride) => new Date(`${ride.date}T${ride.time || "23:59"}`);

    setMyPostedRides(rides.filter(r => parseDateTime(r) >= now));
    setCompletedRides(rides.filter(r => parseDateTime(r) < now));

    setBookingRequests(bookingsRes.data);
    setEarningsData(earningsRes.data);
    setVehicleInfo(vehicleRes.data);
    setProfile(profileRes.data);

  } catch (error) {
    // Handle axios/network errors
    if (error.response) {
      // Backend responded with status code outside 2xx
      console.error('Backend error:', error.response.data);
      alert(`Backend error: ${error.response.data?.message || error.response.statusText}`);
    } else if (error.request) {
      // Request made but no response (server down)
      console.error('No response from server:', error.request);
      alert('Cannot reach server. Is backend running on http://localhost:8080?');
    } else {
      // Other errors
      console.error('Error fetching driver data:', error.message);
      alert(`Error: ${error.message}`);
    }
  }
};








  // ===== HANDLERS =====
  const handlePostRide = async (rideData) => {
    try {
      await API.post('driver/ride', rideData);
      alert('Ride posted successfully!');
      setShowPostRideModal(false);
      fetchDriverData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to post ride');
    }
  };

const handleBookingAction = async (bookingId, action) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    // Call backend and get the updated booking
    const response = await API.post(
      `/booking/bookings/${bookingId}/${action}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const updatedBooking = response.data;
    const updatedRide = updatedBooking.ride;

    // Remove booking request from UI
    setBookingRequests(prev =>
      prev.filter(br => br.id !== bookingId)
    );

    // Update myPostedRides directly
    setMyPostedRides(prev =>
      prev.map(ride =>
        ride.id === updatedRide.id ? updatedRide : ride
      )
    );

    alert(
      action === "accept" ? "Booking accepted!" : "Booking rejected!"
    );
  } catch (error) {
    console.error("Booking action failed:", error);
    alert(error.response?.data?.message || "Action failed.");
  }
};




  const handleUpdateVehicle = async (data) => {
    try {
      await API.put('/driver/vehicle', data);
      alert('Vehicle info updated!');
      fetchDriverData();
    } catch (error) {
      alert(error.response?.data?.message || 'Update failed');
    }
  };

  const handleMarkNotificationRead = async (id) => {
    try {
      await API.post(`/driver/notifications/${id}/read`);
      fetchDriverData();
    } catch (error) {
      console.error(error);
    }
  };

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

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* ===== Post Ride Modal ===== */}
      {showPostRideModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-80 backdrop-blur-md rounded-2xl p-6 max-w-md w-full mx-4 border border-purple-500 border-opacity-30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-white">Post New Ride</h3>
              <button onClick={() => setShowPostRideModal(false)} className="text-white hover:text-pink-400">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Source city"
                value={rideData.source}
                onChange={(e) => setRideData({ ...rideData, source: e.target.value })}
                className="w-full px-3 py-2 bg-purple-900 bg-opacity-50 border border-purple-500 border-opacity-30 rounded-lg text-white placeholder-purple-300"
              />
              <input
                type="text"
                placeholder="Destination city"
                value={rideData.destination}
                onChange={(e) => setRideData({ ...rideData, destination: e.target.value })}
                className="w-full px-3 py-2 bg-purple-900 bg-opacity-50 border border-purple-500 border-opacity-30 rounded-lg text-white placeholder-purple-300"
              />
              <input
                type="date"
                value={rideData.date}
                onChange={(e) => setRideData({ ...rideData, date: e.target.value })}
                className="w-full px-3 py-2 bg-purple-900 bg-opacity-50 border border-purple-500 border-opacity-30 rounded-lg text-white"
              />
              <input
                type="time"
                value={rideData.time}
                onChange={(e) => setRideData({ ...rideData, time: e.target.value })}
                className="w-full px-3 py-2 bg-purple-900 bg-opacity-50 border border-purple-500 border-opacity-30 rounded-lg text-white"
              />
              <input
                type="number"
                placeholder="Available Seats"
                value={rideData.availableSeats}
                onChange={(e) => setRideData({ ...rideData, availableSeats: e.target.value })}
                className="w-full px-3 py-2 bg-purple-900 bg-opacity-50 border border-purple-500 border-opacity-30 rounded-lg text-white placeholder-purple-300"
              />
              <input
                type="number"
                placeholder="Price per seat"
                value={rideData.price}
                onChange={(e) => setRideData({ ...rideData, price: e.target.value })}
                className="w-full px-3 py-2 bg-purple-900 bg-opacity-50 border border-purple-500 border-opacity-30 rounded-lg text-white placeholder-purple-300"
              />
              <button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-medium"
                onClick={() => handlePostRide(rideData)}
              >
                Post Ride
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Sidebar ===== */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-black bg-opacity-30 backdrop-blur-md text-white transition-all duration-300 overflow-hidden border-r border-purple-500 border-opacity-30`}>
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <Car className="text-pink-400" size={32} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">SmartRide</h1>
          </div>
          <nav className="space-y-2">
            {/* Sidebar Buttons */}
            {[
              { tab: 'my-rides', icon: Navigation, label: 'My Rides' },
              { tab: 'bookings', icon: Users, label: 'Booking Requests' },
              { tab: 'earnings', icon: DollarSign, label: 'Earnings' },
              { tab: 'vehicle', icon: Car, label: 'Vehicle Info' },
              { tab: 'notifications', icon: Bell, label: 'Notifications' },
              { tab: 'profile', icon: User, label: 'Profile' }
            ].map((item) => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition ${
                  activeTab === item.tab ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ===== Main Content ===== */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-black bg-opacity-30 backdrop-blur-md border-b border-purple-500 border-opacity-30 p-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white hover:bg-opacity-10 rounded text-white">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowPostRideModal(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-medium shadow-lg"
            >
              <Plus size={20} />
              <span>Post New Ride</span>
            </button>
            <div className="flex items-center space-x-2">
              <Avatar name={profile.name} />
              <span className="font-medium text-white">{profile.name || "Loading..."}</span>
            </div>
            <button className="p-2 hover:bg-white hover:bg-opacity-10 rounded text-white">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* ===== My Rides Tab ===== */}
          {activeTab === 'my-rides' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">My Posted Rides</h2>

              {/* Active Rides */}
              {/* ===== Active Rides ===== */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-purple-200">Active Rides</h3>
                {myPostedRides.filter(ride => ride && ride.id).length === 0 ? (
                  <p className="text-purple-300">No active rides found.</p>
                ) : (
                  <div className="space-y-4">
                    {myPostedRides.filter(ride => ride && ride.id).map((ride) => {
                       const bookedSeats = ride.bookedSeats ?? (totalSeats - (ride.availableSeats ?? totalSeats));
                       const totalSeats = bookedSeats + (ride.availableSeats ?? 0);
                      return (
                        <div key={ride.id} className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-purple-500 border-opacity-30">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                {ride.availableSeats === 0 ? (
                                  <span className="px-3 py-1 bg-red-500 bg-opacity-30 text-red-300 rounded-full text-sm font-medium border border-red-500">
                                    FULL
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 bg-green-500 bg-opacity-30 text-green-300 rounded-full text-sm font-medium border border-green-500">
                                    ACTIVE
                                  </span>
                                )}
                                <span className="text-purple-200">
                                  {bookedSeats}/{totalSeats} seats booked
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <div className="flex items-center space-x-2 text-purple-200 mb-2">
                                    <MapPin className="text-green-400" size={18} />
                                    <span className="font-medium text-lg text-white">{ride.source}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-purple-200">
                                    <MapPin className="text-red-400" size={18} />
                                    <span className="font-medium text-lg text-white">{ride.destination}</span>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2 text-purple-200 mb-2">
                                    <Calendar size={18} />
                                    <span>{ride.date}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-purple-200">
                                    <Clock size={18} />
                                    <span>{ride.time}</span>
                                  </div>
                                </div>
                              </div>

                               <div className="mt-4">
                                                    <h4 className="text-sm font-medium text-purple-200 mb-2">Passengers:</h4>
                                                    {ride.bookings && ride.bookings.length > 0 ? (
                                                      <div className="space-y-2">
                                                        {ride.bookings.map((booking, idx) => (
                                                          <div
                                                            key={idx}
                                                            className="flex items-center justify-between bg-purple-900 bg-opacity-30 p-3 rounded-lg"
                                                          >
                                                            <div className="flex items-center space-x-3">
                                                              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                                {booking.passenger.name
                                                                  .split(' ')
                                                                  .map(n => n[0])
                                                                  .join('')}
                                                              </div>
                                                              <div>
                                                                <p className="font-medium text-white">{booking.passenger.name}</p>
                                                                <p className="text-xs text-purple-300">{booking.passenger.phone}</p>
                                                              </div>
                                                            </div>
                                                            <button className="text-pink-400 hover:text-pink-300 text-sm">
                                                              Contact
                                                            </button>
                                                          </div>
                                                        ))}
                                                      </div>
                                                    ) : (
                                                      <p className="text-purple-300 text-sm mt-1">No passengers yet</p>
                                                    )}
                                                  </div>
                                                </div>

                            <div className="ml-6 text-right">
                              <div className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
                                ₹{ride.price}/seat
                              </div>
                              <p className="text-sm text-purple-300 mb-4">{ride.distance}</p>
                              <div className="space-y-2">
                                <button className="w-full bg-purple-600 bg-opacity-80 text-white px-4 py-2 rounded-lg hover:bg-opacity-100 transition text-sm">
                                  <Edit size={16} className="inline mr-1" />
                                  Edit
                                </button>
                                <button className="w-full bg-red-600 bg-opacity-80 text-white px-4 py-2 rounded-lg hover:bg-opacity-100 transition text-sm">
                                  <Trash2 size={16} className="inline mr-1" />
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ===== Completed Rides ===== */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-purple-200">Completed Rides</h3>
                {completedRides.filter(ride => ride && ride.id).length === 0 ? (
                  <p className="text-purple-300">No completed rides found.</p>
                ) : (
                  <div className="space-y-4">
                    {completedRides.filter(ride => ride && ride.id).map((ride) => (
                      <div key={ride.id} className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-purple-500 border-opacity-30">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <span className="inline-block px-3 py-1 bg-purple-500 bg-opacity-30 text-purple-300 rounded-full text-sm font-medium border border-purple-500 mb-3">
                              COMPLETED
                            </span>
                            <div className="flex items-center space-x-2 text-purple-200">
                              <MapPin size={16} />
                              <span className="text-white">{ride.source} → {ride.destination}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-purple-300 mb-1">Earned</p>
                            <div className="text-2xl font-bold text-green-400">₹{ride.earnings}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}


          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">Booking Requests</h2>
              <div className="space-y-4">
                {bookingRequests.length === 0 ? (
                  <p className="text-purple-300">No booking requests found.</p>
                ) : (
                  bookingRequests.map((request) => {
                    const passengers = Array.isArray(request.passenger)
                      ? request.passenger
                      : [request.passenger];

                    return (
                      <div
                        key={request.id}
                        className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-purple-500 border-opacity-30"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            {passengers.map((passenger, idx) => (
                              <div key={idx} className="flex items-center space-x-3 mb-3">
                                {/* Avatar */}
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white">
                                  {passenger?.name
                                    ? passenger.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                    : "U"}
                                </div>

                                {/* Passenger Info */}
                                <div>
                                  <h3 className="font-semibold text-white text-lg">
                                    {passenger?.name || "Unknown Passenger"}
                                  </h3>
                                  <div className="flex items-center space-x-1">
                                    <Star className="fill-yellow-400 text-yellow-400" size={16} />
                                    <span className="text-sm text-purple-200">
                                      {passenger?.rating || "N/A"}
                                    </span>
                                  </div>
                                  <p className="text-sm text-purple-300">{passenger?.phone || "-"}</p>
                                </div>
                              </div>
                            ))}

                            {/* Ride Info */}
                            <div className="flex items-center space-x-2 text-purple-200 mb-2">
                              <MapPin size={16} />
                              <span>
                                {request.source} → {request.destination}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col space-y-2">
                            <button className="bg-green-600 bg-opacity-80 text-white px-6 py-2 rounded-lg hover:bg-opacity-100 transition font-medium flex items-center space-x-2"
                             onClick={() => handleBookingAction(request.id, "accept")}>
                              <CheckCircle size={18} />
                              <span>Accept</span>
                            </button>
                            <button className="bg-red-600 bg-opacity-80 text-white px-6 py-2 rounded-lg hover:bg-opacity-100 transition font-medium flex items-center space-x-2"
                               onClick={() => handleBookingAction(request.id, "reject")}>
                              <X size={18} />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}


          {activeTab === 'earnings' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">Earnings & Statistics</h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-purple-500 border-opacity-30">
                  <p className="text-purple-300 text-sm mb-2">Today</p>
                  <p className="text-3xl font-bold text-white">₹{earningsData.today}</p>
                </div>
                <div className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-purple-500 border-opacity-30">
                  <p className="text-purple-300 text-sm mb-2">This Week</p>
                  <p className="text-3xl font-bold text-white">₹{earningsData.thisWeek}</p>
                </div>
                <div className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-purple-500 border-opacity-30">
                  <p className="text-purple-300 text-sm mb-2">This Month</p>
                  <p className="text-3xl font-bold text-white">₹{earningsData.thisMonth}</p>
                </div>
                <div className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-purple-500 border-opacity-30">
                  <p className="text-purple-300 text-sm mb-2">Total Rides</p>
                  <p className="text-3xl font-bold text-white">{earningsData.totalRides}</p>
                </div>
              </div>

              <div className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-purple-500 border-opacity-30">
                <h3 className="text-xl font-semibold text-white mb-4">Driver Rating</h3>
                <div className="flex items-center space-x-4">
                  <div className="text-5xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    {earningsData.avgRating}
                  </div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={star <= Math.floor(earningsData.avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'}
                        size={24}
                      />
                    ))}
                  </div>
                  <p className="text-purple-300">Based on {earningsData.totalRides} rides</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vehicle' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">Vehicle Information</h2>
              <div className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-purple-500 border-opacity-30">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Car size={40} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{vehicleInfo.vehicleModel}</h3>
                    <p className="text-purple-300">Driver: {vehicleInfo.name}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-purple-900 bg-opacity-30 rounded-lg border border-purple-500 border-opacity-30">
                    <span className="text-purple-300">License Plate</span>
                    <span className="font-medium text-white">{vehicleInfo.licensePlate}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-900 bg-opacity-30 rounded-lg border border-purple-500 border-opacity-30">
                    <span className="text-purple-300">Seating Capacity</span>
                    <span className="font-medium text-white">{vehicleInfo.capacity} passengers</span>
                  </div>
                </div>

                <button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-medium shadow-lg">
                  Update Vehicle Info
                </button>
              </div>
            </div>
          )}


          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">Notifications</h2>
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`bg-black bg-opacity-40 backdrop-blur-md rounded-2xl shadow-2xl p-4 border ${!notif.read ? 'border-l-4 border-pink-500' : 'border-purple-500 border-opacity-30'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-white">{notif.message}</p>
                        <p className="text-sm text-purple-300 mt-1">{notif.time}</p>
                      </div>
                      <Bell size={20} className={notif.read ? 'text-purple-400' : 'text-pink-400'} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">Driver Profile</h2>
              <div className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-purple-500 border-opacity-30">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    RK
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-white">{profile.name}</h3>
                      {profile.verified && (
                        <CheckCircle className="text-green-400" size={20} />
                      )}
                    </div>
                    <p className="text-purple-300">Verified Driver</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="fill-yellow-400 text-yellow-400" size={16} />
                      <span className="text-sm text-purple-200">{profile.rating} rating</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-purple-900 bg-opacity-30 rounded-lg border border-purple-500 border-opacity-30">
                    <User size={20} className="text-purple-300" />
                    <div>
                      <p className="text-sm text-purple-300">Email</p>
                      <p className="font-medium text-white">{profile.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-purple-900 bg-opacity-30 rounded-lg border border-purple-500 border-opacity-30">
                    <Users size={20} className="text-purple-300" />
                    <div>
                      <p className="text-sm text-purple-300">Phone</p>
                      <p className="font-medium text-white">{profile.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-purple-900 bg-opacity-30 rounded-lg border border-purple-500 border-opacity-30">
                    <Calendar size={20} className="text-purple-300" />
                    <div>
                      <p className="text-sm text-purple-300">Member Since</p>
                      <p className="font-medium text-white">{profile.memberSince}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-purple-900 bg-opacity-30 rounded-lg border border-purple-500 border-opacity-30">
                    <DollarSign size={20} className="text-purple-300" />
                    <div>
                      <p className="text-sm text-purple-300">Total Rides</p>
                      <p className="font-medium text-white">{profile.totalRides} rides</p>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-medium shadow-lg">
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;