import React, { useState } from "react";
import ScreenCapture from "./ScreenCapture";

interface Log {
  message: string;
  type: "info" | "error" | "success";
  timestamp: Date;
}

const DEMOS = [
  { id: "screen-capture", title: "Screen Capture", component: ScreenCapture },
] as const;

const containerStyle = {
  padding: "2rem",
  maxWidth: "1200px",
  margin: "0 auto",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const headerStyle = {
  marginBottom: "2rem",
};

const titleStyle = {
  fontSize: "2rem",
  color: "#1a1a1a",
  margin: "0",
  marginBottom: "0.5rem",
};

const descriptionStyle = {
  color: "#666",
  fontSize: "1.1rem",
};

const tabListStyle = {
  display: "flex",
  gap: "0.5rem",
  borderBottom: "1px solid #e0e0e0",
  marginBottom: "2rem",
  padding: "0",
  listStyle: "none",
};

const tabStyle = (isActive: boolean) => ({
  padding: "0.75rem 1.5rem",
  border: "none",
  background: "none",
  cursor: "pointer",
  fontSize: "1rem",
  color: isActive ? "#1976d2" : "#666",
  borderBottom: `2px solid ${isActive ? "#1976d2" : "transparent"}`,
  transition: "all 0.2s",
});

const contentContainerStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 300px",
  gap: "2rem",
  background: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  padding: "2rem",
};

const logsAreaStyle = {
  background: "#1a1a1a",
  color: "#fff",
  padding: "1rem",
  borderRadius: "6px",
  fontFamily: "monospace",
  fontSize: "0.9rem",
  overflowY: "auto" as const,
  maxHeight: "400px",
};

const TabsContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState(DEMOS[0].id);
  const [logs, setLogs] = useState<Log[]>([]);

  const handleLog = (message: string, type: Log["type"]) => {
    setLogs((prev) => [...prev, { message, type, timestamp: new Date() }]);
  };

  const ActiveComponent = DEMOS.find(
    (demo) => demo.id === activeTab
  )?.component;

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>Dasa Sandbox</h1>
        <p style={descriptionStyle}>
          A collection of POC demos for quick testing and experimentation
        </p>
      </header>

      <ul style={tabListStyle}>
        {DEMOS.map((demo) => (
          <li key={demo.id}>
            <button
              style={tabStyle(activeTab === demo.id)}
              onClick={() => setActiveTab(demo.id)}
            >
              {demo.title}
            </button>
          </li>
        ))}
      </ul>

      <div style={contentContainerStyle}>
        {ActiveComponent && <ActiveComponent onLog={handleLog} />}

        <div style={logsAreaStyle}>
          <h3 style={{ margin: "0 0 1rem", color: "#fff" }}>Logs</h3>
          {logs.map((log, index) => (
            <div
              key={index}
              style={{
                margin: "0.5rem 0",
                padding: "0.5rem",
                borderRadius: "4px",
                background: "rgba(255,255,255,0.05)",
              }}
            >
              <span
                style={{
                  color: "#888",
                  fontSize: "0.8rem",
                  marginRight: "0.5rem",
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
                }}
              >
                {log.message}
              </span>
            </div>
          ))}
          {logs.length === 0 && (
            <div style={{ color: "#666", fontStyle: "italic" }}>
              No logs yet...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabsContainer;
