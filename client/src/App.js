import React from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreatePost from "./pages/CreatePost";
import EditProfile from "./pages/EditProfile";
import RequestNotification from "./pages/RequestNotification";
import Review from "./pages/Review";
import EditPost from "./pages/EditPost";

function App() {
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
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/user/:id" element={<RequestNotification />} />
        <Route path="/review/:postId" element={<Review />} />
        <Route path="/editpost/:id" element={<EditPost />} />
      </Routes>
    </Router>
  );
}

export default App;
