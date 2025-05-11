import React, { useState } from "react";

interface ScreenCaptureProps {
  onLog: (message: string, type: "info" | "error" | "success") => void;
}

const demoAreaStyle = {
  minHeight: "calc(100vh - 250px)",
  width: "100%",
  display: "flex",
  flexDirection: "column" as const,
  gap: "1rem",
};

const videoContainerStyle = {
  flex: 1,
  background: "#f5f5f5",
  padding: "1rem",
  borderRadius: "8px",
  overflow: "hidden",
  minHeight: "500px",
};

const buttonStyle = (isStreaming: boolean) => ({
  background: isStreaming ? "#ef5350" : "#1976d2",
  color: "white",
  border: "none",
  padding: "12px 24px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "1rem",
  transition: "background 0.2s",
  marginBottom: "1rem",
  alignSelf: "flex-start" as const,
});

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
      <div>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
          Screen Capture Demo
        </h2>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          Click the button below to start/stop screen sharing.
        </p>
      </div>

      <button
        onClick={stream ? stopScreenShare : handleScreenShare}
        style={buttonStyle(!!stream)}
      >
        {stream ? "Stop Screen Share" : "Start Screen Share"}
      </button>

      {stream && (
        <div style={videoContainerStyle}>
          <video
            autoPlay
            ref={(video) => {
              if (video) {
                video.srcObject = stream;
              }
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "4px",
              background: "#000",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ScreenCapture;
