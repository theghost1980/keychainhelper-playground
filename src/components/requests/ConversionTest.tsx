import { KeychainHelper } from "keychain-helper";
import React, { useState } from "react";
import utilityStyles from "../../styles/utility.module.css";
import Accordion from "../Acordion";
import styles from "./RequestTest.module.css";

interface ConversionTestProps {
  isKeychainInstalled: boolean | null;
}

const ConversionTest: React.FC<ConversionTestProps> = ({
  isKeychainInstalled,
}) => {
  const [response, setResponse] = useState<any>(null);
  const [copyButtonText, setCopyButtonText] = useState("Copiar Código");
  const [isCodeOpen, setIsCodeOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");

  const isButtonDisabled =
    !isKeychainInstalled || !username || !amount || isNaN(parseFloat(amount));

  const handleRequest = () => {
    if (
      !isKeychainInstalled ||
      !username ||
      !amount ||
      isNaN(parseFloat(amount))
    ) {
      console.warn(
        "Missing required fields, invalid amount, or Keychain not installed."
      );
      setResponse({
        success: false,
        message:
          "Missing required fields, invalid amount, or Keychain not installed.",
      });
      return;
    }

    const amountWith3Decimals = parseFloat(amount).toFixed(3);
    const collaterized = true;

    KeychainHelper.requestConversion(
      username,
      amountWith3Decimals,
      collaterized,
      (response: any) => {
        console.log("requestConversion Response:", response);
        if (response.success) {
          console.log("Conversion Success:", response.result);
        } else {
          console.error(
            "Conversion Failed:",
            response.message || response.error || "Unknown error"
          );
        }
        setResponse(response);
      }
    );
  };

  const codeSnippet = `import { KeychainHelper } from 'keychain-helper';

// ... state variables: username, amount, response, isKeychainInstalled
// ... assuming a state setter like setResponse exists

const handleConversion = () => {
  if (!isKeychainInstalled || !username || !amount || isNaN(parseFloat(amount))) {
      console.warn("Missing required fields, invalid amount, or Keychain not installed.");
      // Handle error
      return;
  }

  // Ensure amount is a string with exactly 3 decimals, as required by Keychain
  const amountWith3Decimals = parseFloat(amount).toFixed(3);
  const collaterized = true; //true to convert HIVE to HBD. false to convert HBD to HIVE.

  KeychainHelper.requestConversion(
    username,
    amountWith3Decimals, // Amount of HIVE to convert (string, 3 decimals)
    collaterized,
    (response) => { // <-- CALLBACK
      console.log("requestConversion Response:", response);

      if (response.success) {
         console.log("Conversion Success:", response.result);
      } else {
         console.error("Conversion Failed:", response.message || response.error || 'Unknown error');
      }
      // Update response state
      setResponse(response);
    }
  );
};`;

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
    <>
      <p>
        Solicita convertir HIVE a HBD. Este proceso tarda 3.5 días en
        completarse.
      </p>

      <div
        className={utilityStyles["welcome-container"]}
        style={{
          borderColor: "#ffc107",
          backgroundColor: "#fff3cd",
          color: "#856404",
        }}
      >
        <h4 style={{ color: "#856404", marginTop: 0 }}>
          💡 Recomendación para Conversiones Rápidas
        </h4>
        <p>
          La conversión de HIVE a HBD a través de esta request
          (`requestConversion`) tarda **3.5 días** en completarse. Si necesitas
          HBD de forma más inmediata, existen opciones de mercado:
        </p>
        <ol>
          <li>
            Usar Exchanges descentralizados como **Tribaldex.com** (usando el
            mercado HIVE:HBD).
          </li>
          <li>Usar la interfaz de **Hive-Engine.com** (mercado HIVE:HBD).</li>
          <li>
            Usar la función de **"Swap" directamente dentro de la billetera Hive
            Keychain** (si está disponible y ofrece un par HIVE/HBD
            conveniente).
          </li>
        </ol>
        <p>
          Estas opciones suelen ser más rápidas, aunque pueden tener ligeras
          variaciones en la tasa de cambio dependiendo del mercado.
        </p>
      </div>

      <Accordion
        title="Código de Ejemplo"
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

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="conversionUsername">Cuenta:</label>
        <input
          id="conversionUsername"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Tu cuenta Hive"
          className={utilityStyles.input}
        />
      </div>

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="conversionAmount">Cantidad (HIVE):</label>
        <input
          id="conversionAmount"
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Cantidad de HIVE (ej: 1.000)"
          className={utilityStyles.input}
        />
      </div>

      <button
        onClick={handleRequest}
        disabled={isButtonDisabled}
        className={utilityStyles.button}
      >
        Ejecutar Request Conversion
      </button>

      {response && (
        <div className={styles.responseSection}>
          <h4>Respuesta:</h4>
          <pre className={utilityStyles.responsePre}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </>
  );
};

export default ConversionTest;
