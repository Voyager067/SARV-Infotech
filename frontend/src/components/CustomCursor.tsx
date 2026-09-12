import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const CustomCursor = () => {
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, { damping: 25, stiffness: 300, mass: 0.5 });
  const ringY = useSpring(cursorY, { damping: 25, stiffness: 300, mass: 0.5 });

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
      if (!isVisible) setIsVisible(true);

      const target = event.target as HTMLElement;
      setIsHoveringInteractive(Boolean(target.closest("a, button, input, [role='button']")));
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [cursorX, cursorY, isVisible]);

  if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
    return null;
  }

  return (
    <div className={`pointer-events-none fixed inset-0 z-[100] ${isVisible ? "" : "opacity-0"}`}>
      <motion.div
        className="fixed top-0 left-0 h-2 w-2 rounded-full bg-cyan-300"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-violet-300/70"
        animate={{
          width: isHoveringInteractive ? 56 : 32,
          height: isHoveringInteractive ? 56 : 32,
          opacity: isHoveringInteractive ? 0.9 : 0.5,
        }}
        transition={{ duration: 0.2 }}
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
      />
    </div>
  );
};

export default CustomCursor;
