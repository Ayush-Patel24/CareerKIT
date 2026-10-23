import React, { forwardRef } from 'react';
import './Input.css';

const Textarea = forwardRef(function Textarea({
  label,
  error,
  helperText,
  id,
  rows = 4,
  className = '',
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
      <div className={`input-wrapper ${error ? 'has-error' : ''}`}>
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          required={required}
          className="textarea-field"
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
      </div>
      {error && <p id={`${inputId}-error`} className="input-error-msg">{error}</p>}
      {!error && helperText && <p id={`${inputId}-helper`} className="input-helper-msg">{helperText}</p>}
    </div>
  );
});

export default Textarea;
