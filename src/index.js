import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { StyledEngineProvider } from "@mui/material";
import { getAppBasename } from "./utils/org-helper";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    // Check if there is a waiting service worker
    const waitingServiceWorker = registration.waiting;

    if (waitingServiceWorker) {
      // Send the SKIP_WAITING message to the waiting service worker
      waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });

      // Add a listener to reload the page when the new service worker takes control
      waitingServiceWorker.addEventListener("statechange", (event) => {
        if (event.target.state === "activated") {
          window.location.reload();
        }
      });
    }
  },
});

reportWebVitals();
