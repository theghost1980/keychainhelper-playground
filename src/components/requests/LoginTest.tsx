import { KeychainHelper } from "keychain-helper";
import React, { useState } from "react";
import utilityStyles from "../../styles/utility.module.css";
import Accordion from "../Acordion";
import styles from "./RequestTest.module.css";

interface LoginTestProps {
  isKeychainInstalled: boolean | null;
}

const LoginTest: React.FC<LoginTestProps> = ({ isKeychainInstalled }) => {
  const [response, setResponse] = useState<any>(null);
  const [copyButtonText, setCopyButtonText] = useState("Copiar Código");
  const [isCodeOpen, setIsCodeOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [challenge, setChallenge] = useState("");
  const [title, setTitle] = useState("");

  const isButtonDisabled = !isKeychainInstalled || !username || !challenge;

  const handleRequest = () => {
    if (!isKeychainInstalled || !username || !challenge) {
      console.warn("Missing required fields or Keychain not installed.");
      setResponse({
        success: false,
        message: "Missing required fields or Keychain not installed.",
      });
      return;
    }

    KeychainHelper.requestLogin(
      username,
      challenge,
      (response: any) => {
        console.log("requestLogin Response:", response);
        if (response.success) {
          console.log("Login Success:", response.result);
        } else {
          console.error(
            "Login Failed:",
            response.message || response.error || "Unknown error"
          );
        }
        setResponse(response);
      },
      title
    );
  };

  const codeSnippet = `import { KeychainHelper } from 'keychain-helper';

// ... state variables: username, challenge, title, response, isKeychainInstalled
// ... assuming a state setter like setResponse exists

const handleLogin = () => {
  if (!isKeychainInstalled || !username || !challenge) {
    console.warn("Missing required fields or Keychain not installed.");
    // Handle error
    return;
  }

  KeychainHelper.requestLogin(
    username,
    challenge,
    (response) => { // <-- CALLBACK
      console.log("requestLogin Response:", response);

      if (response.success) {
         console.log("Login Success:", response.result);
      } else {
         console.error("Login Failed:", response.message || response.error || 'Unknown error');
      }
      // Update response state
      setResponse(response);
    },
    title
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
        El login es usado como una utilidad. Decidí incluirlo como si fuese una
        request, pero no lo es. En última instancia se lleva a cabo un{" "}
        <strong>signBuffer</strong> jugando con los parámetros. Aun así, es muy
        útil para no tener que usar el <strong>signBuffer</strong> directamente.
      </p>
      <p>
        <em>
          Tip: combinado con un backend robusto, usando JWT puede proveer de un
          sistema muy seguro y apto para la web3.
        </em>
      </p>

      <div
        className={utilityStyles["welcome-container"]}
        style={{
          borderColor: "#007bff",
          backgroundColor: "#cce5ff",
          color: "#004085",
        }}
      >
        <h4 style={{ color: "#004085", marginTop: 0 }}>
          🔐 Sobre el Login de Hive Keychain
        </h4>
        <p>
          Hive Keychain permite realizar login Web3 de forma segura firmando un
          mensaje de desafío (challenge) sin exponer claves privadas.
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
        <label htmlFor="loginUsername">Cuenta Hive:</label>
        <input
          id="loginUsername"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Tu cuenta Hive"
          className={utilityStyles.input}
        />
      </div>

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="loginChallenge">Challenge:</label>
        <input
          id="loginChallenge"
          type="text"
          value={challenge}
          onChange={(e) => setChallenge(e.target.value)}
          placeholder="Mensaje o token único"
          className={utilityStyles.input}
        />
      </div>

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="loginTitle">Título (opcional):</label>
        <input
          id="loginTitle"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título para mostrar en Keychain"
          className={utilityStyles.input}
        />
      </div>

      <button
        onClick={handleRequest}
        disabled={isButtonDisabled}
        className={utilityStyles.button}
      >
        Ejecutar Login
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

export default LoginTest;
