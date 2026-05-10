import React from "react";
import * as styles from "./section-divider.module.css";

export const SectionDivider = ({ isTop }) => {
  const classNames = [styles.scallop];
  if (isTop) classNames.push(styles.top);

  return (
    <div className={classNames.join(" ")}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ display: "block", width: "calc(100% + 1.3px)", maxWidth: "none", height: "70px" }}
      >
        <path
          d="M0,120 V102 C500,82 800,108 1200,92 V120 Z"
          className={styles.shapeFill}
        />
      </svg>
    </div>
  );
};
