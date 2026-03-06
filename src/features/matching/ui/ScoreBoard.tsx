import React from "react";
import styles from "./ScoreBoard.module.css";

interface ScoreBoardProps {
  correct: number;
  wrong: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ correct, wrong }) => {
  return (
    <div className={styles.scoreBoard}>
      <div className={styles.scoreItem}>
        <span className={styles.label}>Correct</span>
        <span className={`${styles.value} ${styles.correct}`}>{correct}</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.scoreItem}>
        <span className={styles.label}>Oops</span>
        <span className={`${styles.value} ${styles.wrong}`}>{wrong}</span>
      </div>
    </div>
  );
};
