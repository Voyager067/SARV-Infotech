import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../lib/format";
import { selectCartTotal, useCartStore } from "../store/cartStore";

const CartDrawer = () => {
  const navigate = useNavigate();
  const isOpen = useCartStore((state) => state.isDrawerOpen);
  const closeDrawer = useCartStore((state) => state.closeDrawer);
  const items = useCartStore((state) => state.items);
  const total = useCartStore(selectCartTotal);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const removeItem = useCartStore((state) => state.removeItem);

  const handleCheckout = () => {
    closeDrawer();
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            className="glass fixed right-0 top-0 z-[95] flex h-full w-full max-w-md flex-col border-l border-white/10 p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Your Cart</h2>
              <button onClick={closeDrawer} className="rounded-full p-2 hover:bg-white/10" aria-label="Close cart">
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-white/50">
                <ShoppingBag className="h-10 w-10" />
                <p>Your cart is feeling empty.</p>
              </div>
            ) : (
              <div className="mt-6 flex-1 space-y-4 overflow-y-auto pr-1">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                    >
                      <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-white/50">{formatPrice(item.price)}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => decrementItem(item.productId)}
                            className="rounded-full bg-white/10 p-1 hover:bg-white/20"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-5 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => incrementItem(item.productId)}
                            className="rounded-full bg-white/10 p-1 hover:bg-white/20"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="rounded-full p-2 text-white/40 hover:bg-white/10 hover:text-red-300"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            <div className="mt-6 border-t border-white/10 pt-4">
              <div className="mb-4 flex items-center justify-between text-sm text-white/70">
                <span>Subtotal</span>
                <span className="font-display text-lg font-semibold text-white">{formatPrice(total)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={items.length === 0}
                className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 py-3 text-center font-semibold text-black transition hover:brightness-110 disabled:opacity-40"
              >
                Checkout
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
