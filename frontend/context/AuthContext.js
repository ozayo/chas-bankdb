"use client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const router = useRouter();

    const [authState, setAuthState] = useState(() => {
        if (typeof window !== "undefined") {
            const savedAuthState = localStorage.getItem("authState");
            return savedAuthState ? JSON.parse(savedAuthState) : {
                user: "",
                isLoggedIn: false,
                userId: "",
                token: "",
                balance: 0
            };
        }
        return {
            user: "",
            isLoggedIn: false,
            userId: "",
            token: "",
            balance: 0
        };
    });

    useEffect(() => {
        localStorage.setItem("authState", JSON.stringify(authState));
    }, [authState]);

    const login = async (username, password) => {
        const response = await fetch('http://localhost:3001/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            setAuthState({
                ...authState,
                user: username,
                isLoggedIn: true,
                userId: data.userId,
                token: data.token
            });
            router.push('/account'); // Giriş sonrası kullanıcıyı hesap sayfasına yönlendir
        } else {
            throw new Error("Login failed");
        }
    };

    const logout = () => {
        setAuthState({
            user: "",
            isLoggedIn: false,
            userId: "",
            token: "",
            balance: 0
        });
        localStorage.removeItem("authState");
        router.push('/login'); // Çıkış sonrası kullanıcıyı giriş sayfasına yönlendir
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
