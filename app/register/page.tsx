"use client"

import { useState } from "react";

export default function RegisterPage() {
    const [role, setRole] = useState<"USER" | "ORGANIZER">("USER");

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border ronded-xl shadow-md">
            <h1 className="text-2xl font-bold mb-4">Zarejestruj się 📝</h1>

            <div>
                <button 
                onClick={() => setRole("USER")}
                className={`px-4 py-2 rounded ${role === "USER" ? "bg-blue-600 text-white" : "bg-gray-200"}`} >
                Jestem uczestnikiem
                </button>
                <button 
                onClick={() => setRole("ORGANIZER")}
                className={`px-4 py-2 rounded ${role === "ORGANIZER" ? "bg-blue-600 text-white" : "bg-gray-200"}`} >
                Jestem Organizatorem
                </button>
            </div>

            {role === "ORGANIZER" && (
                <p className="text-sm text-amber-600 mb-4 italic">
                    Pamiętaj: jako organizator będziesz musiał zostać zweryfikowany przez admina przed dodaniem pierwszego eventu.
                </p>
            )}
        </div>
    );
}