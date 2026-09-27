import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
      
      <h1 className="text-5xl font-bold">
        Study Planner
      </h1>

      <p className="mt-4 text-xl text-slate-300">
        Plan smarter. Study better.
      </p>

      <p className="mt-2 text-slate-400">
        Organize your study tasks and stay on top of your learning.
      </p>

      <div className="mt-8 flex flex-row items-center gap-4">
  <Link
    href="/signin"
    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg"
  >
    Sign In
  </Link>

  <Link
    href="/signup"
    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg"
  >
    Sign Up
  </Link>
</div>
    </main>
  );
}