import { KeychainHelper } from "keychain-helper";
import React, { useState } from "react";
import utilityStyles from "../../styles/utility.module.css";
import Accordion from "../Acordion";
import styles from "./RequestTest.module.css";

interface CreateProposalTestProps {
  isKeychainInstalled: boolean | null;
}

const CreateProposalTest: React.FC<CreateProposalTestProps> = ({
  isKeychainInstalled,
}) => {
  const [response, setResponse] = useState<any>(null);
  const [copyButtonText, setCopyButtonText] = useState("Copiar Código");
  const [isCodeOpen, setIsCodeOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [receiver, setReceiver] = useState("");
  const [subject, setSubject] = useState("");
  const [permlink, setPermlink] = useState("");
  const [dailyPay, setDailyPay] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const isButtonDisabled =
    !isKeychainInstalled ||
    !username ||
    !receiver ||
    !subject ||
    !permlink ||
    !dailyPay ||
    isNaN(parseFloat(dailyPay)) ||
    !startDate ||
    !endDate;

  const handleRequest = () => {
    if (
      !isKeychainInstalled ||
      !username ||
      !receiver ||
      !subject ||
      !permlink ||
      !dailyPay ||
      isNaN(parseFloat(dailyPay)) ||
      !startDate ||
      !endDate
    ) {
      console.warn(
        "Missing required fields, invalid daily pay, or Keychain not installed."
      );
      setResponse({
        success: false,
        message:
          "Missing required fields, invalid daily pay, or Keychain not installed.",
      });
      return;
    }

    const dailyPayWith3Decimals = parseFloat(dailyPay).toFixed(3);
    const extensions = JSON.stringify([]);

    KeychainHelper.requestCreateProposal(
      username,
      receiver,
      subject,
      permlink,
      dailyPayWith3Decimals,
      startDate,
      endDate,
      extensions,
      (response: any) => {
        console.log("requestCreateProposal Response:", response);
        if (response.success) {
          console.log("Create Proposal Success:", response.result);
        } else {
          console.error(
            "Create Proposal Failed:",
            response.message || response.error || "Unknown error"
          );
        }
        setResponse(response);
      }
    );
  };

  const codeSnippet = `import { KeychainHelper } from 'keychain-helper';

// ... state variables: username, receiver, subject, permlink, dailyPay, startDate, endDate, response, isKeychainInstalled
// ... assuming a state setter like setResponse exists

const handleCreateProposal = () => {
  if (!isKeychainInstalled || !username || !receiver || !subject || !permlink || !dailyPay || isNaN(parseFloat(dailyPay)) || !startDate || !endDate) {
      console.warn("Missing required fields, invalid daily pay, or Keychain not installed.");
      // Handle error
      return;
  }

  const dailyPayWith3Decimals = parseFloat(dailyPay).toFixed(3);
  const extensions = JSON.stringify([]);

  KeychainHelper.requestCreateProposal(
    username,
    receiver,
    subject,
    permlink,
    dailyPayWith3Decimals,
    startDate,
    endDate,
    extensions,
    (response) => { // <-- CALLBACK
      console.log("requestCreateProposal Response:", response);

      if (response.success) {
         console.log("Create Proposal Success:", response.result);
      } else {
         console.error("Create Proposal Failed:", response.message || response.error || 'Unknown error');
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
        Solicita crear una propuesta para el Fondo Descentralizado de Hive
        (DHF).
      </p>

      <div
        className={utilityStyles["welcome-container"]}
        style={{
          borderColor: "#28a745",
          backgroundColor: "#d4edda",
          color: "#155724",
        }}
      >
        <h4 style={{ color: "#155724", marginTop: 0 }}>
          🌱 Sobre el DHF (Fondo Descentralizado de Hive)
        </h4>
        <p>
          El DHF es un fondo en Hive donde la comunidad puede proponer y votar
          por proyectos que desean que sean financiados con las recompensas de
          bloque. Crear una propuesta requiere la aprobación de tu cuenta
          activa.
        </p>
        <p>
          Puedes ver las propuestas existentes y votar en lugares como{" "}
          <a
            href="https://peakd.com/proposals"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#155724", textDecoration: "underline" }}
          >
            PeakD.com/proposals
          </a>
          .
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
        <label htmlFor="createPropUsername">Cuenta Creadora:</label>
        <input
          id="createPropUsername"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Tu cuenta Hive"
          className={utilityStyles.input}
        />
      </div>

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="createPropReceiver">Cuenta Receptora:</label>
        <input
          id="createPropReceiver"
          type="text"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          placeholder="Cuenta que recibirá fondos"
          className={utilityStyles.input}
        />
      </div>

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="createPropSubject">Título (Subject):</label>
        <input
          id="createPropSubject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Título de la propuesta"
          className={utilityStyles.input}
        />
      </div>

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="createPropPermlink">Permlink del Post:</label>
        <input
          id="createPropPermlink"
          type="text"
          value={permlink}
          onChange={(e) => setPermlink(e.target.value)}
          placeholder="Permlink del post de descripción"
          className={utilityStyles.input}
        />
      </div>

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="createPropDailyPay">Pago Diario (HBD):</label>
        <input
          id="createPropDailyPay"
          type="text"
          value={dailyPay}
          onChange={(e) => setDailyPay(e.target.value)}
          placeholder="Ej: 1.000 (3 decimales)"
          className={utilityStyles.input}
        />
      </div>

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="createPropStartDate">Fecha Inicio (YYYY-MM-DD):</label>
        <input
          id="createPropStartDate"
          type="text"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Ej: 2023-01-01"
          className={utilityStyles.input}
        />
      </div>

      <div className={utilityStyles.inputGroup}>
        <label htmlFor="createPropEndDate">Fecha Fin (YYYY-MM-DD):</label>
        <input
          id="createPropEndDate"
          type="text"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="Ej: 2023-12-31"
          className={utilityStyles.input}
        />
      </div>

      <button
        onClick={handleRequest}
        disabled={isButtonDisabled}
        className={utilityStyles.button}
      >
        Ejecutar Create Proposal
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

export default CreateProposalTest;
