import { motion } from "framer-motion";
import { FiHome, FiGrid, FiSettings, FiRefreshCw } from "react-icons/fi";

// TODO: Implementar funcionalidade de paginação real
function Pager() {
    return (
        <div className="flex justify-center items-center py-2">
            <div className="flex space-x-2">
                <button className="w-3 h-3 rounded-full bg-zinc-300 aria-selected:bg-zinc-950"></button>
                <button className="w-3 h-3 rounded-full bg-zinc-300 aria-selected:bg-zinc-950"></button>
                <button className="w-3 h-3 rounded-full bg-zinc-300 aria-selected:bg-zinc-950"></button>
            </div>
        </div>
    )
}

function Separator() {
    return (
        <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700 mx-2" />
    )
}

export default function BentoGridHeader(
    { shuffleWidgets }: { shuffleWidgets: () => void }
) {
    return (
        <header className="sticky w-auto h-auto top-0 z-50">
            <div className="w-auto h-auto mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center items-center h-16 gap-1.5">
                    {/* Navigation */}
                    <nav className="flex items-center gap-1.5">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center text-white gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <FiHome size={18} />
                        </motion.button>
                        <Separator />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center text-white gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <FiGrid size={18} />
                        </motion.button>
                        <Separator />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center text-white gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <FiSettings size={18} />
                        </motion.button>
                    </nav>

                    {/* Actions */}
                    {/* <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05, rotate: 180 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={shuffleWidgets}
                            className="p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                            title="Reorganizar widgets"
                        >
                            <FiRefreshCw size={18} />
                        </motion.button>
                        <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addWidget}
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
                      >
                        <FiSettings size={18} />
                      </motion.button>
                    </div> */}
                </div>
            </div>
            <Pager />
        </header>
    )
}