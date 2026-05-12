import React from 'react';

const AnantapurLogo = ({ className = "w-20 h-24 lg:w-24 lg:h-28" }) => {
  return (
    <div className={`relative flex flex-col items-center justify-center ${className} shrink-0`}>
      {/* Background Shield SVG */}
      <svg viewBox="0 0 100 120" className="absolute inset-0 w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="25%" stopColor="#fff3b0" />
            <stop offset="50%" stopColor="#aa7c11" />
            <stop offset="75%" stopColor="#f8e076" />
            <stop offset="100%" stopColor="#6e4f04" />
          </linearGradient>
          <linearGradient id="goldOuter" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff1ba" />
            <stop offset="20%" stopColor="#d4af37" />
            <stop offset="80%" stopColor="#aa7c11" />
            <stop offset="100%" stopColor="#4a3501" />
          </linearGradient>
          <linearGradient id="bluebg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#08102b" />
            <stop offset="100%" stopColor="#142c66" />
          </linearGradient>
          <linearGradient id="redbg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b91313" />
            <stop offset="100%" stopColor="#630606" />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.6" />
          </filter>
        </defs>
        
        {/* Outer Gold Border - multiple layers for 3D effect */}
        <path d="M 50 118 C 50 118, 98 85, 98 25 C 98 12, 50 2, 50 2 C 50 2, 2 12, 2 25 C 2 85, 50 118, 50 118 Z" fill="url(#goldOuter)" filter="url(#shadow)" />
        <path d="M 50 115 C 50 115, 95 83, 95 25 C 95 14, 50 5, 50 5 C 50 5, 5 14, 5 25 C 5 83, 50 115, 50 115 Z" fill="#6e4f04" />
        <path d="M 50 114 C 50 114, 94 82, 94 25 C 94 15, 50 6, 50 6 C 50 6, 6 15, 6 25 C 6 82, 50 114, 50 114 Z" fill="url(#gold)" />
        
        {/* Inner Left Blue */}
        <path d="M 50 112 C 50 112, 8 81, 8 26 C 8 16, 50 8, 50 8 Z" fill="url(#bluebg)" />
        
        {/* Inner Right Red */}
        <path d="M 50 112 C 50 112, 92 81, 92 26 C 92 16, 50 8, 50 8 Z" fill="url(#redbg)" />
        
        {/* Laurel Wreaths (7 leaves each side) */}
        <g filter="url(#shadow)">
          {/* Left Branch */}
          <path d="M 22 85 Q 10 60 25 40" fill="none" stroke="url(#gold)" strokeWidth="1.5" />
          {/* Left Leaves - starting from top */}
          <path d="M 23 40 Q 21 34 26 35 Q 28 38 23 40 Z" fill="url(#gold)" />
          <path d="M 19 45 Q 16 38 23 40 Q 25 43 19 45 Z" fill="url(#gold)" />
          <path d="M 17 52 Q 13 45 20 47 Q 22 50 17 52 Z" fill="url(#gold)" />
          <path d="M 15 59 Q 11 52 18 54 Q 20 57 15 59 Z" fill="url(#gold)" />
          <path d="M 15 66 Q 11 59 18 61 Q 20 64 15 66 Z" fill="url(#gold)" />
          <path d="M 16 73 Q 12 66 19 68 Q 21 71 16 73 Z" fill="url(#gold)" />
          <path d="M 19 80 Q 15 73 22 75 Q 24 78 19 80 Z" fill="url(#gold)" />

          {/* Right Branch */}
          <path d="M 78 85 Q 90 60 75 40" fill="none" stroke="url(#gold)" strokeWidth="1.5" />
          {/* Right Leaves - starting from top */}
          <path d="M 77 40 Q 79 34 74 35 Q 72 38 77 40 Z" fill="url(#gold)" />
          <path d="M 81 45 Q 84 38 77 40 Q 75 43 81 45 Z" fill="url(#gold)" />
          <path d="M 83 52 Q 87 45 80 47 Q 78 50 83 52 Z" fill="url(#gold)" />
          <path d="M 85 59 Q 89 52 82 54 Q 80 57 85 59 Z" fill="url(#gold)" />
          <path d="M 85 66 Q 89 59 82 61 Q 80 64 85 66 Z" fill="url(#gold)" />
          <path d="M 84 73 Q 88 66 81 68 Q 79 71 84 73 Z" fill="url(#gold)" />
          <path d="M 81 80 Q 85 73 78 75 Q 76 78 81 80 Z" fill="url(#gold)" />
        </g>
      </svg>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center w-full h-full pt-[14%] pb-[10%]">
        
        {/* Top Text - single line */}
        <h2 
          className="text-[5.5px] sm:text-[6.5px] lg:text-[7.5px] font-bold text-white tracking-wider mb-0.5 z-20 text-center uppercase whitespace-nowrap" 
          style={{ 
            fontFamily: "Arial, sans-serif", 
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
            transform: 'scaleY(1.1)' 
          }}
        >
          ANANTHAPURAMU POLICE
        </h2>

        {/* Ashok Stambh */}
        <div className="w-[20%] aspect-square flex items-center justify-center mb-0.5 mt-0.5 z-20">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
            alt="Emblem" 
            className="w-full h-full object-contain filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
            style={{ filter: 'brightness(0) saturate(100%) invert(75%) sepia(48%) saturate(1458%) hue-rotate(3deg) brightness(108%) contrast(106%) drop-shadow(0 2px 2px rgba(0,0,0,0.8))' }}
          />
        </div>

        {/* Center Clock Tower Circle */}
        <div 
          className="w-[46%] aspect-square rounded-full overflow-hidden shadow-2xl relative z-20 bg-sky-300 mt-0.5" 
          style={{ border: '3px solid #d4af37', boxShadow: '0 4px 15px rgba(0,0,0,0.8), inset 0 2px 5px rgba(0,0,0,0.5)' }}
        >
          {/* using a clock tower image with blue sky */}
          <img 
            src="https://images.unsplash.com/photo-1542361345-89e58247f2d5?auto=format&fit=crop&q=80&w=300" 
            alt="Clock Tower" 
            className="w-full h-full object-cover transform scale-[1.15]"
          />
        </div>

        {/* Bottom Ribbon */}
        <div className="absolute bottom-[10%] flex flex-col items-center z-30 w-[75%]">
          <div className="bg-gradient-to-r from-[#b48608] via-[#ffe373] to-[#b48608] px-2 py-[2px] shadow-[0_2px_5px_rgba(0,0,0,0.6)] border border-[#ffe373]/60 relative w-full text-center flex items-center justify-center rounded-[1px]">
            {/* Folded ends - left */}
            <div className="absolute -left-[4px] top-[4px] bottom-[-2px] w-3 bg-gradient-to-r from-[#6e4f04] to-[#b48608] -z-10 transform -skew-y-12"></div>
            {/* Folded ends - right */}
            <div className="absolute -right-[4px] top-[4px] bottom-[-2px] w-3 bg-gradient-to-l from-[#6e4f04] to-[#b48608] -z-10 transform skew-y-12"></div>
            <span className="text-[#3b1702] font-telugu text-[5px] lg:text-[6px] font-extrabold whitespace-nowrap leading-none mt-[1px] tracking-wide" style={{textShadow: '0 0.5px 0px rgba(255,255,255,0.4)'}}>
              సత్యమేవ జయతే
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnantapurLogo;
