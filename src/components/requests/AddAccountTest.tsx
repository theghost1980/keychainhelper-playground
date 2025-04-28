import React, { useState } from "react";
import utilityStyles from "../../styles/utility.module.css";
import Accordion from "../Acordion";
import styles from "./RequestTest.module.css";

const AddAccountTest: React.FC = () => {
  const [copyButtonText, setCopyButtonText] = useState("Copiar Código");
  const [isCodeOpen, setIsCodeOpen] = useState(false);

  // El código de ejemplo para mostrar y copiar (CON ADVERTENCIAS)
  const codeSnippet = `import { KeychainHelper } from 'keychain-helper';

// !!! ADVERTENCIA EXTREMA: MANEJAR CLAVES PRIVADAS DIRECTAMENTE EN UNA INTERFAZ WEB ES EXTREMADAMENTE PELIGROSO Y NO ES RECOMENDADO !!!
// ESTE CÓDIGO ES SOLO UN EJEMPLO DE CÓMO SE LLAMA LA FUNCIÓN.
// NUNCA Pidas las claves privadas del usuario directamente en tu UI.

// Supongamos que obtienes estas claves de forma SEGURA (ej: desde un backend de confianza
// o un entorno local controlado como una extensión de navegador) - NO DESDE CAMPOS DE INPUT EN LA UI.
const username = 'la-cuenta-a-añadir'; // La cuenta que quieres añadir
const activeKey = '...'; // La clave activa privada (WIF) - Opcional
const postingKey = '...'; // La clave posting privada (WIF) - Opcional
const memoKey = '...';   // La clave memo privada (WIF) - Opcional

// Construye el objeto de claves, incluyendo solo las que tengas disponibles y sean válidas
const keys = {};
if (activeKey) keys.active = activeKey;
if (postingKey) keys.posting = postingKey;
if (memoKey) keys.memo = memoKey;

// Asegúrate de tener al menos una clave
if (Object.keys(keys).length === 0) {
  console.error("Se requiere al menos una clave privada para añadir la cuenta.");
  // No puedes ejecutar la request sin claves
  return;
}

// Lógica de la función (handleRequest) si pudieras ejecutarla de forma segura
const handleAddAccountSafely = () => {
  // La llamada a KeychainHelper.requestAddAccount va AQUÍ:
  // KeychainHelper.requestAddAccount(
  //   username, // Nombre de la cuenta
  //   keys,     // Objeto con las claves privadas (activo, posting, memo)
  //   (response) => { // <-- CALLBACK
  //     console.log("requestAddAccount Response:", response);
  //     if (response.success) {
  //        console.log("Add Account Success:", response.result);
  //     } else {
  //        console.error("Add Account Failed:", response.message || response.error || 'Unknown error');
  //     }
  //     // Actualiza tu estado de respuesta en tu componente
  //     // setResponse(response);
  //   }
  // );
};

// handleAddAccountSafely(); // Llamarías a esta función de forma segura
`;

  const copyCode = () => {
    navigator.clipboard
      .writeText(codeSnippet)
      .then(() => {
        setCopyButtonText("Copiado!");
        setTimeout(() => setCopyButtonText("Copiar Código"), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy code: ", err);
        setCopyButtonText("Error al Copiar");
      });
  };

  return (
    // Retorna solo el contenido interno para el Accordion en App.tsx
    <>
      <p>
        La request `requestAddAccount` se usa para añadir una cuenta existente a
        la extensión Hive Keychain proporcionando sus claves privadas.
      </p>
      {/* Acordeón interno para el código de ejemplo */}
      <Accordion
        title="Ver Código de Ejemplo (¡Con Advertencia!)"
        onToggle={() => setIsCodeOpen(!isCodeOpen)}
        isOpen={isCodeOpen}
      >
        <div className={styles.codeSection}>
          <pre className={styles.codeBlock}>{codeSnippet}</pre>
          <button onClick={copyCode} className={styles.copyButton}>
            {copyButtonText}
          </button>
        </div>
      </Accordion>

      {/* !!! SECCIÓN DE ADVERTENCIA Y RECOMENDACIONES !!! */}
      <div
        className={utilityStyles["welcome-container"]}
        style={{
          borderColor: "red",
          backgroundColor: "#ffebeb",
          color: "#c0392b",
        }}
      >
        <h4 style={{ color: "#c0392b", marginTop: 0 }}>
          ⚠️ Advertencia de Seguridad y Mejores Prácticas ⚠️
        </h4>
        <p>
          La request `requestAddAccount` tal como se define en el script base de
          `hive_keychain` **requiere exponer claves privadas** al código de la
          interfaz web para poder enviarlas a la extensión.
        </p>
        <p>
          **Esto es una práctica extremadamente peligrosa y NO ES RECOMENDADO.**
          Exponer las claves privadas en el código o pedir al usuario que las
          introduzca directamente en campos de texto en una aplicación web abre
          la puerta a robos si el código no es 100% seguro o si la aplicación es
          comprometida.
        </p>
        <p style={{ fontWeight: "bold" }}>
          ⭐ Preferimos no permitir probar esta request directamente en este
          playground público porque expone claves privadas.
        </p>
        <p>
          **Recomendación:**
          <br />
          En lugar de pedir claves privadas a los usuarios en tu aplicación, si
          necesitas que un usuario añada una cuenta a su Keychain, la mejor
          práctica es instruirlos para que **usen directamente la interfaz de la
          extensión Keychain** para añadir la cuenta manualmente. La extensión
          es el lugar seguro diseñado para gestionar las claves privadas del
          usuario.
        </p>
        <p>
          Usa otras requests (como `requestSignBuffer`, `requestTransfer`, etc.)
          que **NO requieren claves privadas** para ser expuestas en tu UI, ya
          que la extensión maneja la firma internamente después de que el
          usuario las aprueba.
        </p>
      </div>
    </>
  );
};

export default AddAccountTest;
