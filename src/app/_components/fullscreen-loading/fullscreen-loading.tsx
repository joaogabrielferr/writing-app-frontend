'use client'

import React from "react";
import styles from "./fullscreen-loading.module.css";

type FullscreenLoaderProps = {
  text?: string;
};

export const FullscreenLoader: React.FC<FullscreenLoaderProps> = ({ text = "Loading..." }) => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.text}>{text}</div>
      <div className={styles.spinner} />
    </div>
  );
};