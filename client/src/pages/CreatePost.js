import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

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
    noOfPeople: "",
    dateTime: "",
    isPaid: false,
    ticketPrice: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      const res = await fetch("http://localhost:5433/api/post/activities");
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    };
    fetchActivities();
  }, []);

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
      const res = await fetch("http://localhost:5433/api/post/create", {
        method: "POST",
        body: data,
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
          noOfPeople: "",
          dateTime: "",
          isPaid: false,
          ticketPrice: "",
        });
        navigate("/profile");
      } else {
        setError(result.error || "Failed to create post");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("title", title);
  //   formData.append("description", description);
  //   formData.append("activity_type", activity);
  //   formData.append("location", location);
  //   formData.append("no_of_people", noOfPeople);
  //   formData.append("date_time", dateTime);
  //   formData.append("is_paid_event", isPaid ? 1 : 0);
  //   formData.append("ticket_price", ticketPrice || 0);
  //   if (picture) formData.append("picture", picture);

  //   const [error, setError] = useState("");
  //   const [success, setSuccess] = useState("");

  //   const res = await fetch("http://localhost:5433/api/post/create", {
  //     method: "POST",
  //     body: formData,
  //     credentials: "include",
  //   });

  //   if (res.ok) {
  //     navigate("/profile");
  //   } else {
  //     console.error("Failed to create post");
  //   }
  // };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h2>Create Post</h2>
        <div className="card mx-auto" style={{ maxWidth: "600px" }}>
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
                <label className="form-label">Activity Type</label>
                <select
                  className="form-select"
                  value={activity}
                  name="activity_type"
                  //maybe there will be a problem with this cuz i dont know how to get the value
                  onChange={handleChange}
                  required
                >
                  <option value="">Select activity</option>
                  {activities.map((act) => (
                    <option
                      key={act.activity_type_id}
                      value={act.activity_type_id}
                    >
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
                  value={formData.noOfPeople}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="dateTime"
                  value={formData.dateTime} //idk if this is correct format
                  onChange={handleChange}
                />
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="isPaid"
                  checked={formData.isPaid}
                  onChange={handleChange}
                  id="paidEvent"
                />
                <label className="form-check-label" htmlFor="paidEvent">
                  Paid Event
                </label>
              </div>
              <div className="mb-3">
                <label className="form-label">Ticket Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={formData.ticketPrice}
                  name="ticketPrice"
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
                    setFormData({ ...formData, picture: e.target.files[0] })
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
