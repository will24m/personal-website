import ReactDOM from "react-dom/client";
import { App } from "./App.js";
import "../styles/revamp.css";
import "../styles/dynamic-ui.css";

const rootElement = document.getElementById("app");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
}
