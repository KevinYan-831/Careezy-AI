import React from 'react';

interface LogoProps {
  className?: string;
  hideText?: boolean;
}

export const CareezyLogo: React.FC<LogoProps> = ({ className = "h-10", hideText = false }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon: Graduation Cap + Clipboard Document */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto text-teal-600"
      >
        {/* Document Body */}
        <rect x="20" y="30" width="60" height="65" rx="8" stroke="currentColor" strokeWidth="6" fill="white" />
        
        {/* Document Lines */}
        <rect x="35" y="50" width="20" height="6" rx="2" fill="currentColor" />
        <rect x="35" y="65" width="30" height="6" rx="2" fill="currentColor" />
        <rect x="35" y="80" width="30" height="6" rx="2" fill="currentColor" />
        
        {/* Graduation Cap (Stylized on top) */}
        <path 
          d="M10 30 L50 10 L90 30 L50 50 L10 30 Z" 
          fill="currentColor" 
          stroke="currentColor" 
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {/* Tassel */}
        <path d="M90 30 V45" stroke="currentColor" strokeWidth="4" />
        <circle cx="90" cy="48" r="3" fill="currentColor" />
      </svg>
      
      {!hideText && (
        <span className="font-bold text-3xl text-teal-800 tracking-tight">
          Careezy
        </span>
      )}
    </div>
  );
};