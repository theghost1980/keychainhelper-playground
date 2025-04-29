import { KeychainHelper } from "keychain-helper";
import React, { useState } from "react";
import utilityStyles from "../../styles/utility.module.css";
import Accordion from "../Acordion";
import styles from "./RequestTest.module.css";

interface EncodeMessageTestProps {
  isKeychainInstalled: boolean | null;
}

const EncodeMessageTest: React.FC<EncodeMessageTestProps> = ({
  isKeychainInstalled,
}) => {
  const [response, setResponse] = useState<any>(null);
  const [copyButtonText, setCopyButtonText] = useState("Copiar Código");

  const [username, setUsername] = useState("");
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [keyType, setKeyType] = useState("Memo");
  const [isOpen, setIsOpen] = useState(false);

  const isButtonDisabled =
    !isKeychainInstalled || !username || !receiver || !message || !keyType;

  const handleRequest = () => {
    if (
      !isKeychainInstalled ||
      !username ||
      !receiver ||
      !message ||
      !keyType
    ) {
      console.warn("Missing required fields or Keychain not installed.");
      setResponse({
        success: false,
        message: "Missing required fields or Keychain not installed.",
      });
      return;
    }

    KeychainHelper.requestEncodeMessage(
      username,
      receiver,
      message,
      keyType as "Posting" | "Active" | "Memo",
      (response: any) => {
        if (response.success) {
          console.log("SignBuffer Response:", response);
        } else {
          console.error("Error proveniente de Hive keychain:", response);
        }
        setResponse(response);
      }
    );
  };

  const codeSnippet = `import { KeychainHelper } from 'keychain-helper';

// ... state variables: username, receiver, message, keyType, response, isKeychainInstalled

const handleEncodeMessage = () => {
  if (!isKeychainInstalled || !username || !receiver || !message || !keyType) {
    console.warn("Missing required fields or Keychain not installed.");
    // Handle error
    return;
  }

  KeychainHelper.requestEncodeMessage(
    username,
    receiver,
    message,
    keyType, // 'Posting' | 'Active' | 'Memo'
    (response) => {
      console.log("requestEncodeMessage Response:", response);
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
        Cifra un mensaje para que solo un receptor específico pueda descifrarlo.
      </p>

      <Accordion
        title="Abre o cierra el codigo ejemplo"
        onToggle={() => setIsOpen(!isOpen)}
        isOpen={isOpen}
      >
        <div className={styles.codeSection}>
          <pre className={styles.codeBlock}>{codeSnippet}</pre>
          <button onClick={copyCode} className={styles.copyButton}>
            {copyButtonText}
          </button>
        </div>
      </Accordion>

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="encodeMessageUsername">Remitente (Cuenta):</label>
        <input
          id="encodeMessageUsername"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Cuenta Hive"
          className={utilityStyles.input}
        />
      </div>

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="encodeMessageReceiver">Receptor (Cuenta):</label>
        <input
          id="encodeMessageReceiver"
          type="text"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          placeholder="Cuenta Hive"
          className={utilityStyles.input}
        />
      </div>

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="encodeMessageMessage">Mensaje:</label>
        <input
          id="encodeMessageMessage"
          type="text"
          value={message}
          onChange={(e) => setMessage(`${e.target.value}`)}
          placeholder="Mensaje a cifrar"
          className={utilityStyles.input}
        />
      </div>

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="encodeMessageKeyType">Tipo de Clave:</label>
        <select
          id="encodeMessageKeyType"
          value={keyType}
          onChange={(e) => setKeyType(e.target.value)}
          className={utilityStyles.input}
        >
          <option value="Posting">Posting</option>
          <option value="Active">Active</option>
          <option value="Memo">Memo</option>
        </select>
      </div>

      <button
        onClick={handleRequest}
        disabled={isButtonDisabled}
        className={utilityStyles.button}
      >
        Ejecutar Encode Message
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

export default EncodeMessageTest;
