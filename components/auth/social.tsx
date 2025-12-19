"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useState } from "react";

export const Social = () => {
    const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | null>(null);
  const onClick = (provider: "google" | "github") => {
    setLoadingProvider(provider); 
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        disabled={!!loadingProvider} 
        onClick={() => onClick("google")}
      >
        <FcGoogle className={`h-5 w-5 ${loadingProvider === "github" ? "animate-pulse" : ""}`} />
      </Button>
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        disabled={!!loadingProvider}
        onClick={() => onClick("github")}
      >
        <FaGithub className={`h-5 w-5 ${loadingProvider === "github" ? "animate-pulse" : ""}`} />
      </Button>
    </div>
  );
};