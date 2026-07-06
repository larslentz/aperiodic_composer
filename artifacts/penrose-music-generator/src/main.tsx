import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Force dark mode for the lab console aesthetic
document.documentElement.classList.add("dark");

createRoot(document.getElementById("root")!).render(<App />);
