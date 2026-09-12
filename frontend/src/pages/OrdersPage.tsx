import { motion } from "framer-motion";
import { PackageOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { api } from "../lib/api";
import { formatPrice } from "../lib/format";
import { Order } from "../types";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get<Order[]>("/orders")
      .then((res) => setOrders(res.data))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-12">
      <h1 className="mb-8 font-display text-3xl font-semibold">
        Your <span className="text-gradient">orders</span>
      </h1>

      {orders.length === 0 ? (
        <div className="glass flex flex-col items-center gap-3 rounded-2xl p-12 text-center text-white/50">
          <PackageOpen className="h-10 w-10" />
          <p>No orders yet.</p>
          <Link to="/products" className="text-cyan-300 hover:underline">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-sm text-white/50">#{order._id.slice(-8)}</p>
                  <p className="text-xs text-white/30">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  {order.status}
                </span>
              </div>

              <div className="mt-4 flex -space-x-3">
                {order.items.slice(0, 5).map((item) => (
                  <img
                    key={item.productId}
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 rounded-full border-2 border-base-900 object-cover"
                  />
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-sm text-white/50">{order.items.length} item(s)</span>
                <span className="font-display text-lg font-semibold">{formatPrice(order.total)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
