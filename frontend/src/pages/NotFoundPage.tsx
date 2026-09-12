import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-8xl font-bold text-gradient">404</p>
      <p className="mt-4 text-white/60">This page drifted off into space.</p>
      <Link
        to="/"
        className="mt-8 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-3 font-semibold text-black transition hover:brightness-110"
      >
        Back to home
      </Link>
    </div>
  );
};

export default NotFoundPage;
