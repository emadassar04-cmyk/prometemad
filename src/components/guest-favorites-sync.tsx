"use client";

import { useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getGuestFavorites, clearGuestFavorites } from "@/lib/guest-favorites";

/**
 * Runs once per page load. If the visitor favorited prompts as a guest
 * (stored in localStorage) and is now signed in, merges those into their
 * account's favorites and clears the local copy.
 */
export function GuestFavoritesSync() {
  useEffect(() => {
    async function sync() {
      const guestFavorites = getGuestFavorites();
      if (guestFavorites.length === 0) return;

      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("favorites").upsert(
        guestFavorites.map((promptId) => ({
          user_id: user.id,
          prompt_id: promptId,
        })),
        { onConflict: "user_id,prompt_id", ignoreDuplicates: true },
      );

      clearGuestFavorites();
    }

    void sync();
  }, []);

  return null;
}
