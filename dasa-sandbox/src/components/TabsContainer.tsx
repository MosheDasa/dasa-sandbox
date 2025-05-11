import React, { useState } from "react";
import ScreenCapture from "./pocs/ScreenCapture";
import LogViewer from "./LogViewer";

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
  minHeight: "100vh",
  width: "100%",
  margin: "0",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  background: "#f5f7fa",
};

const headerStyle = {
  marginBottom: "2rem",
  padding: "0 2rem",
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
  padding: "0 2rem",
  listStyle: "none",
  background: "#fff",
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
  background: "#fff",
  padding: "2rem",
  minHeight: "calc(100vh - 300px)",
};

const mainContentStyle = {
  maxWidth: "1600px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "1fr 400px",
  gap: "2rem",
  alignItems: "start",
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
        <div style={mainContentStyle}>
          <div>{ActiveComponent && <ActiveComponent onLog={handleLog} />}</div>
          <LogViewer logs={logs} />
        </div>
      </div>
    </div>
  );
};

export default TabsContainer;
