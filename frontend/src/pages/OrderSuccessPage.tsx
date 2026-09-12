import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { api } from "../lib/api";
import { formatPrice } from "../lib/format";
import { Order } from "../types";

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const duration = 1500;
    const end = Date.now() + duration;

    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 70, origin: { x: 0 }, colors: ["#a78bfa", "#22d3ee", "#f472b6"] });
      confetti({ particleCount: 4, angle: 120, spread: 70, origin: { x: 1 }, colors: ["#a78bfa", "#22d3ee", "#f472b6"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  useEffect(() => {
    if (!id) return;

    api
      .get<Order>(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <Loader />;

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400"
      >
        <CheckCircle2 className="h-10 w-10 text-black" />
      </motion.div>

      <h1 className="mt-8 font-display text-3xl font-semibold">Order placed!</h1>
      <p className="mt-2 text-white/60">
        Thanks{order ? `, ${order.shipping.fullName}` : ""} — your gear is on its way.
      </p>

      {order && (
        <div className="glass mt-8 rounded-2xl p-6 text-left">
          <div className="flex items-center justify-between text-sm text-white/50">
            <span>Order ID</span>
            <span className="font-mono text-white/80">{order._id.slice(-8)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-white/50">
            <span>Total paid</span>
            <span className="font-display text-lg font-semibold text-white">{formatPrice(order.total)}</span>
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          to="/orders"
          className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-3 font-semibold text-black transition hover:brightness-110"
        >
          View my orders
        </Link>
        <Link
          to="/products"
          className="rounded-full border border-white/15 px-6 py-3 font-medium text-white/80 transition hover:border-white/30 hover:text-white"
        >
          Keep shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
