import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utilis/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (authUser, retries = 2) => {
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`Fetching user profile, attempt ${i + 1}...`); // Debug log
        
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();
        
        if (!error && userData) {
          console.log('User profile fetched successfully:', userData); // Debug log
          return userData;
        }
        
        if (error) {
          console.log('Error fetching user profile:', error);
          
          // If user doesn't exist, only retry once and then give up
          if (error.code === 'PGRST116' || error.message.includes('No rows found')) {
            console.log('User not found in database');
            if (i === retries - 1) {
              console.log('Final attempt failed, user does not exist in database');
              return null;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          
          // For other errors, stop retrying
          console.log('Non-recoverable error, stopping retries');
          break;
        }
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    console.log('fetchUserProfile returning null after all attempts');
    return null;
  };

  const refreshUserProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user);
        if (userProfile) {
          setUser(userProfile);
          return userProfile;
        }
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
    }
    return null;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...'); // Debug log
        
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Current session:', session ? 'Found' : 'None'); // Debug log
        
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user);
          
          if (userProfile) {
            setUser(userProfile);
            localStorage.setItem('token', session.access_token);
            console.log('Auth initialized with user:', userProfile.email); // Debug log
          } else {
            console.log('Auth user exists but no profile found - clearing session'); // Debug log
            // If user doesn't exist in database, clear everything
            await supabase.auth.signOut();
            localStorage.removeItem('token');
            setUser(null);
          }
        } else {
          localStorage.removeItem('token');
          setUser(null);
          console.log('No session found'); // Debug log
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
        console.log('Auth initialization complete'); // Debug log
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session ? 'with session' : 'no session'); // Debug log
        
        if (event === 'SIGNED_IN' && session?.user) {
          // For Google OAuth, give time for backend to create user, but with timeout
          const userProfile = await fetchUserProfile(session.user, 3); 
          
          if (userProfile) {
            setUser(userProfile);
            localStorage.setItem('token', session.access_token);
            console.log('User signed in:', userProfile.email); // Debug log
          } else {
            console.log('Signed in but no user profile found - signing out'); // Debug log
            // If we can't find the user in database, sign out
            await supabase.auth.signOut();
            localStorage.removeItem('token');
            setUser(null);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('token');
          console.log('User signed out'); // Debug log
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const logout = async () => {
    console.log('Logging out...'); // Debug log
    await supabase.auth.signOut();
    localStorage.removeItem('token');
    setUser(null);
  };

  const hasRole = (role) => user?.role === role;
  const hasAnyRole = (roles) => user && roles.includes(user.role);

  const contextValue = {
    user, 
    loading, 
    logout, 
    hasRole, 
    hasAnyRole,
    isAdmin: user?.role === 'admin',
    isModerator: user?.role === 'moderator',
    refreshUserProfile // Expose this for manual refresh if needed
  };

  console.log('AuthContext render - User:', user ? user.email : 'None', 'Loading:', loading); // Debug log

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};