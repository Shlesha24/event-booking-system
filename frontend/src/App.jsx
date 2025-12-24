import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Added Navigate
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import MyTickets from './pages/MyTickets'; 
import Success from './pages/Success';
import EventDetails from './pages/EventDetails';
import './index.css'; 

// --- 1. Added the ProtectedRoute helper right here for simplicity ---
const ProtectedRoute = ({ children, isAdminRequired = false }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (isAdminRequired && userInfo.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Admin Route */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute isAdminRequired={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Protected User Route (Only logged in users can see their tickets) */}
        <Route 
          path="/my-tickets" 
          element={
            <ProtectedRoute>
              <MyTickets />
            </ProtectedRoute>
          } 
        />

        <Route path="/success" element={<Success />} />
        <Route path="/event/:id" element={<EventDetails />} />
      </Routes>
    </Router>
  );
}

export default App;