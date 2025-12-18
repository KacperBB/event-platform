"use client"

import { RegisterForm } from "@/components/RegisterForm";
import { useState } from "react";

export default function RegisterPage() {
    const [role, setRole] = useState<"USER" | "ORGANIZER">("USER");

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border ronded-xl shadow-md">
            <RegisterForm/>
        </div>
    );
}