import { useEffect, useState } from "react"; 
import { useNavigate, useLocation } from "react-router-dom"; 
import { supabase } from "../utilis/supabaseClient"; 
import Spinner from "../components/Spinner";  

const API_URL = import.meta.env.VITE_API_URL;  

const AuthCallback = () => {   
  const navigate = useNavigate();   
  const location = useLocation();   
  const [loading, setLoading] = useState(true);   
  const [error, setError] = useState("");    

  // Properly decode the redirect path
  const redirectPath = new URLSearchParams(location.search).get("redirect") || "/";
  console.log("Redirect path from URL:", redirectPath); // Debug log

  useEffect(() => {     
    const handleAuth = async () => {       
      try {         
        console.log("Starting auth callback process..."); // Debug log
        
        // Wait for session to be available         
        await new Promise(resolve => setTimeout(resolve, 1000));          
        
        let session = null;         
        let attempts = 0;         
        const maxAttempts = 5;          

        while (!session && attempts < maxAttempts) {           
          const { data: { session: currentSession }, error } = await supabase.auth.getSession();           
          if (currentSession && !error) {             
            session = currentSession;             
            break;           
          }           
          attempts++;           
          await new Promise(resolve => setTimeout(resolve, 1000));         
        }          

        if (!session) {           
          throw new Error("No session found after Google login.");         
        }          

        console.log("Session found, storing token..."); // Debug log
        localStorage.setItem("token", session.access_token);          

        // Sync user to backend users table         
        console.log("Syncing user to backend..."); // Debug log
        const res = await fetch(`${API_URL}/api/auth/google/callback`, {           
          method: "POST",           
          headers: {             
            "Content-Type": "application/json",             
            "Authorization": `Bearer ${session.access_token}`           
          },         
        });          

        if (!res.ok) {           
          const data = await res.json();           
          throw new Error(data.message || "Backend user sync failed.");         
        }

        const userData = await res.json();
        console.log("User synced successfully:", userData); // Debug log

        // Small delay to ensure everything is processed
        await new Promise(resolve => setTimeout(resolve, 500));

        console.log("Navigating to:", redirectPath); // Debug log
        
        // Use React Router navigate instead of window.location
        navigate(redirectPath, { replace: true });
        
      } catch (err) {         
        console.error("Authentication callback error:", err);         
        setError(err.message);       
      } finally {         
        setLoading(false);       
      }     
    };      

    handleAuth();   
  }, [redirectPath, navigate]);    

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-600 text-center">
          <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  return (     
    <div className="flex flex-col items-center justify-center h-screen">       
      <Spinner />           
      <p className="mt-4 text-gray-500">Finishing login...</p>
      <p className="mt-2 text-sm text-gray-400">Redirecting to: {redirectPath}</p>         
    </div>   
  ); 
};  

export default AuthCallback;