import React, { useEffect, useState } from "react";
import Login from "./pages/Login"; // adjust the path if needed

function App() {
  const [backendData, setBackendData] = useState([{}]);

  useEffect(() => {
    fetch("http://localhost:5433/api")
      .then((response) => response.json())
      .then((data) => {
        setBackendData(data);
      });
  }, []); //this [] means we only do it when the site is rendered only once at the beginning

  return <Login />;
}

export default App;
