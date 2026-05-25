import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { useAuthStore } from "./store/authStore";
import "./styles/global.css";

useAuthStore.getState().initAuth();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
