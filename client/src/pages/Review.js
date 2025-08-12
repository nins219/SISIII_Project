import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import User from "../components/User";

const Review = () => {
  const { postId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const hostId = queryParams.get("hostId");
  const [host, setHost] = useState(null);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchHost = async () => {
      try {
        const res = await fetch(`${API}/api/user/${hostId}`);
        if (res.ok) {
          const data = await res.json();
          setHost(data);
        }
      } catch (err) {
        console.error("Failed to fetch host", err);
      }
    };
    if (hostId) fetchHost();
  }, [hostId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/review/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          to_post_id: postId,
          rating: Number(rating),
          comment,
        }),
      });
      if (res.ok) {
        navigate("/home");
      }
    } catch (err) {
      console.error("Failed to submit review", err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="d-flex flex-column align-items-center my-5">
        {host && <User user={host} />}
        <form
          onSubmit={handleSubmit}
          className="mt-3"
          style={{ width: "300px" }}
        >
          <div className="mb-3">
            <label className="form-label">Rating (1-10)</label>
            <input
              type="number"
              className="form-control"
              min="1"
              max="10"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Comment</label>
            <textarea
              className="form-control"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Review;
