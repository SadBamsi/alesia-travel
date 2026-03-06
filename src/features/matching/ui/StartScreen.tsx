import React, { useEffect } from "react";
import { useGameStore } from "../../../shared/store/useGameStore";
import * as Icons from "lucide-react";
import styles from "./StartScreen.module.css";
import { useAuthStore } from "../../../shared/store/useAuthStore";
import { FlagBY } from "../../../shared/ui/cmponents/flags/flag-by";
import { FlagEN } from "../../../shared/ui/cmponents/flags/flag-en";

const LEVEL_POSITIONS = [
  { top: "75.44%", left: "77.58%" }, // 1
  { top: "90.94%", left: "47.75%" }, // 2
  { top: "79.06%", left: "26.17%" }, // 3
  { top: "52.31%", left: "45.25%" }, // 4
  { top: "22.06%", left: "34.17%" }, // 5
  { top: "12.00%", left: "65.00%" }, // 6
];

const STAGE_NAMES = ["Colors Map", "Fruit Map", "Animal Map", "Shapes Map"];

export const StartScreen: React.FC = () => {
  const selectLevel = useGameStore((state) => state.selectLevel);
  const levelStatus = useGameStore((state) => state.levelStatus);
  const currentStageIndex = useGameStore((state) => state.currentStageIndex);
  const setStage = useGameStore((state) => state.setStage);
  const languageMode = useGameStore((state) => state.languageMode);
  const setLanguageMode = useGameStore((state) => state.setLanguageMode);
  const logout = useAuthStore((state) => state.logout);

  const isBelarusian = languageMode === "by";

  useEffect(() => {
    const stageStatus = levelStatus[currentStageIndex] || {};
    if (Object.keys(stageStatus).length === 6 && currentStageIndex < 3) {
      const timer = setTimeout(() => {
        setStage(currentStageIndex + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [levelStatus, currentStageIndex, setStage]);

  const handlePrevStage = () => {
    if (currentStageIndex > 0) setStage(currentStageIndex - 1);
  };

  const handleNextStage = () => {
    if (currentStageIndex < 3) setStage(currentStageIndex + 1);
  };

  const bgColors = ["#e0f7fa", "#fce4ec", "#e8f5e9", "#fff3e0"];

  return (
    <div
      className={styles.controlPanelWrapper}
      style={{ backgroundColor: bgColors[currentStageIndex] }}
    >
      {/* Top Control Panel */}
      <div className={styles.controlPanel}>
        {/* Map Navigation */}
        <div className={styles.navGroup}>
          <button
            className={styles.navBtn}
            onClick={handlePrevStage}
            disabled={currentStageIndex === 0}
            aria-label="Previous map"
          >
            <Icons.ChevronLeft size={28} />
          </button>
          <h2 className={styles.mapTitle}>{STAGE_NAMES[currentStageIndex]}</h2>
          <button
            className={styles.navBtn}
            onClick={handleNextStage}
            disabled={currentStageIndex === 3}
            aria-label="Next map"
          >
            <Icons.ChevronRight size={28} />
          </button>
        </div>

        {/* Logout Button */}
        <button className={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </div>

      {/* Map */}
      <div className={styles.mapContentWrapper}>
        <div className={styles.mapContainer}>
          <button
            className={styles.langToggle}
            onClick={() => setLanguageMode(isBelarusian ? "en" : "by")}
            title={
              isBelarusian ? "Switch to English" : "Пераключыцца на беларускую"
            }
            aria-label="Toggle language"
          >
            {isBelarusian ? <FlagBY /> : <FlagEN />}
          </button>

          <div className={styles.levelFlags}>
            {LEVEL_POSITIONS.map((pos, index) => {
              const stageStatus = levelStatus[currentStageIndex] || {};
              const flagStatus = stageStatus[index];
              const stars = flagStatus ? flagStatus.stars : 0;
              const isPlayed = !!flagStatus;

              return (
                <div
                  key={index}
                  className={styles.flag}
                  style={{
                    top: pos.top,
                    left: pos.left,
                    position: "absolute",
                    transform: "translate(-50%, -100%)",
                    cursor: "pointer",
                  }}
                  onClick={() => selectLevel(index)}
                >
                  <div className={styles.iconWrapper}>
                    <Icons.Flag
                      fill={isPlayed ? "#ffd93d" : "#ff4d4d"}
                      color={isPlayed ? "#b48c00" : "#990000"}
                      className={styles.flagIcon}
                      strokeWidth={2}
                    />
                    <span className={styles.levelNumber}>{index + 1}</span>
                  </div>
                  <div className={styles.stars}>
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        style={{ color: i < stars ? "#ffd93d" : "#cbd5e1" }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
