import React from 'react';
import './Badge.css';

export default function Badge({
  children,
  variant = 'default', // 'default' | 'outline' | 'success' | 'warning' | 'danger' | 'info'
  size = 'md',         // 'sm' | 'md'
  className = '',
  ...props
}) {
  return (
    <span className={`badge badge-${variant} badge-${size} ${className}`} {...props}>
      {children}
    </span>
  );
}
