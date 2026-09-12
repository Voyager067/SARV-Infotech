import { Sparkles } from "lucide-react";
import { CREATOR_NAME, SITE_NAME } from "../constants";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto mt-16 max-w-6xl px-4 pb-10">
      <div className="glass flex flex-col items-center gap-3 rounded-2xl px-6 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2 text-sm text-white/50">
          <Sparkles className="h-4 w-4 text-cyan-300" />
          <span>
            {SITE_NAME} &copy; {year}
          </span>
        </div>
        <p className="text-sm text-white/50">
          Built with <span className="text-pink-300">♥</span> by{" "}
          <span className="font-medium text-white/80">{CREATOR_NAME}</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
