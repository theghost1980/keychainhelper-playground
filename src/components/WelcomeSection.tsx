import React from "react";
import utilityStyles from "../styles/utility.module.css";

const WelcomeSection: React.FC = () => {
  return (
    <div className={utilityStyles["welcome-container"]}>
      <ul className={utilityStyles["ul-row-list"]}>
        <li>
          <img
            src="https://img.shields.io/badge/lightweight-yes-brightgreen"
            alt="Lightweight"
          />
        </li>
        <li>
          <img
            src="https://img.shields.io/badge/frontend-friendly-blue"
            alt="Frontend Friendly"
          />
        </li>
        <li>
          <img
            src="https://img.shields.io/badge/dependencies-none-green"
            alt="No Dependencies"
          />
        </li>
        <li>
          <img
            src="https://img.shields.io/badge/hive-keychain-red"
            alt="Hive Keychain"
          />
        </li>
      </ul>
      <h2>Bienvenido al Hive Keychain React Test App</h2>
      <p>
        Este es un entorno interactivo para explorar y probar las
        funcionalidades de la librería `keychain-helper` en una aplicación React
        con TypeScript y Webpack.
      </p>
      <p>
        📦 en npm |
        <a
          href="https://www.npmjs.com/package/keychain-helper"
          target="_blank"
          rel="noopener noreferrer"
        >
          keychain-helper
        </a>{" "}
      </p>
      <h3>¿Cómo usarlo?</h3>
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
