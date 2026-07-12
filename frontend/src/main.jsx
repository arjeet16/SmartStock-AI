import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />

    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={10}
      toastOptions={{
        duration: 3000,
        style: {
          background: "#111827",
          color: "#ffffff",
          border: "1px solid rgba(99, 102, 241, 0.55)",
          borderRadius: "14px",
          padding: "14px 16px",
          fontSize: "14px",
          fontWeight: "600",
          boxShadow:
            "0 18px 40px rgba(15, 23, 42, 0.25)",
        },
        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        },
      }}
    />
  </React.StrictMode>
);