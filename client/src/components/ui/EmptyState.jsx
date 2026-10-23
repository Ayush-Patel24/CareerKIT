import React from 'react';
import Button from './Button';
import './EmptyState.css';

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}) {
  return (
    <div className={`empty-state ${className}`}>
      {icon && <div className="empty-state-icon">{icon}</div>}
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {actionLabel && onAction && (
        <div className="empty-state-action">
          <Button variant="primary" onClick={onAction} leftIcon={actionIcon}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
