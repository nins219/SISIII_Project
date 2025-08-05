import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const endpoint = isRegister
      ? "http://localhost:5433/api/user/register"
      : "http://localhost:5433/api/user/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Success!");
        // maybe store token, redirect, etc.
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto" style={{ maxWidth: "350px" }}>
        <div className="card-body">
          <h2 className="text-center mb-4">
            {isRegister ? "Register" : "Sign In"}
          </h2>
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
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3">
              {isRegister ? "Register" : "Sign In"}
            </button>
          </form>

          <button
            onClick={() => setIsRegister((prev) => !prev)}
            className="btn btn-light w-100"
          >
            {isRegister
              ? "Already have an account? Sign In"
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
    // <div
    //   style={{
    //     maxWidth: 350,
    //     margin: "40px auto",
    //     padding: 20,
    //     border: "1px solid #ccc",
    //     borderRadius: 8,
    //   }}
    // >
    //   <h2 style={{ textAlign: "center" }}>
    //     {isRegister ? "Register" : "Sign In"}
    //   </h2>
    //   {error && (
    //     <div
    //       style={{ color: "#b00020", marginBottom: 10, textAlign: "center" }}
    //     >
    //       {error}
    //     </div>
    //   )}
    //   {success && (
    //     <div
    //       style={{ color: "#388e3c", marginBottom: 10, textAlign: "center" }}
    //     >
    //       {success}
    //     </div>
    //   )}
    //   <form onSubmit={handleSubmit}>
    //     <input
    //       type="email"
    //       placeholder="Email"
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //       required
    //       style={{ width: "100%", marginBottom: 10, padding: 8 }}
    //     />
    //     <input
    //       type="password"
    //       placeholder="Password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //       required
    //       style={{ width: "100%", marginBottom: 10, padding: 8 }}
    //     />
    //     <button
    //       type="submit"
    //       style={{ width: "100%", padding: 10, marginBottom: 10 }}
    //     >
    //       {isRegister ? "Register" : "Sign In"}
    //     </button>
    //   </form>
    //   <button
    //     onClick={() => setIsRegister((prev) => !prev)}
    //     style={{
    //       width: "100%",
    //       padding: 8,
    //       background: "#eee",
    //       border: "none",
    //       borderRadius: 4,
    //     }}
    //   >
    //     {isRegister
    //       ? "Already have an account? Sign In"
    //       : "Don't have an account? Register"}
    //   </button>
    // </div>
  );
};

export default Login;
