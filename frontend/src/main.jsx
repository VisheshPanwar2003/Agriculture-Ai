import React from "react";

import ReactDOM from "react-dom/client";

import App from "./App";
import AppErrorBoundary from "./components/AppErrorBoundary";

import "./index.css";

import {
  BrowserRouter,
} from "react-router-dom";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppErrorBoundary>
  </React.StrictMode>
);
