"use client";

import { useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const COOKIE_NAME = "promptly_ref";

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 86_400_000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

/**
 * Runs on every page load. Captures a `?ref=CODE` param into a cookie (so it
 * survives the sign-in/sign-up redirect) and, once the visitor has a
 * session, redeems it exactly once via the redeem_referral RPC — which is
 * itself idempotent/guarded, so calling this repeatedly is harmless.
 */
export function ReferralCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refFromUrl = params.get("ref");
    if (refFromUrl) {
      setCookie(COOKIE_NAME, refFromUrl, 30);
      params.delete("ref");
      const newSearch = params.toString();
      const newUrl =
        window.location.pathname +
        (newSearch ? `?${newSearch}` : "") +
        window.location.hash;
      window.history.replaceState({}, "", newUrl);
    }

    async function redeem() {
      const code = getCookie(COOKIE_NAME);
      if (!code) return;

      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.rpc("redeem_referral", { p_referral_code: code });
      deleteCookie(COOKIE_NAME);
    }

    void redeem();
  }, []);

  return null;
}
