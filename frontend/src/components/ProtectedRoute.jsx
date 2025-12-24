import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdminRequired = false }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // 1. If not logged in at all, kick them to login
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // 2. If it's an admin-only page and they are NOT an admin, kick them to home
  if (isAdminRequired && userInfo.role !== 'admin') {
    alert("Access Denied: Admins Only!");
    return <Navigate to="/" replace />;
  }

  // 3. Otherwise, let them in
  return children;
};

export default ProtectedRoute;