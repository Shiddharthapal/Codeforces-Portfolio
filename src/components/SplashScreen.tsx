"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code, Code2, Braces } from "lucide-react";

export default function SplashScreen() {
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-cyan-600 to-blue-700 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="relative flex items-center justify-center w-32 h-32 bg-white rounded-2xl shadow-xl">
          <motion.div
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute -left-4 -top-4 text-blue-500"
          >
            <Braces size={40} strokeWidth={1.5} />
          </motion.div>

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-cyan-600"
          >
            <Code2 size={64} strokeWidth={1.5} />
          </motion.div>

          <motion.div
            initial={{ rotate: 10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute -right-4 -bottom-4 text-blue-500"
          >
            <Code size={40} strokeWidth={1.5} />
          </motion.div>
        </div>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-8 text-3xl font-bold text-white"
      >
        Contest Tracker
      </motion.h1>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${loadingProgress}%` }}
        className="w-64 h-1 mt-6 bg-white/50 rounded-full overflow-hidden"
      >
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${loadingProgress}%` }}
          className="h-full bg-white rounded-full"
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-2 text-sm text-white/80"
      >
        Loading your contests...
      </motion.p>
    </div>
  );
}
