import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { AuthProvider } from "react-auth-kit";

ReactDOM.render(
  <React.StrictMode>
    <DarkModeContextProvider>
      <AuthProvider
        authType={"cookie"}
        authName={"_auth"}
        cookieDomain={window.location.hostname}
        cookieSecure={false}
      >
        <App />
      </AuthProvider> 
    </DarkModeContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
