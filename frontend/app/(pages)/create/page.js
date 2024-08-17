"use client";

import { useState } from "react";
import Link from "next/link";

export default function Create() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleCreate = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const response = await fetch('http://localhost:3001/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ createUsername: username, createPassword: password })
            });

            if (response.ok) {
                setSuccessMessage('User created successfully. You can now log in.');
                setUsername('');
                setPassword('');
            } else if (response.status === 409) {
                setErrorMessage('Username already in use.');
            } else if (response.status === 400) {
                setErrorMessage('Password must contain at least one uppercase letter, one number, and one symbol.');
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
        } catch (error) {
            setErrorMessage('Failed to create account.');
        }
    }

    return (
        <div className="grid md:grid-cols-2 grid-rows-1 py-16">
            <div className="px-5 py-5 bg-neutral-100 text-center w-full align-middle content-center">
                <h1 className="text-2xl font-bold">Create Account</h1>
                <p>Enter username and password below to create an account.</p>
                {errorMessage && <div className="bg-red-600 text-white items-center p-2 rounded-lg mt-3">{errorMessage}</div>}
                {successMessage && <div className="bg-green-600 text-white items-center p-2 rounded-lg mt-3">{successMessage}</div>}
            </div>
            <div className="px-5">
                <form onSubmit={handleCreate}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label htmlFor="create-username">Username</label>
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                id="create-username"
                                type="text"
                                placeholder="username"
                                autoComplete="username"
                                className="border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="create-password">Password</label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="create-password"
                                type="password"
                                placeholder="password"
                                autoComplete="current-password"
                                className="border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-black text-white py-2 px-4 hover:bg-indigo-800">
                            Create account
                        </button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="underline">
                            Log in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
