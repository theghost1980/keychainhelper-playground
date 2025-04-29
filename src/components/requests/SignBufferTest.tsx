import { KeychainHelper } from "keychain-helper";
import React, { useState } from "react";
import utilityStyles from "../../styles/utility.module.css";
import Accordion from "../Acordion";
import styles from "./RequestTest.module.css";

interface SignBufferTestProps {
  isKeychainInstalled: boolean | null;
}

const SignBufferTest: React.FC<SignBufferTestProps> = ({
  isKeychainInstalled,
}) => {
  const [response, setResponse] = useState<any>(null);
  const [testAccount, setTestAccount] = useState<string>("theghost.tests");
  const [copyButtonText, setCopyButtonText] = useState("Copiar Código");
  const [isOpen, setIsOpen] = useState(false);

  const handleRequest = () => {
    console.log("Testing requestSignBuffer...");
    if (!isKeychainInstalled) {
      console.error("Keychain not installed, cannot test SignBuffer.");
      setResponse({ success: false, message: "Keychain is not installed." });
      return;
    }
    if (!testAccount) {
      console.warn("Please enter a Hive account name.");
      setResponse({ success: false, message: "Please enter an account name." });
      return;
    }

    const messageToSign = "Test message: " + Date.now();
    const keyType = "Posting";

    KeychainHelper.requestSignBuffer(
      testAccount,
      messageToSign,
      keyType,
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

// ... asumiendo estado para la respuesta (setResponse), cuenta (testAccount),
// y si Keychain está instalado (isKeychainInstalled)

const handleSignBuffer = () => {
  if (!isKeychainInstalled) {
    console.error("Keychain not installed, cannot test SignBuffer.");
    // Manejar error
    return;
  }
  if (!testAccount) {
    console.warn("Please enter a Hive account name.");
    // Manejar error
    return;
  }

  const messageToSign = "Test message: " + Date.now();
  const keyType = "Posting"; // O "Active", "Memo"

  KeychainHelper.requestSignBuffer(
    testAccount,
    messageToSign,
    keyType,
    (response) => {
      console.log("SignBuffer Response:", response);
      // Actualizar estado de respuesta
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
    <div className={styles.requestContainer}>
      <h3>Keychain - Sign Buffer</h3>

      <p>Firma un mensaje arbitrario con la clave de un usuario.</p>

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
        {" "}
        <label htmlFor="signBufferAccount">Cuenta:</label>
        <input
          id="signBufferAccount"
          type="text"
          value={testAccount}
          onChange={(e) => setTestAccount(e.target.value)}
          placeholder="Nombre de cuenta Hive"
          className={utilityStyles.input}
        />
      </div>

      <button
        onClick={handleRequest}
        disabled={!isKeychainInstalled}
        className={utilityStyles.button}
      >
        Ejecutar Sign Buffer (Posting)
      </button>

      {response && (
        <div className={styles.responseSection}>
          <h4>Respuesta:</h4>
          <pre className={styles.responseBlock}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SignBufferTest;
