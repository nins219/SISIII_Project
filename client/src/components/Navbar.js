import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          "http://localhost:5433/api/request/notifications",
          {
            credentials: "include",
          }
        );
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    fetchNotifications();
  }, []);

  const handleAction = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5433/api/request/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, status } : n))
        );
      }
    } catch (err) {
      console.error("Failed to update request", err);
    }
  };

  return (
    <div>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <Link className="nav-link active" to="/home">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/profile">
            Profile
          </Link>
        </li>
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
            href="#"
          >
            Notifications
            {notifications.length > 0 ? ` (${notifications.length})` : ""}
          </a>
          <ul
            className="dropdown-menu"
            style={{ maxHeight: "300px", overflowY: "auto" }}
          >
            {notifications.length === 0 && (
              <li>
                <span className="dropdown-item-text">No notifications</span>
              </li>
            )}
            {notifications.map((n) => (
              <li key={n.id} className="dropdown-item">
                <div className="d-flex justify-content-between align-items-start">
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(
                        `/user/${n.user_id}?requestId=${n.id}&status=${n.status}`
                      )
                    }
                  >
                    <div>{`${n.name} ${n.surname} requested to join your post`}</div>
                    <small className="text-muted">
                      {new Date(n.status_updated_at).toLocaleString()}
                    </small>
                  </div>
                  {n.status === "pending" ? (
                    <div>
                      <button
                        className="btn btn-sm btn-success me-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(n.id, "accepted");
                        }}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(n.id, "declined");
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <span className="badge bg-secondary text-uppercase">
                      {n.status}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
};
export default Navbar;
