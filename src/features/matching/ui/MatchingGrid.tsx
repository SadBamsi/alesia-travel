import { type MatchItem } from "../../../entities/game/levels";
import { DraggableCard } from "./DraggableCard";
import styles from "./MatchingGrid.module.css";

interface MatchingGridProps {
  options: MatchItem[];
}

export const MatchingGrid: React.FC<MatchingGridProps> = ({ options }) => {
  const cardClassName = ["top-card", "left-card", "right-card", "bottom-card"];
  return (
    <>
      {options.map((item, i) => {
        return (
          <div
            key={item.id}
            style={{ gridArea: cardClassName[i] }}
            className={styles.positioner}
          >
            <DraggableCard item={item} />
          </div>
        );
      })}
    </>
  );
};
