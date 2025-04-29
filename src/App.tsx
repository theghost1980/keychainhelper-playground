import { KeychainHelperUtils } from "keychain-helper";
import React, { useEffect, useState } from "react";
import AnimatedWrapper from "./components/AnimatedWrapper";
import StatusBar from "./components/StatusBar";
import WelcomeSection from "./components/WelcomeSection";
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
import "./styles/base.css";
import utilityStyles from "./styles/utility.module.css";

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
];

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
};

const App: React.FC = () => {
  const [isInstalled, setIsInstalled] = useState<boolean | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );

  useEffect(() => {
    KeychainHelperUtils.isKeychainInstalled(window, (detected) => {
      setIsInstalled(detected);
      if (!detected) {
        console.warn("Hive Keychain Not Installed!");
      }
    });
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value === "" ? null : event.target.value;
    setSelectedRequestId(selectedId);
  };

  const renderContent = () => {
    const RequestComponent = selectedRequestId
      ? requestComponentMap[selectedRequestId]
      : null;

    return (
      <AnimatedWrapper
        animationKey={selectedRequestId || "welcome"}
        animationType={"fade"}
      >
        {RequestComponent ? (
          <RequestComponent isKeychainInstalled={isInstalled} />
        ) : (
          <WelcomeSection />
        )}
      </AnimatedWrapper>
    );
  };

  return (
    <div className={utilityStyles["app-container-layout"]}>
      <div className={utilityStyles["app-top-container"]}>
        <StatusBar isInstalled={isInstalled} />
        <>
          <label htmlFor="request-selector">Selecciona una Request:</label>
          <select
            id="request-selector"
            className={utilityStyles["request-selector"]}
            value={selectedRequestId || ""}
            onChange={handleSelectChange}
          >
            <option value="">--- Selecciona una Request ---</option>

            {requestOptions.map((req) => (
              <option key={req.id} value={req.id}>
                {req.name}
              </option>
            ))}
          </select>
        </>
      </div>

      <div className={utilityStyles["app-content-container"]}>
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
