import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { type MatchItem } from "../../../entities/game/levels";
import { useGameStore } from "../../../shared/store/useGameStore";
import styles from "./TargetCard.module.css";

interface TargetCardProps {
  item: MatchItem | null;
  category?: string | null;
}

export const TargetCard: React.FC<TargetCardProps> = ({ item }) => {
  const { setNodeRef, isOver } = useDroppable({ id: "target-zone" });
  const languageMode = useGameStore((state) => state.languageMode);

  if (!item) return null;

  // Show Belarusian word if mode is 'by' AND the item has one; otherwise English
  const displayWord =
    languageMode === "by" && item.belarusianWord
      ? item.belarusianWord
      : item.word;

  return (
    <div
      ref={setNodeRef}
      id="target-zone"
      style={{ gridArea: "target-zone" }}
      className={`${styles.card} ${isOver ? styles.isOver : ""}`}
    >
      <div className={styles.targetWrapper}>
        <div className={`${styles.glow} ${isOver ? styles.activeGlow : ""}`} />
        <div className={styles.target}>
          <p className={styles.word}>{displayWord}</p>
        </div>
      </div>
    </div>
  );
};
