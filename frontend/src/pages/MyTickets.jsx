import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Added Link for navigation

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyTickets = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        setLoading(false);
        return;
      }

      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/bookings/my-tickets', config);
        setTickets(data);
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyTickets();
  }, []);

  const cancelHandler = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      // Fixed: Ensure the URL matches your backend route
      await axios.delete(`http://localhost:5000/api/bookings/${id}`, config);
      
      // Update local state to remove the cancelled ticket immediately
      setTickets(prev => prev.filter(ticket => ticket._id !== id));
      alert("Booking cancelled successfully.");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel ticket.");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-8 min-h-screen">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Bookings</h1>
        <Link to="/" className="text-blue-600 font-bold text-sm hover:underline">
          + Book More Events
        </Link>
      </div>
      
      {tickets.length === 0 ? (
        <div className="bg-gray-50 p-20 rounded-[40px] text-center border-2 border-dashed border-gray-200">
          <div className="text-5xl mb-4">🎟️</div>
          <p className="text-gray-500 font-bold text-xl mb-6">No tickets found!</p>
          <Link 
            to="/" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Explore Events
          </Link>
        </div>
      ) : (
        <div className="grid gap-8">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="flex flex-col md:flex-row bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              
              {/* Event Image with fallback */}
              <div className="md:w-64 h-48 md:h-auto relative">
                <img 
                  src={ticket.event?.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80'} 
                  className="w-full h-full object-cover" 
                  alt={ticket.event?.title || 'Event'} 
                />
                {ticket.status === 'confirmed' && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                    Active
                  </div>
                )}
              </div>
              
              <div className="p-8 flex-grow flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {ticket.event?.category || 'General'}
                  </span>
                  
                  <h2 className="text-2xl font-black text-gray-900 leading-tight">
                    {ticket.event?.title || 'Unknown Event'}
                  </h2>
                  
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-500 text-xs flex items-center gap-1 font-medium">
                      📅 {ticket.event?.date ? new Date(ticket.event.date).toDateString() : 'Date TBA'}
                    </p>
                    <p className="text-gray-400 text-[10px] font-mono mt-2">
                      ID: {ticket._id.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="text-left md:text-right w-full md:w-auto border-t md:border-t-0 pt-6 md:pt-0">
                  <p className="text-3xl font-black text-gray-900">
                    ₹{ticket.event?.price || 0}
                  </p>
                  <p className="text-green-600 text-[10px] font-bold uppercase mb-4 tracking-widest">
                    Paid via Stripe
                  </p>
                  <button 
                    onClick={() => cancelHandler(ticket._id)}
                    className="w-full md:w-auto px-6 py-2 bg-red-50 text-red-500 text-xs font-black rounded-xl hover:bg-red-500 hover:text-white transition-all duration-200 border border-red-100"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;