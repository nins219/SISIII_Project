import React, { useEffect, useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Routes,
  Navigate,
  Route,
  Switch,
} from "react-router-dom";

function App() {
  // implement this later on, bellow in comment is the profile route example of how to implement
  const isAuth = Boolean(localStorage.getItem("token"));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route
          path="/profile"
          element={isAuth ? <Profile /> : <Navigate to="/"></Navigate>}
        /> */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
