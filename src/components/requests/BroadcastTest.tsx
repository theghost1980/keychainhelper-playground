import { KeychainHelper } from "keychain-helper";
import React, { useState } from "react";
import utilityStyles from "../../styles/utility.module.css";
import Accordion from "../Acordion";
import styles from "./RequestTest.module.css";

interface BroadcastTestProps {
  isKeychainInstalled: boolean | null;
}

const BroadcastTest: React.FC<BroadcastTestProps> = ({
  isKeychainInstalled,
}) => {
  const [response, setResponse] = useState<any>(null);
  const [copyButtonText, setCopyButtonText] = useState("Copiar Código");
  const [isCodeOpen, setIsCodeOpen] = useState(false);

  const [account, setAccount] = useState("");
  const [followTarget, setFollowTarget] = useState("");
  const [keyType, setKeyType] = useState("Posting");

  const isButtonDisabled =
    !isKeychainInstalled || !account || !followTarget || !keyType;

  const handleRequest = () => {
    if (!isKeychainInstalled || !account || !followTarget || !keyType) {
      console.warn("Missing required fields or Keychain not installed.");
      setResponse({
        success: false,
        message: "Missing required fields or Keychain not installed.",
      });
      return;
    }

    console.log("Constructing operations array for broadcast...");
    console.log(
      "Example operation: Following a user using custom_json 'follow'"
    );

    const operations = [
      [
        "custom_json",
        {
          required_auths: [],
          required_posting_auths: [account],
          id: "follow",
          json: JSON.stringify([
            "follow",
            {
              follower: account,
              following: followTarget,
              what: ["blog"],
            },
          ]),
        },
      ],
    ] as [string, object][];

    KeychainHelper.requestBroadcast(
      account,
      operations,
      keyType as "Posting" | "Active" | "Memo",
      (response: any) => {
        console.log("requestBroadcast Response:", response);
        if (response.success) {
          console.log("Broadcast Success:", response.result);
        } else {
          console.error(
            "Broadcast Failed:",
            response.message || response.error || "Unknown error"
          );
        }
        setResponse(response);
      }
    );
  };

  const codeSnippet = `import { KeychainHelper } from 'keychain-helper';

// ... state variables: account (follower), followTarget (following), keyType, response, isKeychainInstalled
// ... asumiendo un setter de estado como setResponse

const handleBroadcast = () => {
  if (!isKeychainInstalled || !account || !followTarget || !keyType) {
      console.warn("Missing required fields or Keychain not installed.");
      // Manejar error
      return;
  }

  // --- Construye el array de operaciones para el ejemplo 'follow' ---
  // Este array define las operaciones de blockchain a transmitir
  const operations = [
    ['custom_json', { // Tipo de operación: custom_json
      required_auths: [], // Cuentas que requieren auth Active
      required_posting_auths: [account], // Cuentas que requieren auth Posting
      id: 'follow', // Tipo de operación custom_json (seguir)
      json: JSON.stringify(['follow', { // Payload JSON para la operación 'follow'
        follower: account,
        following: followTarget,
        what: ['blog'] // 'blog' para seguir publicaciones, [] para dejar de seguir
      }])
    }] as [string, object][];
    // Puedes añadir más operaciones aquí para una sola transmisión
  ];


  KeychainHelper.requestBroadcast(
    account, // Cuenta que transmite (necesita autoridad keyType)
    operations, // Array de operaciones
    keyType, // Tipo de clave requerida para TODAS las operaciones
    (response) => { // <-- CALLBACK
      console.log("requestBroadcast Response:", response);

      if (response.success) {
         console.log("Broadcast Success:", response.result);
      } else {
         console.error("Broadcast Failed:", response.message || response.error || 'Unknown error');
      }
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
    <>
      <p>
        Envía una o varias operaciones a la blockchain en una sola transacción.
        Se usa un ejemplo de "seguir" a un usuario.
      </p>

      <Accordion
        title="Código de Ejemplo (Operación: Seguir Usuario)"
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
        <label htmlFor="broadcastAccount">Cuenta que Transmite:</label>
        <input
          id="broadcastAccount"
          type="text"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          placeholder="Tu cuenta Hive"
          className={utilityStyles.input}
        />
      </div>

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="broadcastFollowTarget">
          Cuenta a Seguir/Dejar de Seguir:
        </label>
        <input
          id="broadcastFollowTarget"
          type="text"
          value={followTarget}
          onChange={(e) => setFollowTarget(e.target.value)}
          placeholder="Cuenta objetivo (ej: stoodkev)"
          className={utilityStyles.input}
        />
      </div>

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="broadcastKeyType">Tipo de Clave Necesaria:</label>
        <select
          id="broadcastKeyType"
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
        Ejecutar Broadcast (Seguir)
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

export default BroadcastTest;
