import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import * as Icons from "lucide-react";
import { type MatchItem } from "../../../entities/game/levels";
import styles from "./DraggableCard.module.css";

interface DraggableCardProps {
  item: MatchItem;
  style?: React.CSSProperties;
}

export const DraggableCard: React.FC<DraggableCardProps> = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
      data: {
        item,
      },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const isIcon = item.imageUrl.startsWith("icon:");
  const iconName = isIcon ? item.imageUrl.replace("icon:", "") : "";

  // Dynamically get the icon component or fallback to QuestionMark
  const IconComponent = isIcon
    ? (Icons[iconName as keyof typeof Icons] as React.ElementType) ||
      Icons.HelpCircle
    : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`${styles.draggableCard} ${isDragging ? styles.dragging : ""}`}
    >
      {IconComponent ? (
        <div className={styles.iconWrapper}>
          <IconComponent size="100%" strokeWidth={1.5} />
        </div>
      ) : (
        <img src={item.imageUrl} alt={item.word} className={styles.image} />
      )}
    </div>
  );
};
