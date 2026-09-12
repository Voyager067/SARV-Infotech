import { motion } from "framer-motion";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { api } from "../lib/api";
import { formatPrice } from "../lib/format";
import { useCartStore } from "../store/cartStore";
import { Product } from "../types";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    api
      .get<Product>(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <Loader />;

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-white/60">We couldn't find that product.</p>
        <button onClick={() => navigate("/products")} className="mt-4 text-cyan-300 hover:underline">
          Back to shop
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i += 1) addItem(product);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-10">
      <Link to="/products" className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Back to shop
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass glow-border relative aspect-square overflow-hidden rounded-3xl"
        >
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-xs uppercase tracking-widest text-white/40">{product.category}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold">{product.name}</h1>
          <p className="mt-4 font-display text-3xl font-semibold text-gradient">{formatPrice(product.price)}</p>
          <p className="mt-6 leading-relaxed text-white/60">{product.description}</p>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-full border border-white/10 px-4 py-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="rounded-full p-1 hover:bg-white/10"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="rounded-full p-1 hover:bg-white/10">
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 py-3 font-semibold text-black transition hover:brightness-110"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to cart
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
