import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { username, token }

    useEffect(() => {
        const storedToken = localStorage.getItem("jwtToken");
        const storedUser = localStorage.getItem("username");

        if (storedToken && storedUser) {
            setUser({
                        username: storedUser,
                        token: storedToken,
                    });
        }
    }, []);

    const login = ({ username, token }) => {
        setUser({ username, token });
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("username", username);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("username");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
