import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { handlePayment } from '../paymentUtils'; 
import { Link } from 'react-router-dom';
// Added X icon to imports
import { Search, X } from 'lucide-react';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  
  const calendarRef = useRef(null);
  const categories = ["All", "Concert", "Conference", "Workshop", "Sports"];

  useEffect(() => {
    fetchEvents();
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/events');
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleBooking = async (event) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.token) {
      alert("Please login to book an event!");
      return;
    }
    try {
      await handlePayment(event, userInfo.email, userInfo._id); 
    } catch (error) {
      console.error("Payment initialization failed:", error);
      alert("Something went wrong with the payment system.");
    }
  };

  const filterByAllCriteria = (dataArray) => {
    return dataArray.filter(event => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        event.title.toLowerCase().includes(searchLower) || 
        (event.city && event.city.toLowerCase().includes(searchLower)) ||
        (event.location && event.location.toLowerCase().includes(searchLower));

      const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
      
      let matchesDate = true;
      if (selectedDate && event.date) {
          matchesDate = new Date(event.date).toDateString() === selectedDate.toDateString();
      }

      return matchesSearch && matchesCategory && matchesDate;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // UPDATED: EventCard now includes "tickets left" and green color scheme
  const EventCard = ({ event }) => {
    const ticketsLeft = (event.totalSlots || 0) - (event.bookedSlots || 0);
    const isSoldOut = ticketsLeft <= 0;

    return (
      <div className="group flex flex-col">
        <Link to={`/event/${event._id}`} className="block">
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9] mb-4 shadow-sm group-hover:shadow-md transition-shadow">
            <img src={event.image} className={`w-full h-full object-cover transition-all duration-500 ${isSoldOut ? "grayscale" : "group-hover:scale-105"}`} alt={event.title} />
            <div className="absolute top-3 left-3 bg-white/90 px-2 py-0.5 rounded shadow-sm text-[9px] font-black uppercase text-blue-600">{event.category}</div>
          </div>
        </Link>
        <Link to={`/event/${event._id}`}>
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors truncate">{event.title}</h3>
        </Link>
        <div className="flex items-center gap-1 text-gray-500 mt-1">
          <p className="text-[11px] font-medium">📍 {event.city}</p>
        </div>

        {/* Tickets Left Label in Green */}
        {!isSoldOut && (
          <p className="text-green-600 text-[12px] font-bold mt-1">
            {ticketsLeft} tickets left
          </p>
        )}

        {/* Date updated to Green */}
        <p className="text-slate-600 text-[11px] font-bold uppercase tracking-tight mb-2 mt-1">
          📅 {event.date ? new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : "Date TBA"}
        </p>

        <button onClick={() => handleBooking(event)} disabled={isSoldOut} className="w-full border-2 border-blue-600 text-blue-600 font-black py-2 rounded-xl text-sm hover:bg-blue-600 hover:text-white transition-all disabled:opacity-30">
          {isSoldOut ? "Sold Out" : `Book - ₹${event.price}`}
        </button>
      </div>
    );
  };

  const filteredEvents = filterByAllCriteria(events);
  const popularEvents = filteredEvents.slice(0, 6);
  const concerts = filteredEvents.filter(e => e.category === "Concert");
  const conferences = filteredEvents.filter(e => e.category === "Conference");
  const workshops = filteredEvents.filter(e => e.category === "Workshop");
  const sports = filteredEvents.filter(e => e.category === "Sports");

  return (
    <div className="bg-white min-h-screen">
      {/* HERO SECTION */}
      <div className="relative h-[400px] w-full bg-gray-900 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80" className="absolute inset-0 w-full h-full object-cover opacity-50" alt="Hero" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 text-center">
          <h1 className="text-6xl font-black mb-6 tracking-tight">Best events in Your City</h1>
          
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            
            <input 
              type="text" 
              placeholder="Search by event, city, or venue..." 
              className="w-full pl-12 pr-12 py-3 text-gray-800 rounded-full focus:outline-none text-sm bg-white shadow-2xl" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />

            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* STICKY TOOLBAR */}
      <div className="sticky top-0 z-40 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex gap-4">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-1 text-sm font-semibold rounded-full transition-all ${selectedCategory === cat ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="relative" ref={calendarRef}>
            <button onClick={() => setShowCalendar(!showCalendar)} className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-bold ${selectedDate ? 'bg-blue-50 border-blue-600 text-blue-600' : 'text-gray-700'}`}>
              📅 {selectedDate ? selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : "Select Date"}
            </button>
            {showCalendar && (
              <div className="absolute right-0 mt-2 z-50 bg-white p-4 rounded-xl shadow-2xl border">
                <Calendar onChange={(date) => { setSelectedDate(date); setShowCalendar(false); }} value={selectedDate} />
                {selectedDate && <button onClick={() => setSelectedDate(null)} className="w-full text-[10px] font-bold text-red-500 mt-2 uppercase">Clear Selection</button>}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12 space-y-20">
        {(searchTerm || selectedDate) && (
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            Showing {filteredEvents.length} results for your search
          </p>
        )}

        {popularEvents.length > 0 && (
          <section>
            <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tighter">Popular Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {popularEvents.map(event => <EventCard key={event._id} event={event} />)}
            </div>
          </section>
        )}

        {concerts.length > 0 && (
          <section id="concerts" className="pt-10 border-t">
            <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tighter">Music & Concerts 🎸</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {concerts.map(event => <EventCard key={event._id} event={event} />)}
            </div>
          </section>
        )}

        {conferences.length > 0 && (
          <section id="conferences" className="pt-10 border-t bg-slate-50 -mx-8 px-8 py-16">
            <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tighter">Conferences & Talks 💼</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {conferences.map(event => <EventCard key={event._id} event={event} />)}
            </div>
          </section>
        )}

        {workshops.length > 0 && (
          <section id="workshops" className="pt-10 border-t">
            <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tighter">Workshops & Learning 🎨</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {workshops.map(event => <EventCard key={event._id} event={event} />)}
            </div>
          </section>
        )}

        {filteredEvents.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed rounded-3xl">
            <p className="text-gray-400 font-bold">No matching events found for this date or category.</p>
            <button onClick={() => {setSearchTerm(""); setSelectedDate(null); setSelectedCategory("All");}} className="mt-4 text-blue-600 font-bold underline">Reset all filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;