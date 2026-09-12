import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { Plus } from "lucide-react";
import { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../lib/format";
import { useCartStore } from "../store/cartStore";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);

  const rotateX = useSpring(useMotionValue(0), { stiffness: 250, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 250, damping: 20 });
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(300px circle at ${pointerX}% ${pointerY}%, ${product.accentColor}33, transparent 70%)`;

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    rotateY.set((x - 0.5) * 14);
    rotateX.set((0.5 - y) * 14);
    pointerX.set(x * 100);
    pointerY.set(y * 100);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="glass glow-border group relative overflow-hidden rounded-2xl p-4"
      >
        <motion.div style={{ background: spotlight }} className="pointer-events-none absolute inset-0" />

        <Link to={`/products/${product._id}`} className="relative block">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-white/5">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />
            {product.tag && (
              <span
                className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-black"
                style={{ backgroundColor: product.accentColor }}
              >
                {product.tag}
              </span>
            )}
          </div>

          <div className="relative mt-4 space-y-1">
            <p className="text-xs uppercase tracking-wider text-white/40">{product.category}</p>
            <h3 className="font-display font-medium leading-snug">{product.name}</h3>
          </div>
        </Link>

        <div className="relative mt-4 flex items-center justify-between">
          <span className="font-display text-lg font-semibold">{formatPrice(product.price)}</span>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/20"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
