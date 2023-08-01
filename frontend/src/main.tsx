import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import env from "dotenv";

import "./styles/Styles.scss";

env.config();
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
