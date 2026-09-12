import { useEffect, useMemo, useState } from "react";
import Loader from "../components/Loader";
import ProductCard from "../components/ProductCard";
import { CATEGORIES } from "../constants";
import { api } from "../lib/api";
import { Product } from "../types";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>("All");

  useEffect(() => {
    api
      .get<Product[]>("/products")
      .then((res) => setProducts(res.data))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredProducts = useMemo(
    () => (activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory)),
    [products, activeCategory]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-12">
      <div className="mb-10 flex flex-col gap-4">
        <h1 className="font-display text-4xl font-semibold">
          Shop <span className="text-gradient">everything</span>
        </h1>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                activeCategory === category
                  ? "border-transparent bg-gradient-to-r from-violet-500 to-cyan-400 text-black"
                  : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : filteredProducts.length === 0 ? (
        <p className="py-20 text-center text-white/50">No products in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
