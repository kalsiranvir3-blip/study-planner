"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { supabase } from "../../lib/supabase";

export default function Tasks() {
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  const [message, setMessage] = useState("");

  const loadTasks = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/signin");
      return;
    }

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("due_date", { ascending: true });

    if (error) {
      console.error("Task loading error:", error);
      setMessage("Unable to load your tasks. Please try again.");
      setLoading(false);
      return;
    }

    setTasks(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleComplete = async (task) => {
    const { error } = await supabase
      .from("tasks")
      .update({
        completed: !task.completed,
      })
      .eq("id", task.id);

    if (error) {
      console.error("Complete task error:", error);
      setMessage("Unable to update the task. Please try again.");
      return;
    }

    setMessage(
      task.completed
        ? "Task marked as pending."
        : "Task completed successfully!"
    );

    setTimeout(() => {
      setMessage("");
    }, 3000);

    await loadTasks();
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditNote(task.note || "");
    setEditDueDate(task.due_date || "");
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      setMessage("Please enter a task title.");
      return;
    }

    const { error } = await supabase
      .from("tasks")
      .update({
        title: editTitle.trim(),
        note: editNote.trim(),
        due_date: editDueDate || null,
      })
      .eq("id", editingTask.id);

    if (error) {
      console.error("Edit task error:", error);
      setMessage("Unable to update the task. Please try again.");
      return;
    }

    setMessage("Task updated successfully!");
    setEditingTask(null);

    setTimeout(() => {
      setMessage("");
    }, 3000);

    await loadTasks();
  };

  const handleDelete = async (taskId) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId);

    if (error) {
      console.error("Delete task error:", error);
      setMessage("Unable to delete the task. Please try again.");
      return;
    }

    setMessage("Task deleted successfully!");

    setTimeout(() => {
      setMessage("");
    }, 3000);

    await loadTasks();
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading tasks...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <Link
        href="/dashboard"
        className="absolute left-6 top-6 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
      >
        <FiArrowLeft size={18} />
        Back
      </Link>

      <div className="mx-auto max-w-6xl pt-16">
        <div>
          <h1 className="text-4xl font-bold">Your Tasks</h1>

          <p className="mt-2 text-slate-400">
            View and manage your study tasks.
          </p>
        </div>

        {message && (
          <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900 p-4 text-slate-300">
            {message}
          </div>
        )}

        <section className="mt-8 space-y-4">
          {tasks.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
              No tasks found.
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition duration-200 hover:-translate-y-1 hover:bg-slate-800"
              >
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-xl font-semibold">{task.title}</h2>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      task.completed
                        ? "bg-emerald-950 text-emerald-400"
                        : "bg-amber-950 text-amber-400"
                    }`}
                  >
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                </div>

                {task.note && (
                  <p className="mt-2 text-slate-400">{task.note}</p>
                )}

                {task.due_date && (
                  <p className="mt-3 text-sm text-slate-500">
                    Due: {task.due_date}
                  </p>
                )}

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleComplete(task)}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium transition hover:bg-emerald-700"
                  >
                    {task.completed ? "Mark Pending" : "Complete"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEdit(task)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium transition hover:bg-blue-700"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(task.id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium transition hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

        {editingTask && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 p-6">
            <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
              <h2 className="text-2xl font-bold">Edit Task</h2>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Task Title
                </label>

                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Task Note
                </label>

                <textarea
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Due Date
                </label>

                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="rounded-lg bg-slate-700 px-5 py-2.5 font-medium transition hover:bg-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium transition hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}