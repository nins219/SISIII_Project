import React from "react";
import { useEffect, useState } from "react";
import SearchBar from "../components/Searchbar";
import Post from "../components/Post";
import Navbar from "../components/Navbar";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/post");
      const data = await res.json();
      if (res.ok) {
        setPosts(data);
        setFiltered(data);
      } else {
        console.error("Failed to fetch posts");
      }
    };
    fetchPosts();
  }, []);

  const handleSearch = (term) => {
    const t = term.toLowerCase();
    const results = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(t) ||
        post.content.toLowerCase().includes(t)
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
              <Post post={post} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Home;
