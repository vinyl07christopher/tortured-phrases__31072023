import React, { useState } from "react";

import axios from "axios";

import "../CreateUser.css";

const Createnewuser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = () => {
    window.location.href = "/Dashboard";
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const accessToken = localStorage.getItem("token");

      if (!accessToken) {
        window.location.href = "/";
      }

      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/api/create-user",
        { name, email, password, role },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      // Handle the response from the backend
      console.log(response.data);

      // Reset the form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("");
      setError("");

      window.location.href = "/dashboard";
    } catch (error) {
      setError("An error occurred while creating the user");
    }
  };

  return (
    <div className="login">
      <div className="form">
        <h2>Create New User</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="login-name">
              <i className="fa fa-user"></i>
            </label>
            <input id="login-name" type="text" name="name" placeholder="Name" required value={name} onChange={handleNameChange} />
            <svg>
              <use href="#svg-check" />
            </svg>
          </div>
          <div className="form-field">
            <label htmlFor="login-mail">
              <i className="fa fa-envelope"></i>
            </label>
            <input id="login-mail" type="email" name="mail" placeholder="E-Mail" required value={email} onChange={handleEmailChange} />
            <svg>
              <use href="#svg-check" />
            </svg>
          </div>
          <div className="form-field">
            <label htmlFor="login-password">
              <i className="fa fa-lock"></i>
            </label>
            <input
              id="login-password"
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Password"
              pattern=".{8,}"
              required
              value={password}
              onChange={handlePasswordChange}
            />
            <i className={`fa ${passwordVisible ? "fa-eye-slash" : "fa-eye"}`} id="password-eye" onClick={togglePasswordVisibility}></i>
            <svg>
              <use href="#svg-check" />
            </svg>
          </div>
          <div className="form-field">
            <label htmlFor="login-confirm-password">
              <i className="fa fa-check-circle"></i>
            </label>
            <input
              id="login-confirm-password"
              type={confirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              pattern=".{8,}"
              required
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <i
              className={`fa ${confirmPasswordVisible ? "fa-eye-slash" : "fa-eye"}`}
              id="confirm-password-eye"
              onClick={toggleConfirmPasswordVisibility}
            ></i>
            <svg>
              <use href="#svg-check" />
            </svg>
          </div>
          <div className="form-field">
            <label htmlFor="login-role">
              <i className="fa fa-user-tag"></i>
            </label>
            <select id="login-role" name="role" required value={role} onChange={handleRoleChange}>
              <option value="" disabled hidden>
                Select Role
              </option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <svg>
              <use href="#svg-check" />
            </svg>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="button">
            <div className="arrow-wrapper">
              <span className="arrow"></span>
            </div>
            <p className="button-text">Create User</p>
          </button>

          <button type="submit" className="button" onClick={handleLogout}>
            <div className="arrow-wrapper">
              <span className="fas fa-arrow-left"></span>
            </div>
            <p className="button-text">Back</p>
          </button>
        </form>
      </div>
      <div className="finished">
        <svg>
          <use href="#svg-check" />
        </svg>
      </div>
    </div>
  );
};

export default Createnewuser;
