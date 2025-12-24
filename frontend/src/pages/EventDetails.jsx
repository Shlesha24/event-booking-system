import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handlePayment } from '../paymentUtils';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  // State for Read More / Read Less toggle
  const [showFullDescription, setShowFullDescription] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); 
    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const onBook = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) { navigate('/login'); return; }
    handlePayment(event, userInfo.email, userInfo._id);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!event) return <div className="text-center py-20 font-bold">Event not found!</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO IMAGE */}
      <div className="w-full h-[450px] bg-gray-900 relative">
        <img src={event.image} className="w-full h-full object-cover opacity-80" alt={event.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 2. LEFT CONTENT */}
          <div className="lg:col-span-8 bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <p className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2">{event.category}</p>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6">{event.title}</h1>
            
            <div className="flex flex-wrap gap-6 mb-10 pb-8 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Date & Time</p>
                  <p className="font-bold text-gray-800">{new Date(event.date).toDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Location</p>
                  <p className="font-bold text-gray-800">{event.city}</p>
                </div>
              </div>
            </div>

            {/* ✅ UPDATED: About section with Read More / Read Less */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">About this event</h3>
              <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">
                {showFullDescription 
                  ? event.description 
                  : `${event.description.substring(0, 300)}${event.description.length > 300 ? '...' : ''}`
                }
              </p>
              {event.description.length > 300 && (
                <button 
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1"
                >
                  {showFullDescription ? "Show Less ↑" : "Read More ↓"}
                </button>
              )}
            </div>

            {/* REAL GOOGLE MAPS INTEGRATION */}
            <div className="mt-12 pt-12 border-t border-gray-100">
               <h3 className="text-2xl font-bold text-gray-900 mb-6">Location</h3>
               <p className="text-gray-600 font-bold mb-4">📍 {event.location}, {event.city}</p>
               
               <div className="w-full h-80 rounded-2xl overflow-hidden shadow-inner border border-gray-200">
                  <iframe
                    title="Event Location"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(event.location + ' ' + event.city)}&output=embed`}
                    allowFullScreen
                  ></iframe>
               </div>
            </div>
          </div>

          {/* 3. RIGHT SIDEBAR */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
              <div className="mb-6">
                <p className="text-gray-500 font-bold text-sm mb-1 uppercase tracking-tight">Price per ticket</p>
                <h2 className="text-2xl font-black text-gray-900">₹{event.price}</h2>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Availability</span>
                  <span className="text-green-600 font-bold">{event.totalSlots - event.bookedSlots} Left</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                   <div 
                    className="bg-blue-600 h-full transition-all duration-500" 
                    style={{ width: `${(event.bookedSlots / event.totalSlots) * 100}%` }}
                   />
                </div>
              </div>

              <button 
                onClick={onBook}
                className="w-full bg-[#D1410C] hover:bg-[#b0360a] text-white font-bold py-4 rounded-lg transition-colors shadow-lg"
              >
                Reserve a spot
              </button>

              <p className="text-[11px] text-gray-400 text-center mt-4 leading-tight">
                * All sales are final. EventBooker Verified Guarantee included.
              </p>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
               <p className="text-blue-800 text-sm font-bold flex items-center gap-2">
                 🛡️ Secure checkout via Stripe
               </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetails;