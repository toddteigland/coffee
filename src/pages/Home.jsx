import React from "react";

import styles from "../styles/home.module.css";
import video from "../media/ID6CWWYR2Q25BOQE.mp4";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.videoContainer}>
        <video controls width="100%" height="100%" autoPlay="true" muted="true">
          <source type="video/mp4" src={video} />
        </video>
      </div>
    </div>
  );
}
