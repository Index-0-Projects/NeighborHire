"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  User,
  updateProfile,
  updateEmail,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

type RoleOption = "poster" | "seeker";

const ROLE_OPTIONS: { value: RoleOption; label: string; helper: string }[] = [
  {
    value: "poster",
    label: "Job Poster",
    helper: "Share opportunities and manage applicants.",
  },
  {
    value: "seeker",
    label: "Job Seeker",
    helper: "Browse gigs and reach out to posters.",
  },
];

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [role, setRole] = useState<RoleOption | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [phone, setPhone] = useState<string | null>(null);
  const [roleInput, setRoleInput] = useState<RoleOption>("seeker");
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    if (!user) return;
    const savedRole = localStorage.getItem(`role_${user.uid}`);
    if (savedRole === "poster" || savedRole === "seeker") {
      setRole(savedRole);
      setRoleInput(savedRole);
    } else {
      setRole(null);
      setRoleInput("seeker");
    }

    const savedPhone = localStorage.getItem(`phone_${user.uid}`);
    setPhone(savedPhone);
    setPhoneInput(savedPhone ?? "");

    // initialize form inputs when user loads
    setNameInput(user.displayName ?? "");
    setEmailInput(user.email ?? "");
  }, [user]);

  const initials = useMemo(() => {
    const name = user?.displayName?.trim();
    if (!name) return "U";
    const parts = name.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "U";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return (first + last).toUpperCase();
  }, [user?.displayName]);

  const formattedMemberSince = useMemo(() => {
    const createdAt = user?.metadata?.creationTime;
    if (!createdAt) return null;
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
  }, [user?.metadata?.creationTime]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut(auth);
      router.replace("/signin");
    } finally {
      setSigningOut(false);
    }
  };

  const handleUpdateProfile = async (user: User) => {
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" /* + auth token */ },
      body: JSON.stringify({
        uid: user.uid,
        displayName: nameInput,
        email: emailInput,
        phone: phoneInput,
        role: roleInput,
      }),
    });

    const data = await res.json();

    console.log("Profile update response:", data);

    if (!res.ok) {
      console.error("Failed to update profile", await res.text());
    } else {
      console.log("Profile updated successfully");
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

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setSaving(true);
    try {
      if (!user) return;
      if (nameInput !== user.displayName) {
        await updateProfile(user, { displayName: nameInput });
      }
      if (emailInput !== user.email && user.email) {
        await updateEmail(user, emailInput);
      }
      const phoneKey = `phone_${user.uid}`;
      if (phoneInput.trim().length > 0) {
        const normalizedPhone = phoneInput.trim();
        localStorage.setItem(phoneKey, normalizedPhone);
        setPhone(normalizedPhone);
      } else {
        localStorage.removeItem(phoneKey);
        setPhone(null);
      }
      const roleKey = `role_${user.uid}`;
      localStorage.setItem(roleKey, roleInput);
      setRole(roleInput);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setSaving(false);
      setShowModal(false);
    }
  };

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

        {/* Profile overview */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-2xl">
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-emerald-500/15 blur-3xl lg:block" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
            {user.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.photoURL}
                alt="Profile"
                className="h-20 w-20 rounded-3xl object-cover ring-2 ring-white/40"
              />
            ) : (
              <div className="grid h-20 w-20 place-items-center rounded-3xl border border-white/10 bg-white/10 text-2xl font-semibold text-white">
                {initials}
              </div>
            )}

            <div className="relative flex-1 min-w-0">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                Profile
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-white">
                {user.displayName || "Unnamed user"}
              </h2>
              <p className="mt-1 text-sm text-white/70">
                Keep your details current to build trust with neighbors you
                collaborate with on jobs.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-white">
                  {role === "poster" ? "Job Poster" : "Job Seeker"}
                </span>
                {formattedMemberSince && (
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                    Member since {formattedMemberSince}
                  </span>
                )}
                {user.email && (
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                    {user.email}
                  </span>
                )}
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 lg:w-auto">
              <button
                onClick={() => setShowModal(true)}
                className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-white/90"
              >
                Update info
              </button>
              <button
                onClick={() =>
                  role === "poster"
                    ? router.push("/createPost")
                    : router.push("/jobsearch")
                }
                className="rounded-2xl border border-emerald-300/50 bg-emerald-400/20 px-4 py-2.5 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-400/40"
              >
                {role === "poster" ? "Post a new job" : "Browse gigs"}
              </button>
            </div>
          </div>

          <div className="relative mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                label: "Current role",
                value: role === "poster" ? "Job Poster" : "Job Seeker",
              },
              {
                label: "Primary email",
                value: user.email ?? "No email on file",
              },
              {
                label: "Phone",
                value: phone ?? "Add a phone number",
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-xs uppercase tracking-wide text-white/50">
                  {label}
                </p>
                <p className="mt-1 text-sm font-medium text-white">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <p className="mt-1 text-sm text-white/70">
              These details help people follow up after you connect.
            </p>
            <dl className="mt-6 space-y-4">
              <div className="flex flex-col gap-1">
                <dt className="text-xs uppercase tracking-wide text-white/50">
                  Email
                </dt>
                <dd className="text-sm text-white">
                  {user.email ?? "Not available"}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs uppercase tracking-wide text-white/50">
                  Phone
                </dt>
                <dd className="text-sm text-white">
                  {phone ?? "No phone added"}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs uppercase tracking-wide text-white/50">
                  Role preference
                </dt>
                <dd className="text-sm text-white">
                  {role === "poster" ? "Posting jobs" : "Seeking work"}
                </dd>
              </div>
            </dl>
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 inline-flex items-center justify-center rounded-2xl border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Edit contact info
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white">Quick actions</h3>
            <p className="mt-1 text-sm text-white/70">
              Jump back into the marketplace or head home.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => router.push("/")}
                className="rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white/90"
              >
                Go to home
              </button>
              <button
                onClick={() =>
                  router.push(role === "poster" ? "/createPost" : "/jobsearch")
                }
                className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-400/30"
              >
                {role === "poster" ? "Create listing" : "Browse jobs"}
              </button>
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              Tip: Switch your role anytime in the modal to experience the other
              side of Neighbor Hire.
            </div>
          </div>
        </section>

        {/* Update info modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => !saving && setShowModal(false)}
            />
            <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    Update your details
                  </h2>
                  <p className="mt-1 text-sm text-white/70">
                    Keep contact info current so posters and seekers know how to
                    reach you.
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => !saving && setShowModal(false)}
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/15"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4l12 12m0-12L4 16" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-white">
                      Full name
                    </span>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                      placeholder="Jane Doe"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-white">
                      Email address
                    </span>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                      placeholder="jane@email.com"
                    />
                  </label>
                </div>

                <label className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-white">
                    <span className="font-medium">Phone number</span>
                    <span className="text-white/60">Optional</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                  <p className="text-xs text-white/60">
                    Shared with people you connect with on Neighbor Hire.
                  </p>
                </label>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-white">
                    <span className="font-medium">Role</span>
                    <span className="text-white/60">
                      Switch anytime to explore both sides.
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {ROLE_OPTIONS.map(({ value, label, helper }) => {
                      const isActive = roleInput === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRoleInput(value)}
                          className={`rounded-2xl border px-4 py-3 text-left transition ${
                            isActive
                              ? "border-emerald-400 bg-emerald-400/10 text-white"
                              : "border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
                          }`}
                        >
                          <p className="text-sm font-semibold">{label}</p>
                          <p className="text-xs text-white/70">{helper}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => !saving && setShowModal(false)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    onClick={() => handleUpdateProfile(user)}
                    className="rounded-2xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
