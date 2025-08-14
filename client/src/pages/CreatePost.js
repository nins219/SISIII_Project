import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import API from "../apiBase";

const CreatePost = () => {
  // const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");
  // const [activity, setActivity] = useState("");
  // const [location, setLocation] = useState("");
  // const [picture, setPicture] = useState(null);
  // const [noOfPeople, setNoOfPeople] = useState("");
  // const [dateTime, setDateTime] = useState("");
  // const [isPaid, setIsPaid] = useState(false);
  // const [ticketPrice, setTicketPrice] = useState("");
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
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      const res = await fetch(`${API}/api/post/activities`);
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    };
    fetchActivities();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "picture") {
        if (value) {
          data.append("picture", value, value.name);
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
      const res = await fetch(`${API}/api/post/create`, {
        method: "POST",
        body: data,
        credentials: "include",
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess("Post created successfully!");
        setFormData({
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
        navigate("/profile");
      } else {
        setError(result.error || "Failed to create post");
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
            <h2 className="text-center mb-4">Create Post</h2>
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
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleChange}
                  name="title"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  name="description"
                  placeholder="Description"
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Activity</label>
                <select
                  className="form-select"
                  value={formData.activity_type}
                  name="activity_type"
                  //maybe there will be a problem with this cuz i dont know how to get the value
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
                  value={formData.location}
                  onChange={handleChange}
                  name="location"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Number of People</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.no_of_people}
                  name="no_of_people"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="date_time"
                  value={formData.date_time} //idk if this is correct format
                  onChange={handleChange}
                />
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="is_paid_event"
                  checked={formData.is_paid_event}
                  onChange={handleChange}
                  id="is_paid_event"
                />
                <label className="form-check-label" htmlFor="is_paid_event">
                  Paid Event
                </label>
              </div>
              <div className="mb-3">
                <label className="form-label">Ticket Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={formData.ticket_price}
                  name="ticket_price"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Picture</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      picture: e.target.files[0],
                    }))
                  }
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 mb-3">
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
