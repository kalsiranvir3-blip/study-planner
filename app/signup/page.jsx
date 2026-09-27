"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation"
import { supabase } from "../../lib/supabase"; 
import { FiArrowLeft } from "react-icons/fi";

export default function SignUp() {

  const router= useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef(null);

  const handleSignUp = async (event) => {
    event.preventDefault();

    setMessage("");

    if(!email.trim() || !password){
      setMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);

  const { error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
  });

  if (error) {
    setMessage(error.message);
    setLoading(false);
    return;
  }

  setMessage("Account created successfully.");

  setTimeout(()=> {
    router.push
  })

};
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <Link
        href="/dashboard"
        className="absolute left-6 top-6 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
      >
        <FiArrowLeft size={18} />
        Back
      </Link>
      <div className="w-full max-w-md p-8 bg-slate-900 rounded-2xl">
        
        <h1 className="text-3xl font-bold text-center">
          Create Account
        </h1>

        <p className="mt-2 text-center text-slate-400">
          Start organizing your studies
        </p>

        <div className="mt-8">
          <label className="block mb-2 text-slate-300">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"/>
        </div>

        <div className="mt-5">
          <label className="block mb-2 text-slate-300">
            Password
          </label>

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
          />
        </div>

        <button onClick={handleSignUp} 
          className="w-full mt-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">
          Create Account
        </button>
        {message && (
     <p className="mt-4 text-center text-slate-300">
    {message}
  </p>
)}

      </div>
    </main>
  );
}