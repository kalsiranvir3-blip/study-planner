"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingTask, setAddingTask] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const loadTasks = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User error:", userError);
      setErrorMessage("Unable to verify your account. Please sign in again.");
      return;
    }

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("due_date", { ascending: true });

    if (error) {
      console.error("Task loading error:", error);
      setErrorMessage("Unable to load your tasks. Please try again.");
      return;
    }

    setErrorMessage("");
    setTasks(data || []);
  };

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/signin");
        return;
      }

      await loadTasks();
    };

    checkUser();
  }, [router]);

  const handleAddTask = async () => {
  if (!title.trim()) {
    setMessage("Please enter a task title.");
    return;
  }

  setAddingTask(true);
  setMessage("");

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    setMessage("You must be signed in to add a task.");
    setAddingTask(false);
    return;
  }

  const { error } = await supabase.from("tasks").insert({
    user_id: user.id,
    title: title.trim(),
    note: note.trim(),
    due_date: dueDate || null,
    completed: false,
  });

    if (error) {
      setMessage(error.message);
    }   else {
      setMessage("Task added successfully!");

      setTitle("");
      setNote("");
      setDueDate("");

      await loadTasks();
    }

    setAddingTask(false);
  };

  const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error);
    setMessage("Unable to log out. Please try again.");
    return;
  }

  router.push("/");
};

  const today = new Date().toISOString().split("T")[0];

  const dueToday = tasks.filter(
    (task) => task.due_date === today && !task.completed
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>

            <p className="mt-2 text-slate-400">
              Welcome to your Study Planner
            </p>
          </div>
           {errorMessage && (
          <div className="mt-6 rounded-lg border border-red-900 bg-red-950/40 p-4 text-red-300">
            {errorMessage}
          </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/tasks")}
              className="mr-3 rounded-lg bg-blue-600 px-5 py-2.5 font-medium transition hover:bg-blue-700"
            >
              Tasks
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-5 py-2.5 font-medium hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-4 gap-6">
          <div className="rounded-xl bg-slate-900 p-6 shadow-lg transition duration-200 hover:-translate-y-1 hover:bg-slate-800">
            <h2 className="text-slate-400">Total Tasks</h2>
            <p className="mt-2 text-3xl font-bold">
              {tasks.length}
            </p>
          </div>

          <div className="rounded-xl bg-slate-900 p-6 shadow-lg transition duration-200 hover:-translate-y-1 hover:bg-slate-800">
            <h2 className="text-slate-400">Completed</h2>
            <p className="mt-2 text-3xl font-bold">
              {tasks.filter((task) => task.completed).length}
            </p>
          </div>

          <div className="rounded-xl bg-slate-900 p-6 shadow-lg transition duration-200 hover:-translate-y-1 hover:bg-slate-800">
            <h2 className="text-slate-400">Pending</h2>
            <p className="mt-2 text-3xl font-bold">
              {tasks.filter((task) => !task.completed).length}
            </p>
          </div>

          <div className="rounded-xl bg-slate-900 p-6 shadow-lg transition duration-200 hover:-translate-y-1 hover:bg-slate-800">
            <h2 className="text-slate-400">Due Today</h2>
            <p className="mt-2 text-3xl font-bold">
              {dueToday}
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-white">
              Add Study Task
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Create a new task for your study plan.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-[1fr_280px]">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Task Title
              </label>

              <input
                type="text"
                placeholder="e.g. Study OOP"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Due Date
              </label>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 mt-3 block text-sm font-medium text-slate-300">
              Task Note
            </label>

            <textarea
              placeholder="Add details about this task..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleAddTask}
              disabled={addingTask}
              className="mt-3 rounded-lg bg-blue-600 px-10 py-3 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {addingTask ? "Adding..." : "Add Task"}
            </button>
          </div>

          {message && (
            <p className="mt-4 text-center text-sm text-slate-300">
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}