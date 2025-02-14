import React, { createContext, useContext, useEffect, useState } from "react";

export const Role = {
    Admin: "1",
    Petugas: "2",
    User: "3",
};

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        if (typeof window !== "undefined") {
            return window.localStorage.getItem("Key_Token");
        }
        return null;
    });

    useEffect(() => {
        if (token) {
            localStorage.setItem("Key_Token", token);
        }
    }, [token]);

    const login = (token) => {
        setToken(token);
        localStorage.setItem("Key_Token", token);
    };

    const logout = () => {
        localStorage.removeItem("Key_Token");
        setToken(null);
    };

    const isLogin = () => {
        return token !== null;
    };

    const isRole = () => {
        if (token == null) return null;
    
        try {
            const provider = JSON.parse(atob(token.split(".")[1]));
            console.log(provider);  // Debugging, lihat isi payload token
    
            // Mengambil role dari payload
            const roleID = provider.role; // Pastikan untuk mengambil 'role' di sini
            switch (roleID) {
                case 1:
                    return 'Admin';
                case 2:
                    return 'Petugas';
                case 3:
                    return 'User';
                default:
                    return null;
            }
        } catch (error) {
            console.error('Format token tidak valid', error);
            return null;
        }
    };  

    return (
        <AuthContext.Provider
            value={{
                token,
                login,
                logout,
                isLogin: isLogin(),
                isRole: isRole(),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const auth = useContext(AuthContext);
    if (auth === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return auth;
};
