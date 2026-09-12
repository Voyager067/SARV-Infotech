import { motion } from "framer-motion";
import { KeyRound, LogIn } from "lucide-react";
import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuthStore } from "../store/authStore";

interface LocationState {
  from?: { pathname: string };
}

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await api.post("/auth/login", { username, password });
      setSession(res.data.token, res.data.username);
      const redirectTo = (location.state as LocationState | null)?.from?.pathname || "/products";
      navigate(redirectTo, { replace: true });
    } catch {
      setError("Invalid credentials. Try admin / admin123.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass glow-border rounded-3xl p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-full bg-white/10 p-2.5">
            <KeyRound className="h-5 w-5 text-cyan-300" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold">Welcome back</h1>
            <p className="text-sm text-white/50">Log in to check out</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 outline-none transition focus:border-cyan-300/50"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 outline-none transition focus:border-cyan-300/50"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-red-300"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 py-3 font-semibold text-black transition hover:brightness-110 disabled:opacity-50"
          >
            <LogIn className="h-4 w-4" />
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/30">Demo credentials: admin / admin123</p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
