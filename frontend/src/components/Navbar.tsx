import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SITE_NAME } from "../constants";
import { useAuthStore } from "../store/authStore";
import { selectCartCount, useCartStore } from "../store/cartStore";

const Navbar = () => {
  const navigate = useNavigate();
  const cartCount = useCartStore(selectCartCount);
  const openDrawer = useCartStore((state) => state.openDrawer);
  const { username, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold">
          <Sparkles className="h-5 w-5 text-cyan-300" />
          <span className="text-gradient">{SITE_NAME}</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-white/70 md:flex">
          <Link to="/" className="transition hover:text-white">
            Home
          </Link>
          <Link to="/products" className="transition hover:text-white">
            Shop
          </Link>
          {username && (
            <Link to="/orders" className="transition hover:text-white">
              Orders
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {username ? (
            <button
              onClick={handleLogout}
              className="hidden rounded-full border border-white/10 px-4 py-1.5 text-sm text-white/70 transition hover:border-white/30 hover:text-white sm:block"
            >
              Log out
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-full border border-white/10 px-4 py-1.5 text-sm text-white/70 transition hover:border-white/30 hover:text-white sm:block"
            >
              Log in
            </Link>
          )}

          <button
            onClick={openDrawer}
            className="relative rounded-full bg-white/10 p-2.5 transition hover:bg-white/20"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-[11px] font-semibold text-black"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
