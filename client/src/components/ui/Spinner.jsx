import React from 'react';

export default function Spinner({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 36,
  };

  const px = sizeMap[size] || 24;

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      role="status"
      aria-label="Loading"
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="animate-spin"
        style={{ color: 'var(--text-primary)' }}
      >
        <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
        <path d="M12 2a10 10 0 0 1 10 10" />
      </svg>
    </div>
  );
}
