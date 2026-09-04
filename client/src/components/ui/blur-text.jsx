import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "../../lib/utils";

export const BlurText = ({
  text,
  className,
  delay = 0,
  duration = 1.2
}) => {
  const words = text.split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration: duration
      },
    },
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.h1
      className={cn("flex flex-wrap items-center justify-center gap-x-[0.3em]", className)}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span variants={child} key={index} className="inline-block whitespace-pre">
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
};
