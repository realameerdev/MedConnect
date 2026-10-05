import React from 'react';

interface MedConnectLogoProps {
  className?: string;
  size?: number | string;
  variant?: 'icon' | 'full' | 'compact' | 'monochrome';
  textClassName?: string;
  iconClassName?: string;
  showBadge?: boolean;
}

export const MedConnectLogo: React.FC<MedConnectLogoProps> = ({
  className = '',
  size = 32,
  variant = 'icon',
  textClassName = '',
  iconClassName = '',
  showBadge = false,
}) => {
  // Exact medical cross logo from reference design
  // Clean, minimalist, continuous monoline interlocking geometry
  const iconSvg = (
    <svg
      viewBox="0 0 100 100"
      width={typeof size === 'number' ? size : undefined}
      height={typeof size === 'number' ? size : undefined}
      className={`shrink-0 select-none overflow-visible ${iconClassName}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="MedConnect Medical Cross Logo"
    >
      {/* Loop 1: Top-Left interlocking arm */}
      <path
        d="M 59 43 
           L 25 43 
           A 8 8 0 0 0 17 51 
           A 8 8 0 0 0 25 59 
           L 27 59 
           C 35.8 59 43 51.8 43 43 
           L 43 25 
           A 8 8 0 0 1 51 17 
           A 8 8 0 0 1 59 25 
           Z"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Loop 2: Bottom-Right interlocking arm */}
      <path
        d="M 59 43 
           L 77 43 
           A 8 8 0 0 1 85 51 
           A 8 8 0 0 1 77 59 
           L 59 59 
           C 50.2 59 43 66.2 43 75 
           L 43 77 
           A 8 8 0 0 0 51 85 
           A 8 8 0 0 0 59 77 
           L 59 43"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
        {iconSvg}
      </div>
    );
  }

  // Full Brand Logo with Typography
  return (
    <div className={`inline-flex items-center space-x-2.5 shrink-0 ${className}`}>
      {iconSvg}
      <div className="flex flex-col text-left leading-none font-manrope">
        <span className={`text-lg md:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center ${textClassName}`}>
          <span>Med</span>
          <span className="text-sky-500 font-extrabold ml-0.5">Connect</span>
        </span>
        {showBadge && (
          <span className="text-[9px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-bold mt-0.5">
            Clinical Health
          </span>
        )}
      </div>
    </div>
  );
};

export default MedConnectLogo;
