"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import {
  useAccountsStore,
  type SNSAccount,
  type Platform,
} from "@/stores/accounts";
import { useEffect } from "react";

export function useAccounts() {
  const store = useAccountsStore();
  const supabase = createClient();

  const { data: oauthAccounts, isLoading } = useQuery({
    queryKey: ["sns-accounts"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("sns_accounts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch accounts:", error);
        return [];
      }

      return (data || []).map(
        (row): SNSAccount => ({
          id: row.id,
          platform: row.platform as Platform,
          username: row.username,
          displayName: row.display_name || row.username,
          profileImage: row.avatar_url || undefined,
          connectedAt: row.created_at,
          isActive: row.is_active,
          source: "oauth",
          platformUserId: row.platform_user_id,
          tokenExpiresAt: row.token_expires_at || undefined,
        })
      );
    },
    staleTime: 30_000,
    retry: false,
  });

  useEffect(() => {
    if (oauthAccounts) {
      store.syncFromSupabase(oauthAccounts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oauthAccounts]);

  const allAccounts = [
    ...(oauthAccounts || []),
    ...store.accounts.filter((a) => a.source === "demo"),
  ];

  return {
    accounts: allAccounts,
    isLoading,
    addDemoAccount: store.addAccount,
    removeLocalAccount: store.removeAccount,
    toggleAccount: store.toggleAccount,
  };
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const removeLocalAccount = useAccountsStore((s) => s.removeAccount);

  return useMutation({
    mutationFn: async ({
      accountId,
      source,
    }: {
      accountId: string;
      source: "demo" | "oauth";
    }) => {
      if (source === "oauth") {
        const { error } = await supabase
          .from("sns_accounts")
          .delete()
          .eq("id", accountId);
        if (error) throw error;
      } else {
        removeLocalAccount(accountId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sns-accounts"] });
    },
  });
}
