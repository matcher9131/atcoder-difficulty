import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./features/i18n/config.ts";

const root = document.getElementById("root");
if (root == null) throw new Error("'root' is not found.");
createRoot(root).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
