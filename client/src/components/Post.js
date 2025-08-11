import React, { useEffect, useState } from "react";

const Post = ({ post }) => {
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    const checkRequest = async () => {
      try {
        const res = await fetch(
          `http://localhost:5433/api/request/status/${post.id}`,
          {
            credentials: "include",
          }
        );
        if (res.ok) {
          const data = await res.json();
          setRequested(data.requested);
        }
      } catch (err) {
        console.error("Failed to check request status", err);
      }
    };

    checkRequest();
  }, [post.id]);

  const handleRequest = async () => {
    try {
      const res = await fetch("http://localhost:5433/api/request/toggle", {
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
      console.error("Failed to toggle request", err);
    }
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title mb-0">{post.title}</h5>
          <small className="text-muted">
            {new Date(post.created_at).toLocaleDateString()}
          </small>
        </div>

        <p className="card-text">{post.description}</p>
        {post.picture && (
          <img
            src={post.picture}
            alt="Post"
            className="img-fluid rounded mt-3"
            style={{ maxHeight: "300px", objectFit: "cover", width: "100%" }}
          />
        )}
        <div className="mt-3 d-flex justify-content-between align-items-center">
          <small className="text-muted">
            By {post.name} {post.surname}
          </small>
          <button
            className={`btn ${requested ? "btn-secondary" : "btn-primary"}`}
            onClick={handleRequest}
          >
            {requested ? "Requested" : "Request"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Post;
