import { useState, useEffect } from "react";

import Card from "react-bootstrap/Card";
import axios from "axios";
import { Link } from "react-router-dom";
const Dashboard = () => {
  const [homeEnabled, setHomeEnabled] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_role");
    window.location.href = "/";
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("token");
        if (!accessToken) {
          return;
        }

        const response = await axios.get(process.env.REACT_APP_API_URL + "/api/users", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setUserData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, []);

  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  };

  const toggleHome = () => {
    setHomeEnabled(!homeEnabled);
  };
  return (
    <div>
      <div>Welcome!!</div>
      <Link to="/fileupload">TP Tool</Link>
      <button
        className="btn btn-success"
        style={{
          position: "fixed",
          left: "80%",
          transform: "translateX(-20%)",
        }}
        onClick={handleLogout}
      >
        Logout
      </button>
      <br /> <br />
      <h4 onClick={toggleHome}>{homeEnabled ? "Home" : "Home"}</h4>
      {homeEnabled && (
        <div style={containerStyle}>
          <Card style={{ width: "15rem" }}>
            <Card.Body>
              <Card.Title>Total Words</Card.Title>
              <Card.Text>4,000</Card.Text>
            </Card.Body>
          </Card>

          <Card style={{ width: "15rem" }}>
            <Card.Body>
              <Card.Title>Used Words</Card.Title>
              <Card.Text>0</Card.Text>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
