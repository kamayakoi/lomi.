import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from "./Homepage.tsx";
import About from './pages/About.tsx'; // Ensure this matches the file name exactly
import { ThemeProvider } from "@/components/landing/theme-provider.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} /> {/* Add the new route */}
        </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);