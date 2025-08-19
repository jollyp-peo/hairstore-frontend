import { Navigate, useLocation } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

function ProtectedRoute({ children }) {   
  const { user, loading } = useAuth();   
  const location = useLocation();

  console.log('ProtectedRoute - User:', user ? user.email : 'None', 'Loading:', loading, 'Path:', location.pathname);

  // Show spinner while loading
  if (loading) {     
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Spinner />
        <p className="mt-4 text-gray-500">Loading...</p>
      </div>
    );
  }

  // If no user after loading is complete, redirect to login
  if (!user) {     
    console.log('No user found, redirecting to login with redirect:', location.pathname);
    return (       
      <Navigate         
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}         
        replace       
      />     
    );   
  }

  // User is authenticated, render the protected content
  console.log('User authenticated, rendering protected content');
  return children; 
}  
export default ProtectedRoute;
