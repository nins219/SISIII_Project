import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import User from "../components/User";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5433/api/user/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          navigate("/");
        }
      } catch {
        navigate("/");
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) {
    return (
      <div>
        <Navbar />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="d-flex justify-content-center my-5">
        <User user={user} />
      </div>
      <div
        className="d-flex justify-content-center mb-5"
        style={{ gap: "10px" }}
      >
        <button
          className="btn btn-primary"
          onClick={() => navigate("/createpost")}
        >
          Add Post
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/editprofile")}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};
export default Profile;
