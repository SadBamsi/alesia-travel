import React from "react";
import styles from "./Overlay.module.css";

interface CelebrationOverlayProps {
  isVisible: boolean;
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className={`${styles.overlay} ${styles.celebration}`}>
      <div className={`${styles.container} animate-bounce-slow`}>
        <div className={styles.ping}></div>
        <h1 className={styles.title}>🌟 GREAT! 🌟</h1>
        <p className={`${styles.subtitle} ${styles.celebrationText}`}>
          You found it!
        </p>
      </div>
    </div>
  );
};
