import React from "react";

const Post = ({ post }) => {
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
        <div className="mt-3 text-muted text-end">
          <small>
            By {post.name} {post.surname}
          </small>
        </div>
      </div>
    </div>
  );
};
export default Post;
