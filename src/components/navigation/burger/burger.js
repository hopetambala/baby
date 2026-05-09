import React from "react";
import * as styles from "./burger.module.css";

export const Burger = ({ setOpen }) => {
  const classNames = [`burger ${styles.burger}`];
  return (
    <button className={classNames.join(" ")} onClick={setOpen}>
      <div />
      <div />
      <div />
    </button>
  );
};
