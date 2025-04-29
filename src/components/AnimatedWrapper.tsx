import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { animationVariants } from "../animations/animation-variants";

interface AnimatedWrapperProps {
  children: React.ReactNode;
  animationKey: string;
  animationType?: keyof typeof animationVariants;
  transition?: {
    duration?: number;
    [key: string]: any;
  };
  mode?: "wait" | "sync" | "popLayout";
}

const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  animationKey,
  animationType = "fade",
  transition = { duration: 0.3 },
  mode = "wait",
}) => {
  const variants = animationVariants[animationType] || animationVariants.fade;

  return (
    <AnimatePresence mode={mode}>
      <motion.div
        key={animationKey}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedWrapper;
