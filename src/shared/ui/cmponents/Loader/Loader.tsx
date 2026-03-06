import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import styles from "./Loader.module.css";
import animationData from "../../../../assets/paws_animation.lottie?url";

interface LoaderProps {
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ text = "Loading fun..." }) => {
  return (
    <div className={styles.loaderContainer}>
      <div style={{ width: "300px", height: "300px" }}>
        <DotLottieReact src={animationData} loop autoplay />
      </div>
      <p className={styles.loaderText}>{text}</p>
    </div>
  );
};
