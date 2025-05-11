import React from "react";

interface Log {
  message: string;
  type: "info" | "error" | "success";
  timestamp: Date;
}

interface LogViewerProps {
  logs: Log[];
}

const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
  return (
    <div
      style={{
        background: "#1a1a1a",
        color: "#fff",
        padding: "1rem",
        borderRadius: "6px",
        fontFamily: "monospace",
        fontSize: "0.9rem",
        overflowY: "auto" as const,
        height: "calc(100vh - 300px)",
        width: "100%",
        position: "sticky" as const,
        top: "2rem",
      }}
    >
      <h3
        style={{
          margin: "0 0 1rem",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span>System Logs</span>
        <span
          style={{
            background: "#2d2d2d",
            padding: "2px 8px",
            borderRadius: "12px",
            fontSize: "0.8rem",
            color: "#888",
          }}
        >
          {logs.length} entries
        </span>
      </h3>

      <div
        style={{ display: "flex", flexDirection: "column-reverse" as const }}
      >
        {logs.map((log, index) => (
          <div
            key={index}
            style={{
              margin: "0.25rem 0",
              padding: "0.5rem",
              borderRadius: "4px",
              background: "rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                color: "#888",
                fontSize: "0.8rem",
                whiteSpace: "nowrap",
              }}
            >
              {log.timestamp.toLocaleTimeString()}
            </span>
            <span
              style={{
                color:
                  log.type === "info"
                    ? "#64b5f6"
                    : log.type === "error"
                    ? "#ef5350"
                    : "#81c784",
                flex: 1,
              }}
            >
              {log.message}
            </span>
          </div>
        ))}
        {logs.length === 0 && (
          <div
            style={{
              color: "#666",
              fontStyle: "italic",
              textAlign: "center",
              padding: "2rem",
            }}
          >
            No logs yet...
          </div>
        )}
      </div>
    </div>
  );
};

export default LogViewer;
