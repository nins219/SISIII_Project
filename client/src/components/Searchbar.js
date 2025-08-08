import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [term, setTerm] = useState("");

  const handleChange = (e) => {
    const newValue = e.target.value;
    setTerm(newValue);
    onSearch(newValue);
  };

  return (
    <div className="mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Search posts..."
        value={term}
        onChange={handleChange}
      />
    </div>
  );
}
