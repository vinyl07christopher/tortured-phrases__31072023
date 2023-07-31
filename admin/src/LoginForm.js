import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import swal from "sweetalert";
import OTPform from "./Component/otpform";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "0 20px",
    boxSizing: "border-box",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "400px",
  },
  textField: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  button: {
    width: "23%",
    fontSize: "0.8rem",
    marginTop: theme.spacing(2),
  },
}));

function LoginForm() {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [showOTPform, setShowOTPform] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const loginData = {
      email: email,
      password: password,
    };
    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + "/api/admin/login", loginData);

      if (response.status === 200) {
        setShowOTPform(true);
      }
    } catch (error) {
      swal(error.response.data.message);
    }
  };

  return showOTPform ? (
    <OTPform email={email} />
  ) : (
    <div className={classes.root}>
      <div> </div>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={classes.textField}
        />
        <br />
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={classes.textField}
        />
        <br />
        <Button type="submit" variant="contained" color="primary" className={classes.button}>
          Login
        </Button>
      </form>
    </div>
  );
}

export default LoginForm;
