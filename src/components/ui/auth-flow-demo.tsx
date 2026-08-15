"use client";

import React from "react";
import { AuthFlow, Role } from "@/components/ui/auth-flow";

export default function AuthFlowDemo() {
  const handleRoleSelected = (role: Role) => {
    console.log("Selected role in demo:", role);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white p-4 sm:p-8 flex items-center justify-center">
      <AuthFlow onRoleSelected={handleRoleSelected} />
    </div>
  );
}
