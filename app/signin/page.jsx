"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { FiArrowLeft } from "react-icons/fi";

export default function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef(null);

  useEffect(() => {
    const checkExistingSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace("/dashboard");
      }
    };

    checkExistingSession();
  }, [router]);

  const handleSignIn = async (event) => {
    event.preventDefault();

    setMessage("");

    if (!email.trim() || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <Link
        href="/dashboard"
        className="absolute left-6 top-6 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
      >
        <FiArrowLeft size={18} />
        Back
      </Link>

      <div className="mx-auto flex min-h-[90vh] max-w-md items-center justify-center">
        <div className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Study Planner
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Welcome back
            </h1>

            <p className="mt-2 text-slate-400">
              Sign in to continue planning your studies.
            </p>
          </div>

          {/* IMPORTANT: The inputs are inside this form */}
          <form onSubmit={handleSignIn} className="space-y-5">

            {/* Email */}

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    passwordRef.current?.focus();
                  }
                }}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />
            </div>

            {/* Password */}

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Password
              </label>

              <input
                ref={passwordRef}
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

          </form>

          {message && (
            <p className="mt-5 rounded-lg bg-slate-800 p-3 text-center text-sm text-slate-300">
              {message}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Create Account
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}