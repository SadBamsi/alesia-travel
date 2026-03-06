import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GAME_LEVELS, type MatchItem } from "../../entities/game/levels";
import { getAnimals, type Animal } from "../api/animalsApi";
import { putProgress, type ProgressData } from "../api/progressApi";

interface GameState {
  currentStageIndex: number;
  currentCategory: string | null;
  targetItem: MatchItem | null;
  options: MatchItem[];
  isCelebrating: boolean;
  isFailing: boolean;
  view: "map" | "game";
  currentLevelIndex: number | null;
  currentLevelErrors: number;
  miniGamesPlayed: number;
  miniGamesCorrect: number;
  levelStatus: Record<number, Record<number, { stars: number }>>;
  animalsFromApi: MatchItem[];
  isLoadingAnimals: boolean;
  languageMode: "en" | "by";

  // Actions
  initRound: () => void;
  checkMatch: (selectedId: string) => boolean;
  resetGame: () => void;
  selectLevel: (index: number) => void;
  backToMap: () => void;
  resetProgress: () => void;
  setStage: (index: number) => void;
  loadAnimals: () => Promise<void>;
  loadAnimalsForLevel: () => Promise<void>;
  setLanguageMode: (mode: "en" | "by") => void;
  /** Load progress fetched from the server — server data wins over localStorage. */
  loadProgress: (data: ProgressData) => void;
  /** Fire-and-forget save of current persistent fields to the server. */
  saveProgressToServer: () => void;
}

const CATEGORIES: ("Colors" | "Fruit" | "Animals" | "Shapes")[] = [
  "Colors",
  "Fruit",
  "Animals",
  "Shapes",
];

/** Convert API Animal to the MatchItem format the game uses */
function animalToMatchItem(animal: Animal): MatchItem {
  return {
    id: `api-animal-${animal.id}`,
    word: animal.englishName,
    belarusianWord: animal.belarussianName,
    imageUrl: animal.imageURL,
    category: "Animals",
  };
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentStageIndex: 0,
      currentCategory: null,
      targetItem: null,
      options: [],
      isCelebrating: false,
      isFailing: false,
      view: "map",
      currentLevelIndex: null,
      currentLevelErrors: 0,
      miniGamesPlayed: 0,
      miniGamesCorrect: 0,
      levelStatus: {},
      animalsFromApi: [],
      isLoadingAnimals: false,
      languageMode: "en",

      loadProgress: (data: ProgressData) => {
        set({
          levelStatus: data.levelStatus,
          currentStageIndex: data.currentStageIndex,
          languageMode: data.languageMode,
        });
      },

      saveProgressToServer: () => {
        const { levelStatus, currentStageIndex, languageMode } = get();
        putProgress({ levelStatus, currentStageIndex, languageMode });
      },

      setLanguageMode: (mode) => {
        set({ languageMode: mode });
        // Persist language choice to server asynchronously
        setTimeout(() => get().saveProgressToServer(), 0);
      },

      loadAnimals: async () => {
        try {
          const animals = await getAnimals();
          set({ animalsFromApi: animals.map(animalToMatchItem) });
        } catch (e) {
          console.error("Failed to load animals from API:", e);
        }
      },

      /** Fetch + preload all images, show loader while in progress */
      loadAnimalsForLevel: async () => {
        set({ isLoadingAnimals: true });
        try {
          const animals = await getAnimals();
          const matchItems = animals.map(animalToMatchItem);

          // Preload all images in parallel — wait until every one resolves
          await Promise.all(
            matchItems.map(
              (item) =>
                new Promise<void>((resolve) => {
                  const img = new Image();
                  img.onload = () => resolve();
                  img.onerror = () => resolve(); // don't block on broken images
                  img.src = item.imageUrl;
                }),
            ),
          );

          set({ animalsFromApi: matchItems });
        } catch (e) {
          console.error("Failed to load animals from API:", e);
        } finally {
          set({ isLoadingAnimals: false });
        }
      },

      initRound: () => {
        const { currentStageIndex, animalsFromApi } = get();
        const category = CATEGORIES[currentStageIndex] || "Colors";

        // For Animal Map (index 2): use API data if loaded, otherwise fall back to static
        let itemsInCategory: MatchItem[];
        if (currentStageIndex === 2 && animalsFromApi.length > 0) {
          itemsInCategory = animalsFromApi;
        } else {
          itemsInCategory = GAME_LEVELS.filter(
            (item) => item.category === category,
          );
        }

        const shuffled = [...itemsInCategory].sort(() => 0.5 - Math.random());
        const options = shuffled.slice(0, 4);
        const targetItem = options[Math.floor(Math.random() * options.length)];

        set({
          currentCategory: category,
          targetItem,
          options,
          isCelebrating: false,
          isFailing: false,
        });
      },

      setStage: (index: number) => {
        set({
          currentStageIndex: index,
          miniGamesPlayed: 0,
          miniGamesCorrect: 0,
        });
        // Pre-fetch animals when navigating to Animal Map
        if (index === 2) {
          get().loadAnimals();
        }
        // Persist stage selection
        setTimeout(() => get().saveProgressToServer(), 0);
      },

      selectLevel: (index: number) => {
        const { currentStageIndex } = get();
        set({
          view: "game",
          currentLevelIndex: index,
          currentLevelErrors: 0,
          miniGamesPlayed: 0,
          miniGamesCorrect: 0,
        });
        // Fetch & preload animals then init round for Animal Map
        if (currentStageIndex === 2) {
          get()
            .loadAnimalsForLevel()
            .then(() => get().initRound());
        } else {
          get().initRound();
        }
      },

      backToMap: () => {
        set({ view: "map", currentLevelIndex: null });
      },

      checkMatch: (selectedId: string) => {
        const {
          targetItem,
          currentLevelIndex,
          currentStageIndex,
          miniGamesPlayed,
          miniGamesCorrect,
          levelStatus,
        } = get();

        if (!targetItem) return false;

        const isCorrect = selectedId === targetItem.id;
        const newCorrect = miniGamesCorrect + (isCorrect ? 1 : 0);
        const newPlayed = miniGamesPlayed + 1;

        if (isCorrect) {
          set({ isCelebrating: true, miniGamesCorrect: newCorrect });
        } else {
          set({
            isFailing: true,
            currentLevelErrors: get().currentLevelErrors + 1,
          });
        }

        set({ miniGamesPlayed: newPlayed });

        setTimeout(() => {
          set({ isCelebrating: false, isFailing: false });

          if (newPlayed >= 3) {
            if (currentLevelIndex !== null) {
              const currentStageStatus = levelStatus[currentStageIndex] || {};
              const newLevelStatus = {
                ...levelStatus,
                [currentStageIndex]: {
                  ...currentStageStatus,
                  [currentLevelIndex]: { stars: newCorrect },
                },
              };
              set({ levelStatus: newLevelStatus });
              // Persist achievement to server after updating state
              setTimeout(() => get().saveProgressToServer(), 0);
            }
            get().backToMap();
          } else {
            get().initRound();
          }
        }, 1500);

        return isCorrect;
      },

      resetGame: () => {
        set({ currentLevelErrors: 0, miniGamesPlayed: 0, miniGamesCorrect: 0 });
        get().initRound();
      },

      resetProgress: () => {
        set({ levelStatus: {} });
        setTimeout(() => get().saveProgressToServer(), 0);
      },
    }),
    {
      name: "game-progress", // localStorage key
      // Only persist the fields we care about — not transient UI state
      partialize: (state) => ({
        levelStatus: state.levelStatus,
        currentStageIndex: state.currentStageIndex,
        languageMode: state.languageMode,
      }),
    },
  ),
);
