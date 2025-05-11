import React, { useState } from "react";
import { PocComponentProps } from "../../types/common";
import { theme } from "../../styles/theme";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    gap: theme.spacing.xl,
    height: "100%",
    overflow: "hidden",
  },
  controls: {
    display: "flex",
    gap: theme.spacing.md,
    alignItems: "center",
    flexShrink: 0,
  },
  button: (isStreaming: boolean) => ({
    background: isStreaming
      ? theme.colors.error.main
      : theme.colors.primary.main,
    color: theme.colors.primary.contrastText,
    border: "none",
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    borderRadius: theme.borderRadius.md,
    cursor: "pointer",
    ...theme.typography.body,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.sm,
    transition: "all 0.2s ease",
    "&:hover": {
      background: isStreaming
        ? theme.colors.error.dark
        : theme.colors.primary.dark,
      transform: "translateY(-1px)",
    },
    "&:active": {
      transform: "translateY(0)",
    },
  }),
  status: (isStreaming: boolean) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.sm,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    background: isStreaming
      ? theme.colors.success.main + "20"
      : theme.colors.background.elevated,
    color: isStreaming
      ? theme.colors.success.light
      : theme.colors.text.secondary,
    borderRadius: theme.borderRadius.full,
    fontSize: theme.typography.small.fontSize,
  }),
  statusDot: (isStreaming: boolean) => ({
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: isStreaming
      ? theme.colors.success.main
      : theme.colors.text.muted,
    boxShadow: isStreaming ? `0 0 8px ${theme.colors.success.main}` : "none",
  }),
  previewContainer: {
    flex: 1,
    minHeight: 0,
    background: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: `1px solid ${theme.colors.border.default}`,
  },
  emptyPreview: {
    color: theme.colors.text.muted,
    textAlign: "center" as const,
    padding: theme.spacing["2xl"],
    maxWidth: "400px",
  },
  emptyTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  emptyDescription: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "contain" as const,
  },
};

const ScreenCapture: React.FC<PocComponentProps> = ({ onLog }) => {
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
    <div style={styles.container}>
      <div style={styles.controls}>
        <button
          onClick={stream ? stopScreenShare : handleScreenShare}
          style={styles.button(!!stream)}
        >
          {stream ? "Stop Sharing" : "Share Screen"}
        </button>
        <div style={styles.status(!!stream)}>
          <div style={styles.statusDot(!!stream)} />
          {stream ? "Streaming" : "Ready to stream"}
        </div>
      </div>

      <div style={styles.previewContainer}>
        {stream ? (
          <video
            autoPlay
            ref={(video) => {
              if (video) {
                video.srcObject = stream;
              }
            }}
            style={styles.video}
          />
        ) : (
          <div style={styles.emptyPreview}>
            <h3 style={styles.emptyTitle}>No Preview Available</h3>
            <p style={styles.emptyDescription}>
              Click the "Share Screen" button above to start capturing your
              screen content. You can share your entire screen, a specific
              window, or a browser tab.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreenCapture;
