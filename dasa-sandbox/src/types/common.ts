export type LogType = "info" | "error" | "success";

export interface Log {
  message: string;
  type: LogType;
  timestamp: Date;
}

export interface PocComponentProps {
  onLog: (message: string, type: LogType) => void;
}
