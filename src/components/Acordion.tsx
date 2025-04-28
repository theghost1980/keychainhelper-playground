// src/components/Accordion.tsx
import React from "react";
import styles from "./Accordion.module.css";

interface AccordionProps {
  title: string; // Título de la sección
  children: React.ReactNode; // Contenido
  isOpen: boolean; // <-- Estado de expansión controlado por el padre
  onToggle: () => void; // <-- Función para alternar el estado, proporcionada por el padre
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  isOpen,
  onToggle,
}) => {
  // Ya no hay estado interno 'isOpen'. Usamos la prop 'isOpen' directamente.

  return (
    <div className={styles.accordionContainer}>
      {/* Cabecera clickeable que llama a la función onToggle del padre */}
      <button className={styles.accordionHeader} onClick={onToggle}>
        {title}
        {/* La flecha visual depende de la prop 'isOpen' */}
        <span
          className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""}`}
        ></span>
      </button>

      {/* Contenedor del contenido. Su visibilidad depende de la prop 'isOpen' */}
      <div
        className={`${styles.accordionContent} ${
          isOpen ? styles.contentOpen : ""
        }`}
      >
        <div className={styles.accordionBody}>
          {children} {/* Renderiza el contenido */}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
