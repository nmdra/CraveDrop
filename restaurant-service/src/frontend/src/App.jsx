import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MenuManagement from './pages/MenuManagement.jsx';
import ProfileSettings from "./pages/ProfileSettings.jsx";
import "./index.css";
import styles from "./App.module.css";

const App = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <Router>
      <div className={`${styles.appContainer} ${darkMode ? 'dark-mode' : ''}`}>
        <button
          onClick={toggleDarkMode}
          className={styles.darkModeToggle}
          aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
        <Routes>
          <Route path="/register" element={<Register darkMode={darkMode} />} />
          <Route path="/login" element={<Login darkMode={darkMode} />} />
          <Route path="/dashboard" element={<Dashboard darkMode={darkMode} />} />
          <Route path="/menu-management" element={<MenuManagement />} />
          <Route path="/profile" element={<ProfileSettings darkMode={darkMode} />} />
          
          {/* Redirect root path to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Catch unmatched routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        
      </div>
    </Router>
  );
};

export default App;
