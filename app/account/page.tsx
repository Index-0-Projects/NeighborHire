"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.replace("/signin");
        return;
      }
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const initials = useMemo(() => {
    const name = user?.displayName?.trim();
    if (!name) return "U";
    const parts = name.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "U";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return (first + last).toUpperCase();
  }, [user?.displayName]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut(auth);
      router.replace("/signin");
    } finally {
      setSigningOut(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-6 py-10">
        <div className="mx-auto w-full max-w-2xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white/10 animate-pulse" />
              <div className="flex-1">
                <div className="h-5 w-40 rounded bg-white/10 animate-pulse" />
                <div className="mt-2 h-4 w-64 rounded bg-white/10 animate-pulse" />
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              <div className="h-16 rounded-xl bg-white/10 animate-pulse" />
              <div className="h-16 rounded-xl bg-white/10 animate-pulse" />
              <div className="h-11 rounded-xl bg-white/10 animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Account</h1>
            <p className="text-sm text-white/60">
              Manage your profile and settings
            </p>
          </div>

          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            {user.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.photoURL}
                alt="Profile"
                className="h-14 w-14 rounded-2xl object-cover ring-1 ring-white/10"
              />
            ) : (
              <div className="h-14 w-14 rounded-2xl bg-white/10 grid place-items-center text-white font-semibold ring-1 ring-white/10">
                {initials}
              </div>
            )}

            <div className="min-w-0">
              <div className="text-lg font-semibold text-white truncate">
                {user.displayName || "Unnamed user"}
              </div>
              <div className="text-sm text-white/70 truncate">{user.email}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => router.push("/")}
              className="w-full sm:w-auto rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-white/90"
            >
              Go to home
            </button>

            <button
              onClick={() => console.log("Continue onboarding")}
              className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/15"
            >
              Continue onboarding
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
