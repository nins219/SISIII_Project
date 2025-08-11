import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import User from "../components/User";

const RequestNotification = () => {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const requestId = queryParams.get("requestId");
  const initialStatus = queryParams.get("status") || "pending";
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(initialStatus);

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

  const handleAction = async (action) => {
    try {
      const res = await fetch(
        `http://localhost:5433/api/request/${requestId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: action }),
        }
      );
      if (res.ok) {
        setStatus(action);
      }
    } catch (err) {
      console.error("Failed to update request", err);
    }
  };

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
      <div className="d-flex flex-column align-items-center my-5">
        <User user={user} />
        {requestId && status === "pending" ? (
          <div className="mt-3">
            <button
              className="btn btn-success me-2"
              onClick={() => handleAction("accepted")}
            >
              Accept
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleAction("declined")}
            >
              Decline
            </button>
          </div>
        ) : requestId ? (
          <div className="mt-3">
            <span className="badge bg-secondary text-uppercase">{status}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RequestNotification;
