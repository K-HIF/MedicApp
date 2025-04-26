import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true' && 
                         localStorage.getItem('accessToken');

  const currentPath = window.location.pathname;
  const isAdminRoute = currentPath.startsWith('/admin');
  const userStatus = localStorage.getItem('userStatus');
  
  // If not authenticated at all, redirect based on user status
  if (!isAuthenticated) {
    localStorage.clear(); // Clear all storage for security
    if (userStatus === 'system_admin') {
      return <Navigate to="/master" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // For admin routes, check if user has admin status
  if (isAdminRoute) {
    // If user is not an admin, redirect to normal dashboard
    if (userStatus !== 'system_admin') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return element;
};

export default ProtectedRoute;
