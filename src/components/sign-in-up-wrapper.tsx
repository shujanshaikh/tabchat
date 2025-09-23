"use client";

import { useState } from "react";
import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

export default function SignInUpWrapper() {
    const [showSignIn, setShowSignIn] = useState(true);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            {showSignIn ? (
                <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
            ) : (
                <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
            )}
        </div>
    );
}
