import React, { useState } from "react";
import ScreenCapture from "../pocs/screen-capture/ScreenCapture";
import AITools from "../pocs/ai-tools/AITools";
import LogViewer from "../components/common/LogViewer";
import { Log, LogType } from "../types/common";
import { theme } from "../styles/theme";

const DEMOS = [
  { id: "ai-tools", title: "AI Tools", component: AITools },
  { id: "screen-capture", title: "Screen Capture", component: ScreenCapture },
] as const;

type DemoId = (typeof DEMOS)[number]["id"];

const styles = {
  container: {
    height: "100vh",
    width: "100%",
    margin: "0",
    fontFamily: theme.typography.fontFamily.sans,
    background: theme.colors.background.default,
    color: theme.colors.text.primary,
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
  },
  tabList: {
    background: theme.colors.background.paper,
    borderBottom: `1px solid ${theme.colors.border.default}`,
    margin: 0,
    padding: 0,
    listStyle: "none",
    flexShrink: 0,
  },
  tabListContent: {
    maxWidth: "1800px",
    margin: "0 auto",
    display: "flex",
    gap: theme.spacing.md,
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
  },
  tab: (isActive: boolean) => ({
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    background: "none",
    border: "none",
    borderBottom: `2px solid ${
      isActive ? theme.colors.primary.main : "transparent"
    }`,
    color: isActive ? theme.colors.primary.main : theme.colors.text.secondary,
    cursor: "pointer",
    ...theme.typography.body,
    fontWeight: isActive ? 600 : 400,
    transition: "all 0.2s ease",
    "&:hover": {
      color: theme.colors.primary.light,
    },
  }),
  main: {
    flex: 1,
    minHeight: 0,
    padding: theme.spacing.xl,
    overflow: "hidden",
  },
  mainContent: {
    height: "100%",
    maxWidth: "1800px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 320px",
    gap: theme.spacing.xl,
  },
  demoArea: {
    background: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column" as const,
    minHeight: 0,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderBottom: `1px solid ${theme.colors.border.default}`,
    flexShrink: 0,
  },
  toolbarTitle: {
    ...theme.typography.h3,
    margin: 0,
    color: theme.colors.text.primary,
  },
  demoContent: {
    flex: 1,
    minHeight: 0,
    padding: theme.spacing.xl,
    overflow: "auto",
    display: "flex",
    flexDirection: "column" as const,
  },
};

const TabsContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DemoId>(DEMOS[0].id);
  const [logs, setLogs] = useState<Log[]>([]);

  const handleLog = (message: string, type: LogType) => {
    setLogs((prev) => [...prev, { message, type, timestamp: new Date() }]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const ActiveComponent = DEMOS.find(
    (demo) => demo.id === activeTab
  )?.component;

  const activeDemo = DEMOS.find((demo) => demo.id === activeTab);

  return (
    <div style={styles.container}>
      <nav style={styles.tabList}>
        <div style={styles.tabListContent}>
          {DEMOS.map((demo) => (
            <button
              key={demo.id}
              style={styles.tab(activeTab === demo.id)}
              onClick={() => setActiveTab(demo.id)}
            >
              {demo.title}
            </button>
          ))}
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.mainContent}>
          <div style={styles.demoArea}>
            <div style={styles.toolbar}>
              <h2 style={styles.toolbarTitle}>{activeDemo?.title || "Demo"}</h2>
            </div>
            <div style={styles.demoContent}>
              {ActiveComponent && <ActiveComponent onLog={handleLog} />}
            </div>
          </div>
          <LogViewer logs={logs} onClear={handleClearLogs} />
        </div>
      </main>
    </div>
  );
};

export default TabsContainer;
