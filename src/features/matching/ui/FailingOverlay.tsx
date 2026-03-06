import React from "react";
import styles from "./Overlay.module.css";

interface FailingOverlayProps {
  isVisible: boolean;
}

export const FailingOverlay: React.FC<FailingOverlayProps> = ({
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className={`${styles.overlay} ${styles.failing}`}>
      <div className={`${styles.container} animate-shake`}>
        <h1 className={styles.title}>❌ OOPS! ❌</h1>
        <p className={`${styles.subtitle} ${styles.failingText}`}>Try again!</p>
      </div>
    </div>
  );
};
