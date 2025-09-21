"use client";

import React, { useState, useEffect } from "react";
import AuthForm from "@/components/Authform";

const AuthPage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500">
      <AuthForm />
    </div>
  );
};

export default AuthPage;
