// src/App.tsx
import { KeychainHelperUtils } from "keychain-helper";
import React, { useEffect, useState } from "react";
import StatusBar from "./components/StatusBar";
import "./styles/base.css"; // Estilos base globales

// Módulo de utilidades para estilos de layout y componentes
import utilityStyles from "./styles/utility.module.css";

// Componente de sección de bienvenida
import WelcomeSection from "./components/WelcomeSection";

// --- Importa TODOS los componentes de cada request aquí ---
import AddAccountAuthorityTest from "./components/requests/AddAccountAuthorityTest";
import AddAccountTest from "./components/requests/AddAccountTest";
import BroadcastTest from "./components/requests/BroadcastTest";
import ConversionTest from "./components/requests/ConversionTest";
import CreateClaimedAccountTest from "./components/requests/CreateClaimedAccountTest";
import CreateProposalTest from "./components/requests/CreateProposalTest";
import EncodeMessageTest from "./components/requests/EncodeMessageTest";
import LoginTest from "./components/requests/LoginTest";
import RemoveKeyAuthorityTest from "./components/requests/RemoveKeyAuthorityTest";
import SignBufferTest from "./components/requests/SignBufferTest";
// import TransferTest from "./components/requests/TransferTest";
// import VoteTest from "./components/requests/VoteTest";
// import CustomJsonTest from "./components/requests/CustomJsonTest";

// --- Lista de requests para las opciones del selector ---
const requestOptions = [
  { id: "addAccount", name: "Add Account", component: AddAccountTest },
  {
    id: "addAccountAuthority",
    name: "Add Account Authority",
    component: AddAccountAuthorityTest,
  },
  {
    id: "removeKeyAuthority",
    name: "Remove Key Authority",
    component: RemoveKeyAuthorityTest,
  },
  { id: "signBuffer", name: "Sign Buffer" },
  { id: "encodeMessage", name: "Encode Message" },
  { id: "broadcast", name: "Broadcast", component: BroadcastTest },
  {
    id: "conversion",
    name: "Convert HIVE to HBD (3.5 days)",
    component: ConversionTest,
  },
  {
    id: "createClaimedAccount",
    name: "Create Claimed Account",
    component: CreateClaimedAccountTest,
  },
  {
    id: "createProposal",
    name: "Create Proposal (DHF)",
    component: CreateProposalTest,
  },
  {
    id: "login",
    name: "Login Utility(based on signBuffer)",
    component: LoginTest,
  },
  // { id: 'transfer', name: 'Transfer' },
  // { id: 'vote', name: 'Vote' },
  // { id: 'customJson', name: 'Custom JSON' },
  // ... añade otros objetos { id, name } aquí ...
];

// --- Mapeo de IDs de requests a sus componentes ---
// Esto permite renderizar el componente correcto basado en el ID seleccionado
const requestComponentMap: { [key: string]: React.FC<any> } = {
  addAccount: AddAccountTest,
  addAccountAuthority: AddAccountAuthorityTest,
  broadcast: BroadcastTest,
  conversion: ConversionTest,
  removeKeyAuthority: RemoveKeyAuthorityTest,
  signBuffer: SignBufferTest,
  encodeMessage: EncodeMessageTest,
  createClaimedAccount: CreateClaimedAccountTest,
  createProposal: CreateProposalTest,
  login: LoginTest,
  // 'transfer': TransferTest,
  // 'vote': VoteTest,
  // 'customJson': CustomJsonTest,
  // ... mapea otros IDs a sus componentes importados aquí ...
};

const App: React.FC = () => {
  const [isInstalled, setIsInstalled] = useState<boolean | null>(null);
  // Estado para saber el ID de la request seleccionada (o null si es la bienvenida)
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );

  useEffect(() => {
    // Verifica instalación de Keychain al montar
    KeychainHelperUtils.isKeychainInstalled(window, (detected) => {
      setIsInstalled(detected);
      if (!detected) {
        console.warn("Hive Keychain Not Installed!");
      }
    });
  }, []);

  // Manejador del cambio en el selector desplegable
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value === "" ? null : event.target.value; // '' desde la opción por defecto significa null
    setSelectedRequestId(selectedId);
  };

  // Decide qué contenido renderizar: WelcomeSection o el componente de Request
  const renderContent = () => {
    if (!selectedRequestId) {
      // Si no hay ID seleccionado, muestra la sección de bienvenida
      return <WelcomeSection />;
    }

    // Busca el componente en el mapeo usando el ID seleccionado
    const RequestComponent = requestComponentMap[selectedRequestId];

    if (!RequestComponent) {
      // Mensaje de seguridad si el ID no mapea a un componente
      return <p>Error: Request no encontrada.</p>;
    }

    // Renderiza el componente de la request seleccionada, pasando props necesarias
    return <RequestComponent isKeychainInstalled={isInstalled} />;
  };

  return (
    // Contenedor principal con estilos de layout del módulo de utilidades
    <div className={utilityStyles["app-container-layout"]}>
      <StatusBar isInstalled={isInstalled} />

      {/* Contenedor para el selector */}
      {/* Puedes estilizar este div o el label/select directamente en utilityStyles */}
      <div>
        <label htmlFor="request-selector">Selecciona una Request:</label>
        <select
          id="request-selector"
          className={utilityStyles["request-selector"]} // Aplica estilos al select
          value={selectedRequestId || ""} // Valor controlado, usa '' para null state
          onChange={handleSelectChange} // Maneja el cambio de selección
        >
          {/* Opción por defecto que resetea el estado a null */}
          <option value="">--- Selecciona una Request ---</option>

          {/* Mapea las opciones de requests a elementos <option> */}
          {requestOptions.map((req) => (
            <option key={req.id} value={req.id}>
              {req.name}
            </option>
          ))}
        </select>
      </div>

      {/* Área principal donde se renderiza la bienvenida o la request */}
      <div className={utilityStyles["app-content-container"]}>
        {renderContent()} {/* Llama a la función de renderizado condicional */}
      </div>
    </div> // Cierre del div de layout principal
  );
};

export default App;
