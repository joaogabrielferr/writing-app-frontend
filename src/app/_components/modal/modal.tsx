'use client'
import { useEffect, ReactNode } from "react";
import styles from "./modal.module.css";

type ModalSize = "small" | "medium" | "large";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: ModalSize;
  actionText?: string;
  loading: boolean;
  onAction?: () => void;
  showCancelButton?:boolean
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  actionText = "Confirm",
  loading,
  onAction,
  showCancelButton = true
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={`${styles.modal} ${styles[size]}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className={styles.body}>{children}</div>

        <div className={styles.footer}>
            {
                showCancelButton && <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
            }

          {onAction && (
            <button onClick={onAction} className={styles.actionButton} disabled = {loading}>
              {actionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
