// src/components/requests/CreateClaimedAccountTest.tsx
import { KeychainHelper } from "keychain-helper";
import React, { useState } from "react";
import utilityStyles from "../../styles/utility.module.css";
import Accordion from "../Acordion";
import styles from "./RequestTest.module.css";

interface CreateClaimedAccountTestProps {
  isKeychainInstalled: boolean | null;
}

const CreateClaimedAccountTest: React.FC<CreateClaimedAccountTestProps> = ({
  isKeychainInstalled,
}) => {
  const [response, setResponse] = useState<any>(null);
  const [copyButtonText, setCopyButtonText] = useState("Copiar Código");
  const [isCodeOpen, setIsCodeOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [newAccountName, setNewAccountName] = useState("");
  const [ownerKey, setOwnerKey] = useState("");
  const [activeKey, setActiveKey] = useState("");
  const [postingKey, setPostingKey] = useState("");
  const [memoKey, setMemoKey] = useState("");

  const isButtonDisabled =
    !isKeychainInstalled ||
    !username ||
    !newAccountName ||
    (!ownerKey && !activeKey && !postingKey && !memoKey);

  const handleRequest = () => {
    if (
      !isKeychainInstalled ||
      !username ||
      !newAccountName ||
      (!ownerKey && !activeKey && !postingKey && !memoKey)
    ) {
      console.warn(
        "Missing required fields (Account with tickets, New Account Name, and at least one Public Key) or Keychain not installed."
      );
      setResponse({
        success: false,
        message: "Missing required fields or Keychain not installed.",
      });
      return;
    }

    const ownerAuth = {
      account_auths: [],
      key_auths: ownerKey ? [[ownerKey, 1]] : [],
    };
    const activeAuth = {
      account_auths: [],
      key_auths: activeKey ? [[activeKey, 1]] : [],
    };
    const postingAuth = {
      account_auths: [],
      key_auths: postingKey ? [[postingKey, 1]] : [],
    };
    const memoPub = memoKey;

    KeychainHelper.requestCreateClaimedAccount(
      username,
      newAccountName,
      ownerAuth,
      activeAuth,
      postingAuth,
      memoPub,
      (response: any) => {
        console.log("requestCreateClaimedAccount Response:", response);
        if (response.success) {
          console.log("Create Claimed Account Success:", response.result);
        } else {
          console.error(
            "Create Claimed Account Failed:",
            response.message || response.error || "Unknown error"
          );
        }
        setResponse(response);
      }
    );
  };

  const codeSnippet = `import { KeychainHelper } from 'keychain-helper';

// ... state variables: username, newAccountName, ownerKey, activeKey, postingKey, memoKey, response, isKeychainInstalled
// ... assuming a state setter like setResponse exists

const handleCreateClaimedAccount = () => {
  if (!isKeychainInstalled || !username || !newAccountName || (!ownerKey && !activeKey && !postingKey && !memoKey)) {
      console.warn("Missing required fields (Account with tickets, New Account Name, and at least one Public Key) or Keychain not installed.");
      // Handle error
      return;
  }

  const ownerAuth = { account_auths: [], key_auths: ownerKey ? [[ownerKey, 1]] : [] };
  const activeAuth = { account_auths: [], key_auths: activeKey ? [[activeKey, 1]] : [] };
  const postingAuth = { account_auths: [], key_auths: postingKey ? [[postingKey, 1]] : [] };
  const memoPub = memoKey;


  KeychainHelper.requestCreateClaimedAccount(
    username,
    newAccountName,
    ownerAuth,
    activeAuth,
    postingAuth,
    memoPub,
    (response) => { // <-- CALLBACK
      console.log("requestCreateClaimedAccount Response:", response);

      if (response.success) {
         console.log("Create Claimed Account Success:", response.result);
      } else {
         console.error("Create Claimed Account Failed:", response.message || response.error || 'Unknown error');
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
        Solicita crear una cuenta nueva usando tickets de creación de cuenta
        previamente reclamados por la cuenta que ejecuta la request.
      </p>

      {/* --- Sección Introductoria --- */}
      <div
        className={utilityStyles["welcome-container"]}
        style={{
          borderColor: "#17a2b8",
          backgroundColor: "#d1ecf1",
          color: "#0c5460",
        }}
      >
        <h4 style={{ color: "#0c5460", marginTop: 0 }}>
          ℹ️ Información Importante
        </h4>
        <p>
          Esta función (`requestCreateClaimedAccount`) solo estará disponible
          para cuentas que tienen **tickets para creación de cuenta** (también
          conocidos como "claimed account tokens"). Estos tickets se obtienen al
          hacer power up o al reclamar rewards.
        </p>
        <p>
          De igual manera que con cualquier operación que involucra claves
          privadas, es mejor utilizar directamente la Keychain.
        </p>
        <p>
          <a
            href="https://developers.hive.io/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0c5460", textDecoration: "underline" }}
          >
            Más información en la documentación oficial de Hive.
          </a>
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

      {/* Campos de entrada */}
      <div className={utilityStyles.inputGroup}>
        <label htmlFor="createClaimedAccountUsername">
          Cuenta con Tickets:
        </label>
        <input
          id="createClaimedAccountUsername"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Tu cuenta Hive (con tickets)"
          className={utilityStyles.input}
        />
      </div>

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="createClaimedAccountNewName">
          Nuevo Nombre de Cuenta:
        </label>
        <input
          id="createClaimedAccountNewName"
          type="text"
          value={newAccountName}
          onChange={(e) => setNewAccountName(e.target.value)}
          placeholder="Nombre para la nueva cuenta"
          className={utilityStyles.input}
        />
      </div>

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="createClaimedAccountOwnerKey">
          Clave Pública Owner (Nueva Cuenta):
        </label>
        <input
          id="createClaimedAccountOwnerKey"
          type="text"
          value={ownerKey}
          onChange={(e) => setOwnerKey(e.target.value)}
          placeholder="Clave Pública Owner (requerido)"
          className={utilityStyles.input}
        />
      </div>

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="createClaimedAccountActiveKey">
          Clave Pública Active (Nueva Cuenta):
        </label>
        <input
          id="createClaimedAccountActiveKey"
          type="text"
          value={activeKey}
          onChange={(e) => setActiveKey(e.target.value)}
          placeholder="Clave Pública Active (requerido)"
          className={utilityStyles.input}
        />
      </div>

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="createClaimedAccountPostingKey">
          Clave Pública Posting (Nueva Cuenta):
        </label>
        <input
          id="createClaimedAccountPostingKey"
          type="text"
          value={postingKey}
          onChange={(e) => setPostingKey(e.target.value)}
          placeholder="Clave Pública Posting (requerido)"
          className={utilityStyles.input}
        />
      </div>

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="createClaimedAccountMemoKey">
          Clave Pública Memo (Nueva Cuenta):
        </label>
        <input
          id="createClaimedAccountMemoKey"
          type="text"
          value={memoKey}
          onChange={(e) => setMemoKey(e.target.value)}
          placeholder="Clave Pública Memo (opcional)"
          className={utilityStyles.input}
        />
      </div>

      {/* Botón para ejecutar */}
      <button
        onClick={handleRequest}
        disabled={isButtonDisabled}
        className={utilityStyles.button}
      >
        Ejecutar Create Claimed Account
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

export default CreateClaimedAccountTest;
