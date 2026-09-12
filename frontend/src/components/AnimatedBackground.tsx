const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-base-950">
      <div className="absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-violet-600/30 blur-[120px] animate-blob" />
      <div className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-cyan-500/25 blur-[120px] animate-blob [animation-delay:4s]" />
      <div className="absolute bottom-0 left-1/4 h-[26rem] w-[26rem] rounded-full bg-pink-500/20 blur-[120px] animate-blob [animation-delay:8s]" />
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, black 40%, transparent 100%)",
        }}
      />
      <div className="noise-overlay" />
    </div>
  );
};

export default AnimatedBackground;
