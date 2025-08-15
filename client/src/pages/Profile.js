import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import User from "../components/User";
import Post from "../components/Post";
import API from "../apiBase";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API}/api/user/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          navigate("/");
        }
      } catch {
        navigate("/");
      }
    };

    const fetchRating = async () => {
      try {
        const res = await fetch(`${API}/api/review/average/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser((prev) => ({ ...(prev || {}), averageRating: data.average }));
        }
      } catch (err) {
        console.error("Failed to fetch rating", err);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API}/api/post/mine`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (err) {
        console.error("Failed to fetch user posts", err);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API}/api/review/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };

    fetchUser();
    fetchPosts();
    fetchRating();
    fetchReviews();
  }, [navigate]);

  if (!user) {
    return (
      <div>
        <Navbar />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="d-flex justify-content-center my-5">
        <User user={user} />
      </div>
      <div
        className="d-flex justify-content-center mb-5"
        style={{ gap: "10px" }}
      >
        <button
          className="btn btn-primary"
          onClick={() => navigate("/createpost")}
        >
          Add Post
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/editprofile")}
        >
          Edit Profile
        </button>
      </div>
      <div className="container mt-4">
        <div className="row justify-content-center">
          {posts.map((post) => (
            <div
              key={post.id}
              className="col-md-4 d-flex justify-content-center mb-4"
            >
              <Post post={post} currentUserId={user.user_id} />
            </div>
          ))}
        </div>
      </div>
      <div className="container mt-5 mb-5">
        <h3 className="mb-3">Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{`${rev.name} ${rev.surname}`}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  Rating: {rev.rating}
                </h6>
                {rev.comment && <p className="card-text">{rev.comment}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default Profile;
