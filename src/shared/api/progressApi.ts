import { axiosClient } from "./axiosClient";

export interface ProgressData {
  levelStatus: Record<number, Record<number, { stars: number }>>;
  currentStageIndex: number;
  languageMode: "en" | "by";
}

/** Fetch saved progress for the authenticated user. Returns null if none saved yet. */
export const getProgress = async (): Promise<ProgressData | null> => {
  try {
    const { data } = await axiosClient.get<ProgressData>("/progress");
    return data;
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } }).response?.status;
    // 404 = first time playing, no progress yet — that's fine
    if (status === 404 || status === 401) return null;
    console.error("Failed to fetch progress:", err);
    return null;
  }
};

/** Persist progress to the server for the authenticated user. Fire-and-forget. */
export const putProgress = async (data: ProgressData): Promise<void> => {
  try {
    await axiosClient.put("/progress", data);
  } catch (err) {
    // Non-blocking — localStorage is the safety net
    console.warn("Failed to save progress to server:", err);
  }
};
