'use client'

import React from "react";
import styles from "./fullscreen-loading.module.css";

type FullscreenLoaderProps = {
  text?: string;
};

export const FullscreenLoader: React.FC<FullscreenLoaderProps> = ({ text }) => {
  return (
    <div className={styles.loaderContainer}>
      {text ? <div className={styles.text}>{text}</div> : null}
      <div className={styles.spinner} />
    </div>
  );
};