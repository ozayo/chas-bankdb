"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import Link from "next/link";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            await login(username, password);
            // Başarılı giriş sonrası yönlendirme yapılabilir
        } catch (error) {
            setErrorMessage('Login failed. Please check your credentials.');
        }
    }

    return (
        <form onSubmit={handleLogin}>		
            <div className="grid md:grid-cols-2 grid-rows-1 py-16">
                <div className="px-5 py-5 bg-neutral-100 text-center w-full align-middle content-center">
                    <h1 className="text-2xl font-bold mb-3">Login</h1>
                    <p>Enter username and password below to access your account.</p>
                    {errorMessage && <div className="bg-red-600 text-white items-center p-2 rounded-lg mt-3">{errorMessage}</div>}
                </div>
                <div className="px-5">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label htmlFor="usernameInputId">Username</label>
                            <input
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                                id="usernameInputId"
                                type="text"
                                placeholder="username"
                                autoComplete="username"
                                className="border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="passwordInputId">Password</label>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                id="passwordInputId"
                                type="password"
                                placeholder="password"
                                autoComplete="current-password"
                                className="border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-black text-white py-2 px-4 hover:bg-indigo-800">
                            Login
                        </button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        {"Don't have an account?"}{" "}
                        <Link href="/create" className="underline">
                            Create account
                        </Link>
                    </div>
                </div>
            </div>
        </form>
    );
}
