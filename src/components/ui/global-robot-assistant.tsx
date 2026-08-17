"use client";

import React from "react";
import { RobotOnly } from "./robot-only";

export function GlobalRobotAssistant() {
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100000] flex flex-col items-center pointer-events-none group">
      <div className="mb-1.5 opacity-85 group-hover:opacity-100 transition-opacity bg-slate-900/90 border border-slate-700/60 text-white text-[10px] font-mono-code px-2.5 py-1 rounded-full backdrop-blur-md shadow-2xl flex items-center space-x-1.5 pointer-events-auto">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span>AI Assistant</span>
      </div>
      <div className="w-28 h-28 sm:w-36 sm:h-36 relative drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] pointer-events-auto">
        <RobotOnly color="#ffffff" pantallaColor="#06b6d4" pantallaBrillo={1.6} metalness={0.5} className="w-full h-full" />
      </div>
    </div>
  );
}

export default GlobalRobotAssistant;
