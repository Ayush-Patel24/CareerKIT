import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Delete',
  confirmVariant = 'danger',
  isLoading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="450px">
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div
          style={{
            padding: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--status-danger-bg)',
            color: 'var(--status-danger)',
            border: '1px solid var(--status-danger-border)',
            flexShrink: 0,
          }}
        >
          <AlertTriangle size={20} />
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
          {description}
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant={confirmVariant}
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
