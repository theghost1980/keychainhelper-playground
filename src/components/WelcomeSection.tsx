import React from "react";
import utilityStyles from "../styles/utility.module.css";

const WelcomeSection: React.FC = () => {
  return (
    // Usamos una clase del módulo de utilidades para el contenedor
    <div className={utilityStyles["welcome-container"]}>
      <h2>Bienvenido al Hive Keychain React Test App</h2>
      <p>
        Este es un entorno interactivo para explorar y probar las
        funcionalidades de la librería `keychain-helper` en una aplicación React
        con TypeScript y Webpack.
      </p>
      <p>**¿Cómo usarlo?**</p>
      <ol>
        <li>
          Asegúrate de tener la extensión{" "}
          <a
            href="https://hive-keychain.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hive Keychain
          </a>{" "}
          instalada en tu navegador y una cuenta de Hive configurada.
        </li>
        <li>
          La barra de estado en la parte superior te indicará si la extensión
          fue detectada.
        </li>
        <li>
          Usa el menú de arriba para seleccionar el tipo de request de Keychain
          que deseas probar.
        </li>
        <li>
          Cada sección de request mostrará un botón para ejecutar la llamada a
          la API de Keychain y el código de ejemplo para copiar.
        </li>
        <li>
          Observa la consola del navegador (F12) y el área de respuesta en la
          página para ver el resultado de cada request.
        </li>
      </ol>
      <p>¡Empieza seleccionando una request del menú!</p>
    </div>
  );
};

export default WelcomeSection;
