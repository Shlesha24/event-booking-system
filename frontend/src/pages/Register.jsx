import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match!");
    }
    if (formData.password.length < 6) {
      return alert("Password must be at least 6 characters!");
    }

    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      });
      alert(data.message || "Registration Successful!");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed. Try a different email.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form onSubmit={handleRegister} className="p-8 bg-white shadow-lg rounded-2xl w-full max-w-sm border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-black text-gray-900 text-center">Join EventBooker</h2>
          <p className="text-gray-500 text-sm mt-1">Join EventBooker to start exploring</p>
        </div>

        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Full Name" 
            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
          />

          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
          />

          <div className="grid grid-cols-2 gap-3">
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required 
            />
            <input 
              type="password" 
              placeholder="Confirm" 
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
              required 
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold mt-8 hover:bg-blue-700 transition-all shadow-md active:scale-95 text-sm">
          Register
        </button>

        <p className="text-center text-gray-500 text-xs mt-6">
          Already have an account? <span onClick={() => navigate('/login')} className="text-blue-600 font-bold cursor-pointer hover:underline">Login here</span>
        </p>
      </form>
    </div>
  );
};

export default Register;