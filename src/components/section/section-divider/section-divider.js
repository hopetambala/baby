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
      >
        <path
          d="M0,120 L0,90 A75,50 0 0,0 150,90 A75,50 0 0,0 300,90 A75,50 0 0,0 450,90 A75,50 0 0,0 600,90 A75,50 0 0,0 750,90 A75,50 0 0,0 900,90 A75,50 0 0,0 1050,90 A75,50 0 0,0 1200,90 L1200,120 Z"
          className={styles.shapeFill}
        />
      </svg>
    </div>
  );
};
