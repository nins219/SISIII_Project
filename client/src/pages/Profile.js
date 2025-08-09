import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

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
      <h1>Welcome, {user.name}</h1>
    </div>
  );
};
export default Profile;
