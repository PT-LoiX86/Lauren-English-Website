import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "../api/Client";

// Define the TypeScript interfaces based on the Java API contract
export interface UserProfile {
  userId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;

  login: (accessToken: string, refreshToken: string, user: UserProfile) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => Promise<void>;
}

// Create the Zustand Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      login: (accessToken, refreshToken, user) =>
        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: true,
        }),

      updateTokens: (accessToken, refreshToken) =>
        set(() => ({
          accessToken,
          refreshToken,
        })),

      logout: async () => {
        const { refreshToken } = get();

        if (refreshToken) {
          try {
            await apiClient.post("/auth/logout", {
              refreshToken: refreshToken,
            });
          } catch (error) {
            console.error("Server-side logout failed:", error);
          }
        }

        set(() => ({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }));
      },
    }),
    {
      name: "lauren-english-auth", // The key used in localStorage
      // We only want to persist the token and user data, not functions
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
