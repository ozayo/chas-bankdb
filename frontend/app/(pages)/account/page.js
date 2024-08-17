"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

export default function Account() {
    const { authState } = useAuth();
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await fetch('http://localhost:3001/me/accounts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token: authState.token })
                });

                if (response.ok) {
                    const data = await response.json();
                    setBalance(parseFloat(data.amount).toFixed(2));
                } else {
                    setErrorMessage('Failed to fetch account balance.');
                }
            } catch (error) {
                setErrorMessage('Failed to fetch account balance.');
            }
        };

        fetchBalance();
    }, [authState.token]);

    const handleTransaction = async (type) => {
        setErrorMessage('');
        try {
            const response = await fetch(`http://localhost:3001/me/accounts/transactions/${type}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: authState.token, amount })
            });

            if (response.ok) {
                const newBalance = await response.text();
                setBalance(parseFloat(newBalance).toFixed(2));
                setAmount('');
            } else {
                setErrorMessage('Transaction failed.');
            }
        } catch (error) {
            setErrorMessage('Transaction failed.');
        }
    };

    return (
        <div className="min-h-96">
            <div className="my-4">
                <h1 className="text-2xl font-bold mb-3">My Account</h1>
                <p>Hello {authState.user}!</p>
            </div>
            <div className="flex flex-col gap-4">
                <div className="my-3">
                    <h2 className="text-xl font-bold mb-3">Account info:</h2>
                    <div className="grid grid-cols-2 gap-10">
                        <div className="bg-neutral-100 rounded-lg text-black p-8 text-center shadow-sm">
                            <p>Username:&nbsp;</p>
                            <p className="font-bold text-lg mt-2">{authState.user}</p>
                        </div>
                        <div className="bg-black rounded-lg text-white p-8 text-center">
                            <p>Balance:&nbsp;</p>
                            <p className="font-bold text-lg mt-2">{balance}$</p>
                        </div>
                    </div>
                </div>

                <div className="items-center">
                    <h2 className="text-xl font-bold mb-3">Deposit or withdraw money</h2>
                    <label htmlFor="amountInput" className="font-medium">Amount&nbsp;</label>
                    <div className="flex flex-row gap-4 items-center">
                        <input
                            id="amountInput"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="border border-gray-300 rounded-md p-2"
                        />
                        <button
                            className="flex gap-1 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-sm"
                            onClick={() => handleTransaction('deposit')}
                        >
                            <FaPlus className="mt-1" /> Deposit
                        </button>
                        <button
                            className="flex gap-1 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-sm"
                            onClick={() => handleTransaction('withdraw')}
                        >
                            <FaMinus className="mt-1" /> Withdraw
                        </button>
                    </div>
                </div>
                <div className="flex flex-row w-full justify-center gap-8">
                    {errorMessage && <p className="text-red-500 font-bold">{errorMessage}</p>}
                </div>
            </div>
        </div>
    );
}
