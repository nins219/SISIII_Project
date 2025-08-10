import React from "react";

const User = ({ user }) => {
  return (
    <div className="card" style={{ width: "400px" }}>
      <div className="card-body">
        <h2 className="card-title">
          {user.name} {user.surname}
        </h2>
        {user.city && <p className="card-text">City: {user.city}</p>}
        {user.language && (
          <p className="card-text">Language: {user.language}</p>
        )}
      </div>
    </div>
  );
};

export default User;
