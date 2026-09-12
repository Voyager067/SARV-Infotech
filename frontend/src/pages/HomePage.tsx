import { motion } from "framer-motion";
import { ArrowRight, Truck, ShieldCheck, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { api } from "../lib/api";
import { Product } from "../types";

const PERKS = [
  { icon: Zap, label: "Instant checkout", detail: "No 12-step forms. Just a few taps." },
  { icon: Truck, label: "Fast, free shipping", detail: "On every order, every time." },
  { icon: ShieldCheck, label: "Secure by design", detail: "Your data stays yours." },
];

const HomePage = () => {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    api
      .get<Product[]>("/products")
      .then((res) => setFeatured(res.data.slice(0, 4)))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24">
      <section className="relative flex flex-col items-center pt-20 text-center sm:pt-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-white/70"
        >
          ✦ A shopping experience from the future
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-3xl font-display text-5xl font-semibold leading-tight sm:text-7xl"
        >
          Shop like it's <span className="text-gradient">2035</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 max-w-xl text-lg text-white/60"
        >
          Curated tech, audio, and home gear — wrapped in an interface that actually feels good to use.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/products"
            className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-3 font-semibold text-black transition hover:brightness-110"
          >
            Start shopping
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
          <a
            href="#perks"
            className="rounded-full border border-white/15 px-6 py-3 font-medium text-white/80 transition hover:border-white/30 hover:text-white"
          >
            Why EKart?
          </a>
        </motion.div>

        <div className="relative mt-20 h-64 w-full max-w-3xl sm:h-80">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="glass glow-border absolute left-[8%] top-4 h-28 w-28 rounded-2xl sm:h-36 sm:w-36"
          />
          <motion.div
            animate={{ y: [0, 24, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="glass glow-border absolute right-[10%] top-16 h-20 w-20 rounded-full sm:h-28 sm:w-28"
          />
          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="glass glow-border absolute bottom-0 left-1/3 h-24 w-40 rounded-2xl sm:h-28 sm:w-52"
          />
        </div>
      </section>

      <section id="perks" className="mt-16 grid gap-6 sm:grid-cols-3">
        {PERKS.map(({ icon: Icon, label, detail }) => (
          <div key={label} className="glass rounded-2xl p-6">
            <Icon className="h-6 w-6 text-cyan-300" />
            <p className="mt-4 font-display font-semibold">{label}</p>
            <p className="mt-1 text-sm text-white/50">{detail}</p>
          </div>
        ))}
      </section>

      {featured.length > 0 && (
        <section className="mt-24">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-3xl font-semibold">Fresh drops</h2>
            <Link to="/products" className="text-sm text-white/60 hover:text-white">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
