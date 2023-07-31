import React from "react";

import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm";
import Dashboard from "./Component/Dashboard";
import Createnewuser from "./Component/Createnewuser";

import "./index.css";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Createnewuser" element={<Createnewuser />} />
        </Routes>
      </Router>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
