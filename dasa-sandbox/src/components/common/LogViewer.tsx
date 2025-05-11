import React from "react";
import { Log } from "../../types/common";
import { theme } from "../../styles/theme";

interface LogViewerProps {
  logs: Log[];
  onClear: () => void;
}

const styles = {
  container: {
    background: theme.colors.background.code,
    color: theme.colors.text.code,
    borderRadius: theme.borderRadius.lg,
    fontFamily: theme.typography.fontFamily.mono,
    fontSize: theme.typography.code.fontSize,
    display: "flex",
    flexDirection: "column" as const,
    height: "100%",
    overflow: "hidden",
  },
  header: {
    padding: theme.spacing.lg,
    borderBottom: `1px solid ${theme.colors.border.default}`,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.md,
    flexShrink: 0,
  },
  title: {
    ...theme.typography.h3,
    margin: 0,
    color: theme.colors.text.primary,
  },
  badge: {
    background: theme.colors.background.elevated,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.full,
    fontSize: theme.typography.small.fontSize,
    color: theme.colors.text.secondary,
  },
  clearButton: {
    marginLeft: "auto",
    background: "none",
    border: `1px solid ${theme.colors.border.default}`,
    color: theme.colors.text.secondary,
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.sm,
    cursor: "pointer",
    fontSize: theme.typography.small.fontSize,
    transition: "all 0.2s ease",
    "&:hover": {
      background: theme.colors.background.elevated,
      color: theme.colors.text.primary,
    },
  },
  logsContainer: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto" as const,
    padding: theme.spacing.lg,
    display: "flex",
    flexDirection: "column-reverse" as const,
    gap: theme.spacing.sm,
  },
  logEntry: {
    display: "flex",
    alignItems: "flex-start",
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    background: theme.colors.background.paper,
    borderRadius: theme.borderRadius.sm,
    border: `1px solid ${theme.colors.border.light}`,
  },
  logIcon: (type: Log["type"]) => ({
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    marginTop: "0.5rem",
    background:
      type === "info"
        ? theme.colors.primary.main
        : type === "error"
        ? theme.colors.error.main
        : theme.colors.success.main,
    boxShadow:
      type === "info"
        ? `0 0 8px ${theme.colors.primary.main}`
        : type === "error"
        ? `0 0 8px ${theme.colors.error.main}`
        : `0 0 8px ${theme.colors.success.main}`,
  }),
  timestamp: {
    color: theme.colors.text.muted,
    fontSize: theme.typography.small.fontSize,
    whiteSpace: "nowrap" as const,
  },
  message: (type: Log["type"]) => ({
    flex: 1,
    color:
      type === "info"
        ? theme.colors.primary.light
        : type === "error"
        ? theme.colors.error.light
        : theme.colors.success.light,
  }),
  emptyState: {
    padding: theme.spacing["2xl"],
    textAlign: "center" as const,
    color: theme.colors.text.muted,
    fontStyle: "italic",
  },
};

const LogViewer: React.FC<LogViewerProps> = ({ logs, onClear }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Logs</h3>
        <span style={styles.badge}>{logs.length} entries</span>
        <button style={styles.clearButton} onClick={onClear}>
          Clear
        </button>
      </div>

      <div style={styles.logsContainer}>
        {logs.map((log, index) => (
          <div key={index} style={styles.logEntry}>
            <div style={styles.logIcon(log.type)} />
            <span style={styles.timestamp}>
              {log.timestamp.toLocaleTimeString()}
            </span>
            <span style={styles.message(log.type)}>{log.message}</span>
          </div>
        ))}
        {logs.length === 0 && (
          <div style={styles.emptyState}>No logs yet...</div>
        )}
      </div>
    </div>
  );
};

export default LogViewer;
