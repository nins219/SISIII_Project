import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import User from "../components/User";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`http://localhost:5433/api/user/${id}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        console.error("Failed to fetch user");
      }
    };
    fetchUser();
  }, [id]);

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        {user ? <User user={user} /> : <p>Loading...</p>}
      </div>
    </div>
  );
};
export default Profile;
