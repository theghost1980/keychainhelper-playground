import { KeychainHelper } from "keychain-helper";
import React, { useState } from "react";
import utilityStyles from "../../styles/utility.module.css";
import Accordion from "../Acordion";
import styles from "./RequestTest.module.css";

interface AddAccountAuthorityTestProps {
  isKeychainInstalled: boolean | null;
}

const AddAccountAuthorityTest: React.FC<AddAccountAuthorityTestProps> = ({
  isKeychainInstalled,
}) => {
  const [response, setResponse] = useState<any>(null);
  const [copyButtonText, setCopyButtonText] = useState("Copiar Código");
  const [isCodeOpen, setIsCodeOpen] = useState(false);

  const [account, setAccount] = useState("");
  const [authorizedUsername, setAuthorizedUsername] = useState("");
  const [role, setRole] = useState("Posting");
  const [weight, setWeight] = useState("1");

  const weightNum = parseInt(weight, 10);
  const isButtonDisabled =
    !isKeychainInstalled ||
    !account ||
    !authorizedUsername ||
    !role ||
    isNaN(weightNum);

  const handleRequest = () => {
    if (
      !isKeychainInstalled ||
      !account ||
      !authorizedUsername ||
      !role ||
      isNaN(weightNum)
    ) {
      console.warn(
        "Missing required fields, invalid weight, or Keychain not installed."
      );
      setResponse({
        success: false,
        message:
          "Missing required fields, invalid weight, or Keychain not installed.",
      });
      return;
    }

    KeychainHelper.requestAddAccountAuthority(
      account,
      authorizedUsername,
      role as "Posting" | "Active" | "Memo",
      weightNum,
      (response: any) => {
        console.log("requestAddAccountAuthority Response:", response);
        if (response.success) {
          console.log("Add Account Authority Success:", response.result);
        } else {
          console.error(
            "Add Account Authority Failed:",
            response.message || response.error || "Unknown error"
          );
        }
        setResponse(response);
      }
    );
  };

  const codeSnippet = `import { KeychainHelper } from 'keychain-helper';

// ... state variables: account, authorizedUsername, role, weight, response, isKeychainInstalled
// ... assuming a state setter like setResponse exists

const handleAddAccountAuthority = () => {
  const weightNum = parseInt(weight, 10);

  if (!isKeychainInstalled || !account || !authorizedUsername || !role || isNaN(weightNum)) {
      console.warn("Missing required fields, invalid weight, or Keychain not installed.");
      // Handle error
      return;
  }

  KeychainHelper.requestAddAccountAuthority(
    account,
    authorizedUsername,
    role, // 'Posting' | 'Active' | 'Memo'
    weightNum, // Authority weight (number)
    (response) => { // <-- CALLBACK
      console.log("requestAddAccountAuthority Response:", response);

      if (response.success) {
         console.log("Add Account Authority Success:", response.result);
      } else {
         console.error("Add Account Authority Failed:", response.message || response.error || 'Unknown error');
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
        Solicita otorgar autoridad de cuenta a otro usuario (Multisig). Requiere
        clave Active de la cuenta que otorga autoridad.
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
        <label htmlFor="addAuthAccount">Cuenta que Otorga Autoridad:</label>
        <input
          id="addAuthAccount"
          type="text"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          placeholder="Tu cuenta Hive"
          className={utilityStyles.input}
        />
      </div>

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="addAuthAuthorizedUsername">
          Cuenta que Recibe Autoridad:
        </label>
        <input
          id="addAuthAuthorizedUsername"
          type="text"
          value={authorizedUsername}
          onChange={(e) => setAuthorizedUsername(e.target.value)}
          placeholder="Cuenta que tendrá autoridad"
          className={utilityStyles.input}
        />
      </div>

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="addAuthRole">Rol de Autoridad:</label>
        <select
          id="addAuthRole"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={utilityStyles.input}
        >
          <option value="Posting">Posting</option>
          <option value="Active">Active</option>
          <option value="Memo">Memo</option>
        </select>
      </div>

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="addAuthWeight">Peso (Weight):</label>
        <input
          id="addAuthWeight"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Peso (ej: 1 o 2)"
          className={utilityStyles.input}
          min="0"
        />
      </div>

      <button
        onClick={handleRequest}
        disabled={isButtonDisabled}
        className={utilityStyles.button}
      >
        Ejecutar Add Account Authority
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

export default AddAccountAuthorityTest;
