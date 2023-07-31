import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import axios from "axios";

import "../App.css";

const Dashboard = () => {
  const [updatedUser, setUpdatedUser] = useState({});
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [users, setUsers] = useState([]);

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
          window.location.href = "/";
        }

        const response = await axios.get(process.env.REACT_APP_API_URL + "/api/users", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUsers(response.data.data);
      } catch (error) {
        window.location.href = "/";
        console.log(error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = (userId) => {
    const userToUpdate = users.find((user) => user._id === userId);
    setUpdatedUser(userToUpdate);
    setIsEditPopupOpen(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const saveUpdatedUser = () => {
    const userIndex = users.findIndex((user) => user._id === updatedUser._id);
    const updatedUsers = [...users];
    updatedUsers[userIndex] = updatedUser;

    axios
      .put(process.env.REACT_APP_API_URL + "/api/users/" + updatedUser._id, updatedUser)
      .then((response) => {
        setUsers(updatedUsers);
        setIsEditPopupOpen(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDelete = (userId) => {
    console.log("Deleting user with ID:", userId);
    fetch(`/api/users/${userId}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          const updatedUsers = users.filter((user) => user._id !== userId);
          setUsers(updatedUsers);
        } else {
          throw new Error(response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const tableHeaderStyle = {
    backgroundColor: "#f2f2f2",
    padding: "8px",
    border: "1px solid #ddd",
  };

  const tableCellStyle = {
    padding: "8px",
    border: "1px solid #ddd",
  };

  return (
    <div>
      <div>
        <br />
        <br />
        <br />
        <Link to="/Createnewuser">Create new user</Link>
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
        <br />
        <br />
        <br />
        <br />
      </div>
      <div className="user-list-container">
        <h2>User List</h2>
        <br />
        <div className="table-container">
          {isEditPopupOpen && (
            <div className="edit-popup">
              <input type="text" name="name" value={updatedUser.name || ""} onChange={handleInputChange} />
              <input type="text" name="email" value={updatedUser.email || ""} onChange={handleInputChange} />
              <input type="text" name="password" value={updatedUser.password || ""} onChange={handleInputChange} />
              <select name="role" value={updatedUser.role || ""} onChange={handleInputChange}>
                <option value="" disabled selected>
                  Select Role
                </option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>

              <button onClick={saveUpdatedUser}>Save</button>
              <button onClick={() => setIsEditPopupOpen(false)}>Close</button>
            </div>
          )}
          <br />
          <br />
          <br />
          <table>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Name</th>
                <th style={tableHeaderStyle}>Email</th>
                <th style={tableHeaderStyle}>Role</th>
                <th style={tableHeaderStyle}>Update</th>
                <th style={tableHeaderStyle}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td style={tableCellStyle}>{user.name}</td>
                  <td style={tableCellStyle}>{user.email}</td>
                  <td style={tableCellStyle}>{user.role}</td>
                  <td>
                    <button onClick={() => handleUpdate(user._id)}>Update</button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(user._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
