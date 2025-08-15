import React, { useEffect, useState } from "react";
import API from "../apiBase";

const Post = ({
  post,
  currentUserId,
  showOptions = false,
  onEdit,
  onDelete,
}) => {
  const [requested, setRequested] = useState(false);
  const isPast = post.date_time
    ? new Date(post.date_time) <= new Date()
    : false;

  useEffect(() => {
    if (isPast || currentUserId === undefined || post.user_id === currentUserId)
      return;

    const checkRequest = async () => {
      try {
        const res = await fetch(`${API}/api/request/status/${post.id}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setRequested(data.requested);
        }
      } catch (err) {
        console.error("Failed to check request status", err);
      }
    };

    checkRequest();
  }, [post.id, currentUserId, isPast]);

  const handleRequest = async () => {
    if (isPast || post.user_id === currentUserId) return;

    try {
      const res = await fetch(`${API}/api/request/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postId: post.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setRequested(data.requested);
      }
    } catch (err) {
      console.error("Failed to send request", err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API}/api/post/${post.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok && onDelete) {
        onDelete(post.id);
      }
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title mb-0">{post.title}</h5>
          <div className="d-flex align-items-center">
            <small className="text-muted me-2">
              {post.date_time
                ? new Date(post.date_time).toLocaleString()
                : new Date(post.created_at).toLocaleDateString()}
            </small>
            {showOptions && (
              <div className="dropdown">
                <button
                  className="btn btn-link text-muted p-0"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  &#8942;
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => onEdit && onEdit(post)}
                    >
                      Edit
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <p className="card-text">{post.description}</p>
        {post.picture && (
          <img
            src={new URL(post.picture, API).href}
            alt="Post"
            className="img-fluid rounded mt-3"
            style={{ maxHeight: "300px", objectFit: "cover", width: "100%" }}
          />
        )}
        <div className="mt-3 d-flex justify-content-between align-items-center">
          <small className="text-muted">
            By {post.name} {post.surname}
          </small>
          {currentUserId !== undefined && post.user_id !== currentUserId && (
            <button
              className={`btn ${
                requested || isPast ? "btn-secondary" : "btn-primary"
              }`}
              onClick={handleRequest}
              disabled={requested || isPast}
            >
              {isPast ? "passed" : requested ? "Requested" : "Request"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default Post;
