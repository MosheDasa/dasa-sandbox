import React, { useState } from "react";
import styles from "../base/button.module.css";

const ScreenShareComponent: React.FC = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleScreenShare = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      setStream(mediaStream);
      console.log("Screen share started:", mediaStream);
    } catch (err) {
      console.error("Error accessing screen:", err);
    }
  };

  const stopScreenShare = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      console.log("Screen share stopped");
    }
  };

  return (
    <div>
      <button
        className={styles?.button || "button"}
        onClick={stream ? stopScreenShare : handleScreenShare}
      >
        {stream ? "Stop Screen Share" : "Start Screen Share"}
      </button>
      {stream && (
        <video
          autoPlay
          ref={(video) => {
            if (video) {
              video.srcObject = stream;
            }
          }}
          style={{ maxWidth: "100%", marginTop: "1rem" }}
        />
      )}
    </div>
  );
};

export default ScreenShareComponent;
