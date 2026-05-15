import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/axiosConfig";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const savedRole = localStorage.getItem("role");
      if (token && savedRole) {
        setRole(savedRole);
        try {
          const response = await API.get("/users/profile");
          setUser(response.data);
        } catch (err) {
          console.error("Failed to fetch profile", err);
          // If profile fetch fails, maybe the token is invalid
          // logoutUser(); 
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const loginUser = (token, userRole) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", userRole);
    setRole(userRole);
    // Profile will be fetched by useEffect on next render or we can fetch it here
    const fetchProfile = async () => {
      try {
        const response = await API.get("/users/profile");
        setUser(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  };
  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
