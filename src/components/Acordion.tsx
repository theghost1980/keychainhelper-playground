import React from "react";
import styles from "./Accordion.module.css";
import AnimatedWrapper from "./AnimatedWrapper";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  isOpen,
  onToggle,
}) => {
  return (
    <div className={styles.accordionContainer}>
      <button className={styles.accordionHeader} onClick={onToggle}>
        {title}
        <span
          className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""}`}
        ></span>
      </button>

      <AnimatedWrapper animationKey={`${isOpen}`} animationType={"fade"}>
        <div
          className={`${styles.accordionContent} ${
            isOpen ? styles.contentOpen : ""
          }`}
        >
          <div className={styles.accordionBody}>{children}</div>
        </div>
      </AnimatedWrapper>
    </div>
  );
};

export default Accordion;
