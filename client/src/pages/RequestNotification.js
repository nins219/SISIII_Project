import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import User from "../components/User";

const RequestNotification = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5433/api/user/${id}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, [id]);

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
    </div>
  );
};

export default RequestNotification;
