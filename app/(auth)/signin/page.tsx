"use client";

import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function SignInPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already signed in, go to account
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/account");
      setChecking(false);
    });
    return () => unsub();
  }, [router]);

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const onboardingComplete = localStorage.getItem(`onboarding_${user.uid}`);

      if (!onboardingComplete) {
        router.replace("/onboarding");
      } else {
        router.replace("/account");
      }
    } catch (e: unknown) {
      const error = e as { code?: string; message?: string };
      const msg =
        error?.code === "auth/popup-closed-by-user"
          ? "Popup closed. Try again."
          : error?.message || "Login failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <main className="min-h-screen grid place-items-center bg-gradient-to-b from-slate-950 via-slate-950 to-black px-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl">
          <div className="h-6 w-40 rounded bg-white/10 animate-pulse" />
          <div className="mt-3 h-4 w-64 rounded bg-white/10 animate-pulse" />
          <div className="mt-6 h-12 w-full rounded-xl bg-white/10 animate-pulse" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen grid place-items-center bg-gradient-to-b from-slate-950 via-slate-950 to-black px-6">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 blur-3xl opacity-40" />

      <div className="relative z-10 w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center font-bold text-lg">
            NH
          </div>
        </div>

        {/* Floating Cards */}
        <div className="flex justify-center gap-4 mb-10">
          <div className="w-20 h-28 bg-white/10 rounded-xl rotate-[-10deg] backdrop-blur-md border border-white/10 shadow-xl" />
          <div className="w-20 h-28 bg-white/20 rounded-xl backdrop-blur-md border border-white/10 shadow-xl" />
          <div className="w-20 h-28 bg-white/10 rounded-xl rotate-[10deg] backdrop-blur-md border border-white/10 shadow-xl" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold">Welcome to Neighbor Hire</h1>

        {/* Subtitle */}
        <p className="mt-3 text-white/60">
          Connect with local job posters and job seekers. Sign in with Google to
          get started.
        </p>

        {error && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="mt-6 w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white text-slate-900 px-4 py-3 font-medium shadow-sm transition hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <GoogleIcon />
          <span>{loading ? "Signing in..." : "Continue with Google"}</span>
        </button>

        <p className="mt-4 text-xs text-white/50">
          By continuing, you agree to our{" "}
          <span className="text-white/70 underline underline-offset-4">
            Terms
          </span>{" "}
          and{" "}
          <span className="text-white/70 underline underline-offset-4">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.5 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8.1 3.1l5.7-5.7C34.1 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.1-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8.1 3.1l5.7-5.7C34.1 6 29.3 4 24 4 16.1 4 9.3 8.5 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.1 0 9.8-2 13.3-5.2l-6.1-5.2c-2 1.5-4.6 2.4-7.2 2.4-5.2 0-9.7-3.5-11.3-8.3l-6.6 5.1C9.1 39.2 16 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1 2.8-3 5.1-5.7 6.6l.1.1 6.1 5.2C36.5 39.2 44 34 44 24c0-1.1-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}
