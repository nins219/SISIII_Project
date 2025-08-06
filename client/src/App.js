import React, { useEffect, useState } from "react";
import Login from "./pages/Login"; // adjust the path if needed
import Register from "./pages/Register"; // adjust the path if needed
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Switch,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
