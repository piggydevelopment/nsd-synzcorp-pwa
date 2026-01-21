import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { StyledEngineProvider } from "@mui/material";
import { getAppBasename } from "./utils/org-helper";

console.warn = () => {};
const root = ReactDOM.createRoot(document.getElementById("root"));
const basename = getAppBasename();

root.render(
  <BrowserRouter basename={basename}>
    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>
  </BrowserRouter>,
);
reportWebVitals();
