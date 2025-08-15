import React from "react";
import { useEffect, useState } from "react";
import SearchBar from "../components/Searchbar";
import Post from "../components/Post";
import Navbar from "../components/Navbar";
import API from "../apiBase";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [currentUserId, setCurrentUserId] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`${API}/api/post`);
      const data = await res.json();
      if (res.ok) {
        setPosts(data);
        setFiltered(data);
      } else {
        console.error("Failed to fetch posts");
      }
    };

    const fetchMe = async () => {
      try {
        const res = await fetch(`${API}//api/user/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentUserId(data.user_id);
        } else {
          setCurrentUserId(null);
        }
      } catch (err) {
        console.error("Failed to fetch logged in user id", err);
        setCurrentUserId(null);
      }
    };

    fetchPosts();
    fetchMe();
  }, []);

  const handleSearch = (term) => {
    const t = term.toLowerCase();
    const results = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(t) ||
        post.description.toLowerCase().includes(t)
    );
    setFiltered(results);
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <SearchBar onSearch={handleSearch} />
        <div className="row">
          {filtered.map((post) => (
            <div key={post.id} className="col-md-3 mb-4">
              <Post post={post} currentUserId={currentUserId} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Home;
