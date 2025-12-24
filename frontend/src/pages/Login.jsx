import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// 1. Import icons from Lucide
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 2. State to track password visibility
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { 
        email: email.toLowerCase().trim(), 
        password 
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      alert("Login Successful! Welcome back.");
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow-lg rounded-2xl w-full max-w-sm border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 text-sm mt-1">Please enter your details to sign in</p>
        </div>

        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          
          {/* 3. Password field wrapper with relative positioning */}
          <div className="relative">
            <input 
              // Toggle type between 'password' and 'text'
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            {/* 4. The Eye Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold mt-8 hover:bg-blue-700 transition-all shadow-md active:scale-95 text-sm">
          Sign In
        </button>

        <p className="text-center text-gray-500 text-xs mt-6">
          New here? <span onClick={() => navigate('/register')} className="text-blue-600 font-bold cursor-pointer hover:underline">Create an account</span>
        </p>
      </form>
    </div>
  );
};

export default Login;