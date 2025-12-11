import React, { useState, useEffect } from 'react';
import { Car, Users, DollarSign, Shield, Star, ChevronRight, Menu, X, MapPin, Clock } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Smart Route Matching",
      description: "AI-powered algorithm finds the perfect ride matches along your route"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Dynamic Pricing",
      description: "Fair, distance-based fares that save you money on every trip"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Payments",
      description: "Encrypted transactions with multiple payment options"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Verified Users",
      description: "Rating system ensures quality and trustworthy ride experiences"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "50K+", label: "Rides Completed" },
    { number: "40%", label: "Cost Savings" },
    { number: "4.8★", label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">

      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-slate-900/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Car className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                SmartRide
              </span>
            </div>

            {/* Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-purple-400 transition">Features</a>
              <a href="#how-it-works" className="hover:text-purple-400 transition">How It Works</a>
              <a href="#stats" className="hover:text-purple-400 transition">About</a>

              {/* Login button → Login */}
              <button
                className="px-4 py-2 rounded-lg border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white transition"
                onClick={() => navigate("/login")}
              >
                Login
              </button>

              {/* Get Started → Login */}
              <button
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-105"
                onClick={() => navigate("/register")}
              >
                Get Started
              </button>
            </div>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/98 backdrop-blur-lg px-4 py-4 space-y-4">
            <a href="#features" className="block hover:text-purple-400 transition">Features</a>
            <a href="#how-it-works" className="block hover:text-purple-400 transition">How It Works</a>
            <a href="#stats" className="block hover:text-purple-400 transition">About</a>

            <button
              className="w-full px-4 py-2 rounded-lg border border-purple-400 text-purple-400"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              className="w-full px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500"
              onClick={() => navigate("/login")}
            >
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold">
              Share Your Ride,
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                {" "}Save Money
              </span>
            </h1>

            <p className="text-xl text-gray-300">
              Connect with travelers heading your way. Split costs, reduce emissions, and make new friends on every journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition flex items-center group"
              >
                Start Sharing Rides
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={() => navigate("/login")}
                className="px-8 py-4 rounded-lg border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white transition"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right Ride Example Box */}
          <div className="relative">
            <div className="relative z-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/30">
              <div className="space-y-4">

                {/* From */}
                <div className="flex items-center space-x-4 bg-slate-800/50 rounded-xl p-4">
                  <MapPin className="w-6 h-6 text-green-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">From</p>
                    <p className="font-semibold">Mumbai</p>
                  </div>
                </div>

                {/* To */}
                <div className="flex items-center space-x-4 bg-slate-800/50 rounded-xl p-4">
                  <MapPin className="w-6 h-6 text-red-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">To</p>
                    <p className="font-semibold">Pune</p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center space-x-4 bg-slate-800/50 rounded-xl p-4">
                  <Clock className="w-6 h-6 text-blue-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Date</p>
                    <p className="font-semibold">Today, 3:00 PM</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:shadow-lg transition"
                >
                  Find Rides
                </button>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center hover:scale-110 transition">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">SmartRide?</span>
            </h2>
            <p className="text-xl text-gray-400">
              Experience the future of shared mobility
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/50">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4 text-purple-400">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-400">Get started in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Account", desc: "Sign up as a driver or passenger in seconds" },
              { step: "02", title: "Find or Post Ride", desc: "Search for rides or post your own trip details" },
              { step: "03", title: "Share & Save", desc: "Connect with travelers and split the cost" }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-purple-500/20">
                  <div className="text-6xl font-bold text-purple-500/20 mb-4">{item.step}</div>
                  <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl p-12 border border-purple-500/30">

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>

            <p className="text-xl text-gray-300 mb-8">
              Join thousands of riders saving money and reducing their carbon footprint
            </p>

            <button
              onClick={() => navigate("/register")}
              className="px-10 py-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-lg font-semibold hover:scale-105"
            >
              Sign Up Now - It's Free!
            </button>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 border-t border-purple-500/20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">

          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Car className="w-6 h-6 text-purple-400" />
              <span className="text-xl font-bold">SmartRide</span>
            </div>
            <p className="text-gray-400">Making travel affordable and sustainable</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <p className="text-gray-400 hover:text-purple-400">About Us</p>
            <p className="text-gray-400 hover:text-purple-400">Careers</p>
            <p className="text-gray-400 hover:text-purple-400">Blog</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <p className="text-gray-400 hover:text-purple-400">Help Center</p>
            <p className="text-gray-400 hover:text-purple-400">Safety</p>
            <p className="text-gray-400 hover:text-purple-400">Contact</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <p className="text-gray-400 hover:text-purple-400">Privacy Policy</p>
            <p className="text-gray-400 hover:text-purple-400">Terms of Service</p>
            <p className="text-gray-400 hover:text-purple-400">Cookie Policy</p>
          </div>

        </div>

        <div className="text-center text-gray-400 pt-8 border-t border-purple-500/20">
          © 2025 SmartRide. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
