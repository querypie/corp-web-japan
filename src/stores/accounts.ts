import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Platform = "instagram" | "facebook" | "x" | "youtube" | "note";

export interface SNSAccount {
  id: string;
  platform: Platform;
  username: string;
  displayName: string;
  profileImage?: string;
  connectedAt: string;
  isActive: boolean;
  source: "demo" | "oauth";
  platformUserId?: string;
  tokenExpiresAt?: string;
}

interface AccountsState {
  accounts: SNSAccount[];
  addAccount: (
    account: Omit<SNSAccount, "id" | "connectedAt" | "source"> & {
      source?: "demo" | "oauth";
    }
  ) => void;
  removeAccount: (id: string) => void;
  toggleAccount: (id: string) => void;
  syncFromSupabase: (oauthAccounts: SNSAccount[]) => void;
}

export const useAccountsStore = create<AccountsState>()(
  persist(
    (set) => ({
      accounts: [],
      addAccount: (account) =>
        set((state) => ({
          accounts: [
            ...state.accounts,
            {
              ...account,
              id: `acc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              connectedAt: new Date().toISOString(),
              source: account.source || "demo",
            },
          ],
        })),
      removeAccount: (id) =>
        set((state) => ({
          accounts: state.accounts.filter((a) => a.id !== id),
        })),
      toggleAccount: (id) =>
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === id ? { ...a, isActive: !a.isActive } : a
          ),
        })),
      syncFromSupabase: (oauthAccounts) =>
        set((state) => {
          const demoAccounts = state.accounts.filter(
            (a) => a.source === "demo"
          );
          return { accounts: [...oauthAccounts, ...demoAccounts] };
        }),
    }),
    {
      name: "JP_WEB-accounts",
      partialize: (state) => ({
        accounts: state.accounts.filter((a) => a.source === "demo"),
      }),
    }
  )
);
