export const theme = {
  colors: {
    primary: {
      main: "#0EA5E9",
      light: "#38BDF8",
      dark: "#0284C7",
      contrastText: "#ffffff",
    },
    error: {
      main: "#F43F5E",
      light: "#FB7185",
      dark: "#E11D48",
      contrastText: "#ffffff",
    },
    success: {
      main: "#10B981",
      light: "#34D399",
      dark: "#059669",
      contrastText: "#ffffff",
    },
    background: {
      default: "#0F172A",
      paper: "#1E293B",
      elevated: "#334155",
      code: "#1E1E1E",
    },
    text: {
      primary: "#F8FAFC",
      secondary: "#94A3B8",
      muted: "#64748B",
      code: "#E2E8F0",
    },
    border: {
      light: "rgba(148, 163, 184, 0.1)",
      default: "rgba(148, 163, 184, 0.2)",
    },
  },
  spacing: {
    "2xs": "0.125rem",
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "2.5rem",
    "3xl": "3rem",
  },
  borderRadius: {
    xs: "0.25rem",
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    highlight: "0 0 0 2px rgba(14, 165, 233, 0.3)",
    glow: "0 0 15px rgba(14, 165, 233, 0.3)",
  },
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    },
    h1: {
      fontSize: "1.875rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body: {
      fontSize: "0.9375rem",
      lineHeight: 1.5,
    },
    small: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    code: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      fontFamily:
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    },
  },
} as const;
