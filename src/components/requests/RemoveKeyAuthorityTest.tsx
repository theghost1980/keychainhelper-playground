import { KeychainHelper } from "keychain-helper";
import React, { useState } from "react";
import utilityStyles from "../../styles/utility.module.css";
import Accordion from "../Acordion";
import styles from "./RequestTest.module.css";

interface RemoveKeyAuthorityTestProps {
  isKeychainInstalled: boolean | null;
}

const RemoveKeyAuthorityTest: React.FC<RemoveKeyAuthorityTestProps> = ({
  isKeychainInstalled,
}) => {
  const [response, setResponse] = useState<any>(null);
  const [copyButtonText, setCopyButtonText] = useState("Copiar Código");
  const [isCodeOpen, setIsCodeOpen] = useState(false);

  const [account, setAccount] = useState("");
  const [authorizedKey, setAuthorizedKey] = useState("");
  const [role, setRole] = useState("Posting");

  const isButtonDisabled =
    !isKeychainInstalled || !account || !authorizedKey || !role;

  const handleRequest = () => {
    if (!isKeychainInstalled || !account || !authorizedKey || !role) {
      console.warn("Missing required fields or Keychain not installed.");
      setResponse({
        success: false,
        message: "Missing required fields or Keychain not installed.",
      });
      return;
    }

    KeychainHelper.requestRemoveKeyAuthority(
      account,
      authorizedKey,
      role as "Posting" | "Active" | "Memo",
      (response: any) => {
        console.log("requestRemoveKeyAuthority Response:", response);
        if (response.success) {
          console.log("Remove Key Authority Success:", response.result);
        } else {
          console.error(
            "Remove Key Authority Failed:",
            response.message || response.error || "Unknown error"
          );
        }
        setResponse(response);
      }
    );
  };

  const codeSnippet = `import { KeychainHelper } from 'keychain-helper';

// ... state variables: account, authorizedKey, role, response, isKeychainInstalled
// ... assuming a state setter like setResponse exists

const handleRemoveKeyAuthority = () => {
  if (!isKeychainInstalled || !account || !authorizedKey || !role) {
      console.warn("Missing required fields or Keychain not installed.");
      // Handle error
      return;
  }

  KeychainHelper.requestRemoveKeyAuthority(
    account,       // Account modifying authority
    authorizedKey, // Public key to remove
    role,          // 'Posting' | 'Active' | 'Memo'
    (response) => { // <-- CALLBACK
      console.log("requestRemoveKeyAuthority Response:", response);

      if (response.success) {
         console.log("Remove Key Authority Success:", response.result);
      } else {
         console.error("Remove Key Authority Failed:", response.message || response.error || 'Unknown error');
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
        Solicita remover una clave pública de las autoridades de una cuenta.
        Requiere clave Active de la cuenta que modifica la autoridad.
      </p>

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
        <label htmlFor="removeKeyAuthAccount">
          Cuenta que Modifica Autoridad:
        </label>
        <input
          id="removeKeyAuthAccount"
          type="text"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          placeholder="Tu cuenta Hive"
          className={utilityStyles.input}
        />
      </div>

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="removeKeyAuthPublicKey">Clave Pública a Remover:</label>
        <input
          id="removeKeyAuthPublicKey"
          type="text"
          value={authorizedKey}
          onChange={(e) => setAuthorizedKey(e.target.value)}
          placeholder="Clave Pública (ej: STM...)"
          className={utilityStyles.input}
        />
      </div>

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="removeKeyAuthRole">Rol de Autoridad:</label>
        <select
          id="removeKeyAuthRole"
          value={role}
          onChange={(e) => setRole(e.target.value)}
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
        Ejecutar Remove Key Authority
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

export default RemoveKeyAuthorityTest;
