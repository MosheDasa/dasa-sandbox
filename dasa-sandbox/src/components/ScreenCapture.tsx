import React, { useState } from "react";

interface ScreenCaptureProps {
  onLog: (message: string, type: "info" | "error" | "success") => void;
}

const demoAreaStyle = {
  minHeight: "400px",
};

const ScreenCapture: React.FC<ScreenCaptureProps> = ({ onLog }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleScreenShare = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      setStream(mediaStream);
      onLog("Screen share started successfully", "success");
    } catch (err) {
      onLog(`Error accessing screen: ${err}`, "error");
    }
  };

  const stopScreenShare = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      onLog("Screen share stopped", "info");
    }
  };

  return (
    <div style={demoAreaStyle}>
      <h2>Screen Capture Demo</h2>
      <p>Click the button below to start/stop screen sharing.</p>

      <button
        onClick={stream ? stopScreenShare : handleScreenShare}
        style={{
          background: stream ? "#ef5350" : "#1976d2",
          color: "white",
          border: "none",
          padding: "12px 24px",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "1rem",
          transition: "background 0.2s",
          marginBottom: "1rem",
        }}
      >
        {stream ? "Stop Screen Share" : "Start Screen Share"}
      </button>

      {stream && (
        <div
          style={{
            background: "#f5f5f5",
            padding: "1rem",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <video
            autoPlay
            ref={(video) => {
              if (video) {
                video.srcObject = stream;
              }
            }}
            style={{
              width: "100%",
              borderRadius: "4px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ScreenCapture;
