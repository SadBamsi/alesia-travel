import { create } from "zustand";
import { axiosClient } from "../api/axiosClient";
import { getProgress } from "../api/progressApi";
import { useGameStore } from "./useGameStore";

export interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  checkAuth: () => Promise<void>;
  login: (credentials: Record<string, string>) => Promise<void>;
  register: (credentials: Record<string, string>) => Promise<void>;
  logout: () => Promise<void>;
}

/** After authenticating, fetch server progress and hydrate the game store.
 *  Server data wins over any locally-cached progress. */
async function syncProgressFromServer(): Promise<void> {
  const data = await getProgress();
  if (data) {
    useGameStore.getState().loadProgress(data);
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // starts loading to check initial session
  error: null,

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      // Typically backends have `/auth/me` or `/auth/session`
      const response = await axiosClient.get("/auth/me");
      await syncProgressFromServer();
      setTimeout(
        () =>
          set({
            user: response.data.user || response.data,
            isAuthenticated: true,
            isLoading: false,
          }),
        1000,
      );
    } catch {
      // If 401 Unauthorized, just mean user isn't logged in
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosClient.post("/auth/login", credentials);
      // Load server-side progress before dismissing the loader
      await syncProgressFromServer();
      set({
        user: response.data.user || response.data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || "Login failed";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  register: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosClient.post("/auth/register", credentials);
      // New user — getProgress will return null (404), which is fine
      await syncProgressFromServer();
      set({
        user: response.data.user || response.data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || "Registration failed";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });

    const clearLocalData = () => {
      set({ user: null, isAuthenticated: false, isLoading: false });
      useGameStore.setState({
        levelStatus: {},
        currentStageIndex: 0,
        view: "map",
        currentLevelIndex: null,
      });
      localStorage.removeItem("game-progress");
    };

    try {
      await axiosClient.post("/auth/logout");
      clearLocalData();
    } catch (error) {
      console.error("Logout failed", error);
      clearLocalData();
    }
  },
}));
