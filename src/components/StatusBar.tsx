// src/components/StatusBar.tsx
import React from "react";
import keychainLogo from "../assets/images/keychain-helper-logo.png";
import styles from "./StatusBar.module.css";
// import * as styles from "./StatusBar.module.css";

console.log({ styles });

interface StatusBarProps {
  isInstalled: boolean | null;
}

const StatusBar: React.FC<StatusBarProps> = ({ isInstalled }) => {
  let message = "Checking Hive Keychain installation...";
  let statusClass = styles.checking;

  if (isInstalled === true) {
    message = "Hive Keychain detected!";
    statusClass = styles.installed;
  } else if (isInstalled === false) {
    message = "Hive Keychain not detected.";
    statusClass = styles["not-installed"];
  }

  return (
    <div className={`${styles["status-bar"]} ${statusClass}`}>
      <img
        src={keychainLogo}
        alt="KeychainHelper Logo"
        className={styles["status-bar-logo"]}
      />
      <p className={styles["status-bar-p"]}>{message}</p>{" "}
    </div>
  );
};

export default StatusBar;
