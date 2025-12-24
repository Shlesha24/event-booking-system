import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Concert', 
    price: '', totalSlots: '', image: '', date: '', city: '', location: ''
  });

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/events');
      setEvents(data);
    } catch (error) { console.error("Error fetching events"); }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      if (isEditing) {
        // UPDATE EXISTING EVENT
        await axios.put(`http://localhost:5000/api/events/${editId}`, formData, config);
        alert("Festival Updated Successfully!");
      } else {
        // CREATE NEW EVENT
        await axios.post('http://localhost:5000/api/events', formData, config);
        alert("Festival Added Successfully!");
      }

      setFormData({ title: '', description: '', category: 'Concert', price: '', totalSlots: '', image: '', date: '', city: '', location: '' });
      setIsEditing(false);
      setEditId(null);
      fetchEvents();
    } catch (error) { alert("Action failed. Check Admin permissions."); }
  };

  const editHandler = (event) => {
    setIsEditing(true);
    setEditId(event._id);
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      price: event.price,
      totalSlots: event.totalSlots,
      image: event.image,
      date: event.date ? event.date.split('T')[0] : '', 
      city: event.city,
      location: event.location
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`http://localhost:5000/api/events/${id}`, config);
        fetchEvents();
      } catch (error) { alert("Error deleting event"); }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* FORM SIDE */}
        <div className={`rounded-2xl shadow-xl p-8 h-fit transition-colors duration-500 ${isEditing ? 'bg-blue-50 border-2 border-blue-200' : 'bg-white'}`}>
          <h1 className="text-2xl font-black text-gray-900 mb-2">{isEditing ? "Edit Festival" : "Create Festival"}</h1>
          <p className="text-sm text-gray-500 mb-6">{isEditing ? "Modify price or event details below" : "Add a new event to the platform"}</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="title" value={formData.title} onChange={handleChange} required placeholder="Festival Title" className="w-full px-4 py-2 rounded-lg border outline-none" />
            <div className="grid grid-cols-2 gap-2">
              <input name="date" type="date" value={formData.date} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border outline-none" />
              <input name="city" type="text" value={formData.city} onChange={handleChange} required placeholder="City" className="w-full px-4 py-2 rounded-lg border outline-none" />
            </div>
            <input name="location" value={formData.location} onChange={handleChange} required placeholder="Specific Venue (e.g. Boduppal)" className="w-full px-4 py-2 rounded-lg border outline-none" />
            
            <div className="grid grid-cols-2 gap-2">
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border outline-none">
                <option>Concert</option><option>Conference</option><option>Workshop</option><option>Sports</option>
              </select>
              <input name="price" type="number" value={formData.price} onChange={handleChange} required placeholder="Price" className="w-full px-4 py-2 rounded-lg border outline-none font-bold text-orange-600" />
            </div>
            <input name="totalSlots" type="number" value={formData.totalSlots} onChange={handleChange} required placeholder="Total Tickets" className="w-full px-4 py-2 rounded-lg border outline-none" />
            <input name="image" value={formData.image} onChange={handleChange} required placeholder="Image URL" className="w-full px-4 py-2 rounded-lg border outline-none" />
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" required placeholder="Description" className="w-full px-4 py-2 rounded-lg border outline-none"></textarea>
            
            <button type="submit" className={`w-full text-white font-black py-3 rounded-xl transition-all shadow-lg ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-600 hover:bg-orange-700'}`}>
              {isEditing ? "Update Festival Details" : "Create Festival"}
            </button>
            
            {isEditing && (
              <button type="button" onClick={() => { setIsEditing(false); setFormData({ title: '', description: '', category: 'Concert', price: '', totalSlots: '', image: '', date: '', city: '', location: '' }); }} className="w-full text-gray-500 text-xs font-bold mt-2">
                Cancel Editing
              </button>
            )}
          </form>
        </div>

        {/* LIST SIDE */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Manage Events</h2>
          <div className="space-y-4">
            {events.map(event => (
              <div key={event._id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <img src={event.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 truncate w-32">{event.title}</h4>
                    <p className="text-[10px] text-orange-600 font-bold">₹{event.price}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => editHandler(event)} className="text-blue-600 text-xs font-bold hover:underline">Edit</button>
                  <button onClick={() => deleteHandler(event._id)} className="text-red-600 text-xs font-bold hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;