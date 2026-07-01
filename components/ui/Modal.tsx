"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      {/* Click outside backdrop close handler */}
      <div className="absolute inset-0" onClick={onClose} />
      <div 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-bg-primary border border-border-primary rounded-2xl p-6 shadow-2xl space-y-4 relative z-10 overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-border-primary pb-3">
          {title ? (
            <h3 className="font-serif text-lg font-bold text-text-h">{title}</h3>
          ) : (
            <div />
          )}
          <button 
            onClick={onClose} 
            className="text-text-muted hover:text-text-h transition-colors p-1 rounded-full hover:bg-bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}
