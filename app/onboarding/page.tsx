"use client";

import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function OnboardingPage() {
  const router = useRouter();

  const handleSelectRole = (role: string) => {
    const user = auth.currentUser;
    if (!user) return;

    localStorage.setItem(`onboarding_${user.uid}`, "true");
    localStorage.setItem(`role_${user.uid}`, role);

    router.replace("/account");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold mb-4">
          How will you use Neighbor Hire?
        </h1>

        <p className="text-white/60 mb-8">
          Select your role to personalize your experience.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => handleSelectRole("poster")}
            className="w-full rounded-xl bg-indigo-600 py-3 font-medium hover:bg-indigo-500 transition"
          >
            📢 Im a Job Poster
          </button>

          <button
            onClick={() => handleSelectRole("seeker")}
            className="w-full rounded-xl bg-white text-black py-3 font-medium hover:bg-white/90 transition"
          >
            👷 Im a Job Seeker
          </button>
        </div>
      </div>
    </main>
  );
}
