import React, { useState } from "react";

import { Form, Button } from "react-bootstrap";
import axios from "axios";

import "./SignUp.css"; // Create a CSS file for animations and additional styling

const SignUp = () => {
  // Create state variables for each input field
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName) {
      alert("Firstname is required.");

      return;
    }

    if (!lastName) {
      alert("Lastname is required.");
      return;
    }

    if (!email) {
      alert("E-mail Address is required.");
      return;
    }

    if (password.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      alert("Password must be at least 8 characters long and include special characters.");
      return;
    }

    const formData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + "/api/signup", formData);

      alert("Form submitted successfully!");

      setFirstName(" ");
      setLastName(" ");
      setEmail("");
      setPassword(" ");
      setShowPassword(" ");

      console.log(response.data);
    } catch (error) {
      console.error("Error submitting form:", error.message);
    }
  };

  return (
    <div>
      <br />
      <br />
      <br />

      <div className="sign-up-container">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFirstName">
            <Form.Label>Firstname</Form.Label>
            <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </Form.Group>
          <Form.Group controlId="formLastName">
            <Form.Label>Lastname</Form.Label>
            <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>E-mail Address</Form.Label>
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Form.Group>
          {/* 
          <Form.Group controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group> */}
          <Form.Group controlId="formShowPassword">
            <Form.Check type="checkbox" label="Show password" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} />
          </Form.Group>
          <br /> <br />
          <span className="border border p-3 rounded">
            Already have an account? &nbsp;
            <Button href="/Login" className="bg-success text-white p-1">
              Log in here
            </Button>
          </span>
          <br />
          <div className="d-flex justify-content-center pt-4">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;
