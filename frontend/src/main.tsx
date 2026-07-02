import { BrowserRouter } from "react-router";
import { createRoot } from "react-dom/client";
import ThemeProvider from "./providers/ThemeProvider";
import "./libs/i18n"; // i18n init
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </BrowserRouter>,
);
