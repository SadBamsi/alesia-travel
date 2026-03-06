import React from "react";
import { useGameStore } from "./shared/store/useGameStore";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  rectIntersection,
  type DragEndEvent,
  type CollisionDetection,
} from "@dnd-kit/core";

// Custom collision detection to handle 40% overlap
const customCollisionDetection: CollisionDetection = (args) => {
  const { droppableContainers, collisionRect } = args;

  // First check built-in rect intersection
  const intersections = rectIntersection(args);

  if (intersections.length > 0) {
    const targetIntersection = intersections.find(
      (i) => i.id === "target-zone",
    );

    if (targetIntersection) {
      const targetContainer = droppableContainers.find(
        (c) => c.id === "target-zone",
      );

      if (targetContainer && targetContainer.rect.current) {
        const droppableRect = targetContainer.rect.current;

        // Calculate overlap area
        const overlapX = Math.max(
          0,
          Math.min(collisionRect.right, droppableRect.right) -
            Math.max(collisionRect.left, droppableRect.left),
        );
        const overlapY = Math.max(
          0,
          Math.min(collisionRect.bottom, droppableRect.bottom) -
            Math.max(collisionRect.top, droppableRect.top),
        );

        const overlapArea = overlapX * overlapY;
        const activeArea = collisionRect.width * collisionRect.height;

        // Check if overlap is > 10% of the active (draggable) card area
        if (overlapArea / activeArea >= 0.1) {
          return [targetIntersection];
        }
      }
    }
  }

  return [];
};
import { StartScreen } from "./features/matching/ui/StartScreen";
import { TargetCard } from "./features/matching/ui/TargetCard";
import { MatchingGrid } from "./features/matching/ui/MatchingGrid";
import { CelebrationOverlay } from "./features/matching/ui/CelebrationOverlay";
import { FailingOverlay } from "./features/matching/ui/FailingOverlay";
import { ScoreBoard } from "./features/matching/ui/ScoreBoard";
import { Loader } from "./shared/ui/cmponents/Loader/Loader";
import "./App.css";

import styles from "./App.module.css";

const App: React.FC = () => {
  const {
    currentCategory,
    targetItem,
    options,
    isCelebrating,
    isFailing,
    view,
    backToMap,
    checkMatch,
    miniGamesPlayed,
    miniGamesCorrect,
    isLoadingAnimals,
  } = useGameStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // was 8 — reduced to avoid visible jump on mouse drag start
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    console.log("Drag Ended:", { overId: over?.id, activeId: active.id });

    if (over && over.id === "target-zone") {
      checkMatch(active.id as string);
    }
  };

  if (view === "map") {
    return <StartScreen />;
  }

  if (isLoadingAnimals) {
    return <Loader text="Loading animals..." />;
  }

  const wrongCount = miniGamesPlayed - miniGamesCorrect;

  return (
    <div className={styles.container}>
      <CelebrationOverlay isVisible={isCelebrating} />
      <FailingOverlay isVisible={isFailing} />

      <button className={styles.backButton} onClick={backToMap}>
        ⬅ Map
      </button>

      <DndContext
        sensors={sensors}
        collisionDetection={customCollisionDetection}
        onDragEnd={handleDragEnd}
      >
        <div className={styles.content}>
          <ScoreBoard correct={miniGamesCorrect} wrong={wrongCount} />

          <div className={styles.gameBoard}>
            <TargetCard item={targetItem} category={currentCategory} />
            <MatchingGrid options={options} />
          </div>

          <div className="mt-8">
            <p className={styles.hint}>Drag the right picture to the box!</p>
          </div>
        </div>
      </DndContext>
    </div>
  );
};

export default App;
