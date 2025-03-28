import React, { useEffect, useState } from "react";

//u might need to chnage proxy in json file if u are running on local mashine

function App() {
  const [backendData, setBackendData] = useState([{}]);

  useEffect(() => {
    fetch("http://88.200.63.148:5000/api")
      .then((response) => response.json())
      .then((data) => {
        setBackendData(data);
      });
  }, []); //this [] means we only do it when the site is rendered only once at the beginning

  return <div></div>;
}

export default App;
