import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../apiBase";

const EditPost = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { post } = location.state || {};

  const [activities, setActivities] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    activity_type: "",
    location: "",
    picture: null,
    no_of_people: "",
    date_time: "",
    is_paid_event: false,
    ticket_price: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!post) {
      navigate("/profile");
      return;
    }

    const fetchActivities = async () => {
      const res = await fetch(`${API}/api/post/activities`);
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    };
    fetchActivities();

    setFormData({
      title: post.title || "",
      description: post.description || "",
      activity_type: post.activity_type || "",
      location: post.location || "",
      picture: post.picture || null,
      no_of_people: post.no_of_people || "",
      date_time: post.date_time
        ? new Date(post.date_time).toISOString().slice(0, 16)
        : "",
      is_paid_event: !!post.is_paid_event,
      ticket_price: post.ticket_price || "",
    });
  }, [post, navigate]);

  const minDateTime = new Date().toISOString().slice(0, 16);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "picture" && files) {
      setFormData((prev) => ({ ...prev, picture: files[0] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (
      formData.date_time &&
      new Date(formData.date_time).getTime() <= Date.now()
    ) {
      setError("Date and time must be in the future");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "picture") {
        if (value && typeof value !== "string") {
          data.append("picture", value, value.name);
        } else if (typeof value === "string" && value) {
          data.append("existingPicture", value);
        }
      } else if (key === "is_paid_event") {
        data.append("is_paid_event", value ? 1 : 0);
      } else if (key === "ticket_price") {
        data.append("ticket_price", value || 0);
      } else {
        data.append(key, value);
      }
    });

    try {
      const res = await fetch(`${API}/api/post/update/${post.id}`, {
        method: "PUT",
        body: data,
        credentials: "include",
      });
      const result = await res.json();
      if (res.ok) {
        navigate("/profile");
      } else {
        setError(result.error || "Failed to update post");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <div className="card mx-auto" style={{ maxWidth: "600px" }}>
          <div className="card-body">
            <h2 className="text-center mb-4">Edit Post</h2>
            {error && (
              <div className="alert alert-danger text-center py-2">{error}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Activity</label>
                <select
                  className="form-select"
                  value={formData.activity_type}
                  name="activity_type"
                  onChange={handleChange}
                  required
                >
                  <option value="">Select activity</option>
                  {activities.map((act) => (
                    <option key={act.id_activity} value={act.id_activity}>
                      {act.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Number of People</label>
                <input
                  type="number"
                  className="form-control"
                  name="no_of_people"
                  value={formData.no_of_people}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="date_time"
                  value={formData.date_time}
                  onChange={handleChange}
                  min={minDateTime}
                />
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="is_paid_event"
                  checked={formData.is_paid_event}
                  onChange={handleChange}
                />
                <label className="form-check-label">Paid Event</label>
              </div>
              {formData.is_paid_event && (
                <div className="mb-3">
                  <label className="form-label">Ticket Price</label>
                  <input
                    type="number"
                    className="form-control"
                    name="ticket_price"
                    value={formData.ticket_price}
                    onChange={handleChange}
                  />
                </div>
              )}
              <div className="mb-3">
                <label className="form-label">Picture</label>
                <input
                  type="file"
                  className="form-control"
                  name="picture"
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Update Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
