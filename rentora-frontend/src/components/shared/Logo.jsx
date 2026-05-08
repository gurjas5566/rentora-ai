import React from 'react';

const Logo = ({ size = 200, className = "" }) => (
  <div 
    className={`flex items-center justify-start overflow-hidden ${className}`}
    style={{ height: size, width: 'auto' }}
  >
    <img 
      src="/assets/rentora_logo.png" 
      alt="Rentora Logo" 
      className="h-full w-auto object-contain"
    />
  </div>
);

export default Logo;
