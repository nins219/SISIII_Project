import React from "react";
import API from "../apiBase";

const User = ({ user }) => {
  return (
    <div
      className="card shadow-sm"
      style={{ width: "500px", minHeight: "250px", position: "relative" }}
    >
      <div className="card-body d-flex" style={{ gap: "20px" }}>
        {user.picture && (
          <div style={{ flex: "1" }}>
            <img
              src={new URL(user.picture, API).href}
              alt="Profile"
              className="img-fluid rounded"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                maxHeight: "250px",
              }}
            />
          </div>
        )}
        <div
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h5 className="card-title">
            {user.name} {user.surname}
          </h5>
          <p className="card-text mb-1">
            <strong>Email:</strong> {user.email}
          </p>
          {user.city && (
            <p className="card-text mb-1">
              <strong>City:</strong> {user.city}
            </p>
          )}
          {user.language && (
            <p className="card-text mb-1">
              <strong>Language:</strong> {user.language}
            </p>
          )}
          {user.bio && (
            <p className="card-text">
              <strong>Bio:</strong> {user.bio}
            </p>
          )}
        </div>
      </div>
      {user.averageRating !== undefined && (
        <div style={{ position: "absolute", bottom: "10px", left: "10px" }}>
          <strong>Rating:</strong> {Number(user.averageRating).toFixed(1)}
        </div>
      )}
    </div>
  );
};

export default User;
