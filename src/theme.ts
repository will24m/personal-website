import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#f5f7fa" },
    secondary: { main: "#9aa3af" },
    background: { default: "transparent", paper: "rgba(18,20,25,0.78)" },
    text: { primary: "#f3f5f7", secondary: "#a5adb8" },
  },
  shape: { borderRadius: 24 },
  typography: {
    fontFamily: '"Sora", sans-serif',
    h1: { fontFamily: '"Fraunces", serif', fontWeight: 700 },
    h2: { fontFamily: '"Fraunces", serif', fontWeight: 700 },
    h3: { fontFamily: '"Fraunces", serif', fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: "none",
          fontWeight: 600,
          paddingInline: 20,
          minHeight: 52,
        },
        containedPrimary: {
          color: "#0c0d10",
          background: "linear-gradient(135deg, #f5f7fa, #cdd3db)",
          boxShadow: "0 14px 30px rgba(0, 0, 0, 0.24)",
        },
        outlined: {
          borderColor: "rgba(255,255,255,0.14)",
          color: "#f3f5f7",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(18,20,25,0.78)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.34)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(18,20,25,0.78)",
          borderColor: "rgba(255,255,255,0.08)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
          backgroundColor: "rgba(255,255,255,0.05)",
          color: "#f3f5f7",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: 999,
          background: "linear-gradient(90deg, #f5f7fa, rgba(255,255,255,0.35))",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: "#8f98a5",
          textTransform: "none",
          "&.Mui-selected": { color: "#f3f5f7" },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            background: "rgba(255,255,255,0.04)",
            borderRadius: 20,
          },
        },
      },
    },
  },
});
