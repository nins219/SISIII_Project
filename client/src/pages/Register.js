import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../apiBase";

const Register = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    city: "",
    language: "",
    bio: "",
    picture: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const data = new FormData();
    for (let key in formData) {
      if (key === "picture" && formData.picture) {
        data.append("picture", formData.picture, formData.picture.name);
      } else if (key !== "picture") {
        data.append(key, formData[key]);
      }
    }
    try {
      const res = await fetch(`${API}/api/user/register`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess("Registration successful!");
        setFormData({
          name: "",
          surname: "",
          email: "",
          password: "",
          city: "",
          language: "",
          bio: "",
          picture: null,
        });
        // setUncaughtExceptionCaptureCallback(null);
        navigate("/profile");
        // redirect here
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto" style={{ maxWidth: "350px" }}>
        <div className="card-body">
          <h2 className="text-center mb-4">Register</h2>
          {error && (
            <div className="alert alert-danger text-center py-2">{error}</div>
          )}
          {success && (
            <div className="alert alert-success text-center py-2">
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                name="name"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Surname"
                value={formData.surname}
                onChange={handleChange}
                name="surname"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                name="email"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                name="password"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                name="city"
                // required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Language"
                value={formData.language}
                onChange={handleChange}
                name="language"
                // required
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="Bio"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
                name="bio"
                // required
              ></textarea>
            </div>
            {/* UPLOAD PICTURE HERE/ */}
            <div className="mb-3">
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, picture: e.target.files[0] })
                }
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3">
              Register
            </button>
          </form>
          <button
            onClick={() => navigate("/login")}
            className="btn btn-light w-100"
          >
            Already have an account? Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
