import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api.js";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user"))
    );
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                try {
                    const res = await api.get("/profile");
                    setProfile(res.data.profile);
                } catch (err) {
                    console.error("Error fetching profile in AuthContext", err);
                }
            } else {
                setProfile(null);
            }
        };
        fetchProfile();
    }, [user]);

    const login = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        setProfile(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                userData: user,
                profile,
                setProfile,
                login,
                logout,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

