import { useAuth } from "../context/AuthContext";

// - Conditional rendering based on role
export const RoleGuard = ({ allowedRoles, children, fallback = null }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return fallback;
  }

  return children;
};