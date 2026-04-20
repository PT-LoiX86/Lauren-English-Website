import { create } from "zustand";
import { persist } from "zustand/middleware";

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

  // Actions
  login: (accessToken: string, refreshToken: string, user: UserProfile) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

// Create the Zustand Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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

      logout: () =>
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        }),
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
