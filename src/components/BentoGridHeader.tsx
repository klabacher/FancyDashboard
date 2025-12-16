import { motion } from "framer-motion";
import {
  FiHome,
  FiGrid,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useDashboardStore } from "@State/dashboardStore";

function Pager() {
  const { currentPage, totalPages, nextPage, prevPage, setCurrentPage } =
    useDashboardStore();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/10 shadow-lg">
      <button
        onClick={prevPage}
        disabled={currentPage === 0}
        className="text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
      >
        <FiChevronLeft size={16} />
      </button>

      <div className="flex space-x-2">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx)}
            className={`
                            h-1.5 rounded-full transition-all duration-300
                            ${currentPage === idx ? "w-6 bg-white" : "w-1.5 bg-zinc-600 hover:bg-zinc-500"}
                        `}
          />
        ))}
      </div>

      <button
        onClick={nextPage}
        disabled={currentPage === totalPages - 1}
        className="text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
      >
        <FiChevronRight size={16} />
      </button>
    </div>
  );
}

export default function BentoGridHeader({
  shuffleWidgets,
}: {
  shuffleWidgets: () => void;
}) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-6 bg-linear-to-b from-black/20 to-transparent pointer-events-none">
      {/* Left: Minimal Branding or Empty for balance */}
      <div className="w-24 pointer-events-auto">
        <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
      </div>

      {/* Center: The Pager (The Import) */}
      <div className="pointer-events-auto">
        <Pager />
      </div>

      {/* Right: Actions (Subtle) */}
      <nav className="flex items-center gap-2 pointer-events-auto">
        <IconButton onClick={shuffleWidgets} icon={<FiHome size={16} />} />
        <IconButton icon={<FiGrid size={16} />} />
        <IconButton icon={<FiSettings size={16} />} />
      </nav>
    </header>
  );
}

function IconButton({
  icon,
  onClick,
}: {
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="p-2 rounded-full text-zinc-400 hover:text-white transition-colors"
    >
      {icon}
    </motion.button>
  );
}
