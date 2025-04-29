import React from "react";
import keychainLogo from "../assets/images/keychain-helper-logo.png";
import AnimatedWrapper from "./AnimatedWrapper";
import styles from "./StatusBar.module.css";

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
    <AnimatedWrapper
      animationKey={`fade-${isInstalled}`}
      animationType={"zoom"}
    >
      <div className={`${styles["status-bar"]} ${statusClass}`}>
        <img
          src={keychainLogo}
          alt="KeychainHelper Logo"
          className={styles["status-bar-logo"]}
        />
        <p className={styles["status-bar-p"]}>{message}</p>{" "}
      </div>
    </AnimatedWrapper>
  );
};

export default StatusBar;
