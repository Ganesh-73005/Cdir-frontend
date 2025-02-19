"use client";

import { Radar } from "lucide-react";
import { motion } from "framer-motion";

interface SponsorProps {
    icon: JSX.Element;
    name: string;
}

const sponsors: SponsorProps[] = [
    { icon: <Radar size={34} />, name: "Ganesh S" },
    { icon: <Radar size={34} />, name: "Logesh M S" },
    { icon: <Radar size={34} />, name: "Dharaniraj V M" },
    { icon: <Radar size={34} />, name: "Ratish" },
    { icon: <Radar size={34} />, name: "Neelakandan" },
];

export const Sponsors = () => {
    return (
        <section id="sponsors" className="container pt-24 sm:py-32">
            <motion.h2
                className="text-center text-xl md:text-2xl font-bold mb-10 text-primary"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                Founders
            </motion.h2>

            <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-center items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                {sponsors.map(({ icon, name }) => (
                    <motion.div
                        key={name}
                        className="flex flex-col items-center p-4 rounded-xl bg-gray-100 dark:bg-gray-800 shadow-md hover:scale-105 transition-all duration-300 ease-out"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="text-primary">{icon}</span>
                        <h3 className="text-lg font-semibold text-muted-foreground">{name}</h3>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};
