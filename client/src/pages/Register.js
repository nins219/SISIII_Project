import React from "react";
import { useState } from "react";

const Register = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    city: "",
    language: "",
    bio: "",
    // picture: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      data.append(key, formData[key]);
    }
    // if (picture) {
    //   data.append("picture", picture); //so check if its like this, cuz the picture is a text field and it will be placed locally on the server
    // }
    try {
      const res = await fetch("http://localhost:5433/api/user/register", {
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
          // picture: "",
        });
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
            {/* <div className="mb-3">
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  // required
                />
              </div> */}
            <button type="submit" className="btn btn-primary w-100 mb-3">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
