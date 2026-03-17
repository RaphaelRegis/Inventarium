'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Alert.module.css';

export type AlertType = 'success' | 'error';

interface AlertProps {
  message: string;
  type: AlertType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Alert({ message, type, isVisible, onClose, duration = 5000 }: AlertProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!mounted || !isVisible) return null;

  return createPortal(
    <div className={`${styles.alert} ${styles[type]}`}>
      <span className={styles.icon}>
        {type === 'success' ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        )}
      </span>
      <p className={styles.message}>{message}</p>
      <button className={styles.closeBtn} onClick={onClose}>
        &times;
      </button>
    </div>,
    document.body
  );
}
