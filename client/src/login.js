import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import swal from "sweetalert";

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

function Login() {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const loginData = {
      email: email,
      password: password,
    };
    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + "/api/login", loginData);

      const { token } = response.data;

      console.log(response.data);

      localStorage.setItem("token", token);
      setEmail("");
      setPassword("");

      axios
        .get(process.env.REACT_APP_API_URL + "/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data.data;
          swal("Success", "Successfully logged in", "success");
          localStorage.setItem("user_id", data._id);
          localStorage.setItem("user_name", data.name);
          localStorage.setItem("user_email", data.email);
          localStorage.setItem("user_role", data.role);
          // console.log(data.email);

          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 2000);
        });
    } catch (error) {
      swal(error.response.data.message);
    }
  };

  return (
    <div className={classes.root}>
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
        <span className="border border p-1 rounded">
          {" "}
          Don't have an account? &nbsp;
          <Button href="/SignUp" className="bg-success text-white p-1">
            SignUp here
          </Button>
        </span>
        <br />
        <Button type="submit" variant="contained" color="primary" className={classes.button}>
          Login
        </Button>{" "}
        <br />
      </form>
    </div>
  );
}

export default Login;
