import React, { useState } from "react";

import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import swal from "sweetalert";

import "./Otp.css";

const OTPform = ({ email }) => {
  const [otp, setOtp] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const correctOtp = "123456";

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerify = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + `/api/admin/otp-verify?email=${email}&otp=${otp}`);

      if (response.status === 200) {
        const { token, user, message: successMessage } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user_id", user._id);
        localStorage.setItem("user_email", user.email);
        localStorage.setItem("user_role", user.role);
        // setShowPopup(true);

        swal("Success", "Successfully logged in", "success");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);

        setMessage(successMessage);
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An error occurred while processing your request.");
      }
    }
  };

  // resetForm();
  // swal("OTP Verified Successfully!");
  // const response = await axios.post(process.env.REACT_APP_API_URL + '/api/admin/otp-verify',otp)

  // localStorage.setItem("token", token);

  // axios
  //   .get(process.env.REACT_APP_API_URL + "/api/user", {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //   .then((response) => {
  //     const data = response.data.data;
  //     console.log(data);
  //     swal("Success", "Successfully logged in", "success");
  //
  //   .catch((error) => {
  //     console.error("Error fetching user data:", error);
  //   });

  return (
    <div className="otp-container">
      <h3 className="otp-heading">Matching OTP Verification</h3>
      <Form>
        <Form.Group controlId="otp">
          <Form.Label className="otp-label">Enter OTP:</Form.Label>
          <Form.Control type="text" placeholder="Enter OTP" value={otp} onChange={handleOtpChange} maxLength={6} className="otp-input" />
        </Form.Group>
        <Button variant="primary" onClick={handleVerify} className="otp-button">
          Verify OTP
        </Button>
      </Form>
      {showMessage && (
        <Alert variant="success" className="otp-message">
          OTP Verified Successfully!
        </Alert>
      )}
      {showMessage === false && otp.length === 6 && otp !== correctOtp && (
        <Alert variant="danger" className="otp-message">
          Invalid OTP, please try again!
        </Alert>
      )}
    </div>

    // <div>
    //   {/* <input
    //     type="email"
    //     placeholder="Email"
    //     value={email}
    //     onChange={(e) => setEmail(e.target.value)}
    //   /> */}
    //   <input
    //     type="text"
    //     placeholder="OTP"
    //     value={otp}
    //     onChange={(e) => setOtp(e.target.value)}
    //   />
    //   <button onClick={handleVerify}>Verify OTP</button>
    //   <p>{message}</p>
    // </div>
  );
};

export default OTPform;
