import React, { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(function Input({
  label,
  error,
  helperText,
  id,
  type = 'text',
  className = '',
  leftIcon = null,
  rightIcon = null,
  required = false,
  ...props
}, ref) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required" aria-hidden="true">*</span>}
        </label>
      )}
      <div className={`input-wrapper ${leftIcon ? 'has-left-icon' : ''} ${rightIcon ? 'has-right-icon' : ''} ${error ? 'has-error' : ''}`}>
        {leftIcon && <span className="input-icon-left">{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          type={type}
          required={required}
          className="input-field"
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {rightIcon && <span className="input-icon-right">{rightIcon}</span>}
      </div>
      {error && <p id={`${inputId}-error`} className="input-error-msg">{error}</p>}
      {!error && helperText && <p id={`${inputId}-helper`} className="input-helper-msg">{helperText}</p>}
    </div>
  );
});

export default Input;
