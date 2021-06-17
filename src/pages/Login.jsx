import { useState, useEffect, useContext } from "react";
import { useHistory, Link, Redirect } from "react-router-dom";

import { makeStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { auth } from "../firebase/firebase";

import PropagateLoader from "react-spinners/PropagateLoader";

import UserContext from "../context/userContext";

const useStyles = makeStyles({
  input: {
    marginBottom: 20,
  },
  authButton: {
    marginBottom: 20,
  },
  authContainer: {
    backgroundColor: "#ffffff",
    marginTop: 25,
    padding: 50,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid lightgray",
    width: 500,
  },
  authText: {
    marginBottom: 20,
  },
});

export default function Login() {
  const styles = useStyles();
  const history = useHistory();

  const [email, setEmail] = useState("");
  //const [username, setUsername] = useState("");
  //later you make login with the username as well
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const { user } = useContext(UserContext);

  const [userLoggingIn, setUserLoggingIn] = useState(false);

  const isValid = email !== "" && password !== "";
  useEffect(() => {
    document.title = "Login • Instagram";
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setUserLoggingIn(true);
    setError("");
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setLoading(false);
        history.push("/");
      })
      .catch((error) => {
        setEmail("");
        setPassword("");
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <Box display="flex" flexDirection="column">
      {user && !userLoggingIn? <Redirect to="/double-auth-error" /> : null}
      <Container className={styles.authContainer}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1024px-Instagram_logo.svg.png"
          width="215px"
          alt=""
        />

        <form noValidate autoComplete="off" onSubmit={handleLogin}>
          <TextField
            className={styles.input}
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            className={styles.input}
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            className={styles.authButton}
            type="submit"
            color="primary"
            variant="contained"
            disabled={!isValid}
            fullWidth={true}
            classes={{ disabled: styles.disabledAuthButton }}
          >
            Login
          </Button>
        </form>

        {error ? (
          <>
            {" "}
            <Typography align="center" color="secondary">
              {error}
            </Typography>{" "}
            <br />{" "}
          </>
        ) : null}

        <Typography className={styles.authText} align="center"></Typography>
        <PropagateLoader loading={loading} size={15} color="#3f51b5" />
      </Container>

      <Container className={styles.authContainer}>
        <Typography>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </Typography>
      </Container>
    </Box>
  );
}
