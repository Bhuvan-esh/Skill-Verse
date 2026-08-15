'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Minus, Square, X, Move } from 'lucide-react';

export interface FloatingWindowProps {
  id: string;
  title: string;
  initialX?: number;
  initialY?: number;
  initialWidth?: number;
  initialHeight?: number;
  zIndex: number;
  isMinimized: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  children: React.ReactNode;
}

export default function FloatingWindow({
  id,
  title,
  initialX = 100,
  initialY = 80,
  initialWidth = 520,
  initialHeight = 420,
  zIndex,
  isMinimized,
  onFocus,
  onClose,
  onMinimize,
  children,
}: FloatingWindowProps) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const [isMaximized, setIsMaximized] = useState(false);

  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  // Update initial pos if props change
  useEffect(() => {
    setPos({ x: initialX, y: initialY });
  }, [initialX, initialY]);

  // Window Drag Handler
  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if (isMaximized) return;
    onFocus();
    isDragging.current = true;
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };

    const handleMouseMove = (ev: MouseEvent) => {
      if (!isDragging.current) return;
      const newX = Math.max(10, Math.min(window.innerWidth - 100, ev.clientX - dragStart.current.x));
      const newY = Math.max(10, Math.min(window.innerHeight - 100, ev.clientY - dragStart.current.y));
      setPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Window Resize Handler
  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFocus();
    isResizing.current = true;
    resizeStart.current = { x: e.clientX, y: e.clientY, w: size.width, h: size.height };

    const handleMouseMove = (ev: MouseEvent) => {
      if (!isResizing.current) return;
      const newWidth = Math.max(320, resizeStart.current.w + (ev.clientX - resizeStart.current.x));
      const newHeight = Math.max(260, resizeStart.current.h + (ev.clientY - resizeStart.current.y));
      setSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  if (isMinimized) return null;

  return (
    <div
      onClick={onFocus}
      style={{
        position: 'fixed',
        left: isMaximized ? 0 : pos.x,
        top: isMaximized ? 0 : pos.y,
        width: isMaximized ? '100vw' : size.width,
        height: isMaximized ? '100vh' : size.height,
        zIndex: zIndex,
      }}
      className="card-wrap transition-shadow duration-300"
    >
      <div className="card h-full flex flex-col justify-between overflow-hidden shadow-2xl relative border border-white/20">
        
        {/* Window Title Bar (Drag Handle) */}
        <div
          onMouseDown={handleMouseDownHeader}
          className="card-top select-none cursor-grab active:cursor-grabbing border-b border-white/10 pb-3 mb-3 flex items-center justify-between"
        >
          {/* Left Window Control Buttons (macOS Style) */}
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors flex items-center justify-center group"
              title="Close"
            >
              <X className="w-2 h-2 text-rose-950 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onMinimize(); }}
              className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-600 transition-colors flex items-center justify-center group"
              title="Minimize"
            >
              <Minus className="w-2 h-2 text-amber-950 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }}
              className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors flex items-center justify-center group"
              title="Maximize"
            >
              <Square className="w-1.5 h-1.5 text-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* Window Title */}
          <div className="flex items-center space-x-1.5 text-xs font-mono-code font-bold text-slate-200">
            <Move className="w-3.5 h-3.5 text-purple-400 opacity-60" />
            <span className="truncate max-w-[200px]">{title}</span>
          </div>

          {/* Sparkle Icon */}
          <span className="text-purple-400 text-xs font-mono-code">✦</span>
        </div>

        {/* Window Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-left">
          {children}
        </div>

        {/* Bottom Resize Handle Corner */}
        {!isMaximized && (
          <div
            onMouseDown={handleMouseDownHeader}
            className="absolute bottom-1 right-1 w-4 h-4 cursor-se-resize flex items-center justify-center opacity-40 hover:opacity-100"
            onMouseDownCapture={handleMouseDownResize}
            title="Resize Window"
          >
            <div className="w-2 h-2 border-r-2 border-b-2 border-purple-400" />
          </div>
        )}

      </div>
    </div>
  );
}
