import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import User from "../components/User";
import Post from "../components/Post";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://88.200.63.148:5433/api/user/me", {
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
        const res = await fetch("http://88.200.63.148:5433/api/review/average/me", {
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
        const res = await fetch("http://88.200.63.148:5433/api/post/mine", {
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

    fetchUser();
    fetchPosts();
    fetchRating();
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
              <Post post={post} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Profile;
