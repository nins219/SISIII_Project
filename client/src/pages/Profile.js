import React from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();

  return (
    <div>
      <Navbar />
      <h1>Profile Page</h1>
      {/* Profile content goes here */}
    </div>
  );
};
export default Profile;
