import React from "react";

const User = ({ user }) => {
  return (
    <div className="card mb-4 shadow-sm" style={{ maxWidth: "900px" }}>
      <div className="row g-0 align-items-center">
        {user.picture && (
          <div className="col-md-4">
            <img
              src={user.picture}
              alt={`${user.name} ${user.surname}`}
              className="img-fluid rounded-start"
              style={{ objectFit: "cover", height: "100%", width: "100%" }}
            />
          </div>
        )}
        <div className={user.picture ? "col-md-8" : "col-md-12"}>
          <div className="card-body">
            <h5 className="card-title">
              {user.name} {user.surname}
              {user.is_verified ? (
                <span className="badge bg-success ms-2">Verified</span>
              ) : null}
            </h5>
            {user.bio && <p className="card-text">{user.bio}</p>}
            <p className="card-text">
              <small className="text-muted">
                {user.city}
                {user.language ? ` • ${user.language}` : ""}
              </small>
            </p>
            <p className="card-text">
              <small className="text-muted">
                Account type: {user.account_type}
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
