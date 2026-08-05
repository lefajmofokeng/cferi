"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex p-3 lg:p-4 font-sans antialiased box-border">
      <div className="w-full min-h-[calc(100vh-1.5rem)] lg:min-h-[calc(100vh-2rem)] grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-stretch">
        
        {/* LEFT COLUMN: HERO CARD WITH BORDER RADIUS & PADDING GAP FROM VIEWPORT */}
        <div className="relative bg-slate-950 text-white flex flex-col justify-between p-8 lg:p-12 min-h-[450px] lg:min-h-full rounded-2xl lg:rounded-[28px] overflow-hidden group shadow-2xl">
          
          {/* Real Background Image */}
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
            alt="Hero Graphic"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/50 pointer-events-none" />

          {/* Card Headline */}
          <div className="relative z-10 text-center pt-4">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight drop-shadow-md">
              Look first <span className="text-slate-300 font-normal">/</span> Then leap.
            </h2>
          </div>

          {/* Footer Label */}
          <div className="relative z-10 text-center pb-2">
            <p className="text-xs text-slate-300 font-semibold tracking-widest uppercase drop-shadow">
              ADMIN CONTROL PANEL
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: FORM SECTION */}
        <div className="flex flex-col justify-center items-center px-6 lg:px-16 py-8">
          <div className="w-full max-w-sm space-y-8">
            
            {/* Header Brand (Image Placeholder) */}
            <div className="text-center space-y-3">
              <div className="flex justify-center items-center">
                <img
                  src="https://via.placeholder.com/140x40?text=LOGO+PLACEHOLDER"
                  alt="Company Logo"
                  className="h-9 w-auto object-contain"
                />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Almost there
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Sign in to your administrative account
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@domain.com"
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-400 transition-colors shadow-sm placeholder:text-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-400 transition-colors shadow-sm placeholder:text-slate-300"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Enter your assigned administrator credentials
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-black text-white text-sm font-medium py-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Next"}
              </button>
            </form>

            <div className="pt-4 text-center">
              <p className="text-[11px] text-slate-400">
                Protected by system authentication rules and privacy guidelines.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}