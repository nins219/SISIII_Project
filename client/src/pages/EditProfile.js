import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../apiBase";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    city: "",
    language: "",
    bio: "",
  });
  const [picture, setPicture] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API}/api/user/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name || "",
            surname: data.surname || "",
            city: data.city || "",
            language: data.language || "",
            bio: data.bio || "",
          });
        } else {
          navigate("/");
        }
      } catch {
        navigate("/");
      }
    };
    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (picture) {
      data.append("picture", picture);
    }
    try {
      const res = await fetch(`${API}/api/user/me`, {
        method: "PUT",
        body: data,
        credentials: "include",
      });
      if (res.ok) {
        navigate("/profile");
      }
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Surname</label>
            <input
              type="text"
              className="form-control"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">City</label>
            <input
              type="text"
              className="form-control"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Language</label>
            <input
              type="text"
              className="form-control"
              name="language"
              value={formData.language}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Bio</label>
            <textarea
              className="form-control"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Profile Picture</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setPicture(e.target.files[0])}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
