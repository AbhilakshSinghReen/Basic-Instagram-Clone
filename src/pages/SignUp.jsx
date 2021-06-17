import { useState, useEffect ,useContext } from "react";
import UserContext from "../context/userContext";
import { useHistory, Link, Redirect } from "react-router-dom";

import { makeStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { auth, db } from "../firebase/firebase";
import { doesUsernameAlreadyExist } from "../firebase/firebaseServices";
import PropagateLoader from "react-spinners/PropagateLoader";

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

export default function SignUp() {
  const styles = useStyles();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const[newUserSigningUp,setNewUserSigningUp]=useState(false);

  const { user } = useContext(UserContext);  

  const isValid =
    email !== "" &&
    fullName !== "" &&
    username !== "" &&
    password !== "" &&
    confirmedPassword !== "";

  useEffect(() => {
    document.title = "SignUp • Instagram";
  }, []);

  const handleSignup = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    //console.log("Siging you right up!");
    if (password === confirmedPassword) {
      const usernameAlreadyExists = await doesUsernameAlreadyExist(username);

      if (!usernameAlreadyExists) {
        //console.log("That username is okay to use.")
        try {
          setNewUserSigningUp(true);
          const createdUser = await auth.createUserWithEmailAndPassword(
            email,
            password
          );
          await createdUser.user.updateProfile({
            displayName: username,
          });

          await db.collection("users").add({
            userId: createdUser.user.uid,
            username: username.toLowerCase(),
            fullName: fullName,
            emailId: email,
            privateProfile:true,
            following: [],
            followers: [],
            dpURL:"",
            dateCreated: Date.now(),
          });
          setLoading(false);
          history.push("/");
        } catch (error) {
          setUsername("");
          setFullName("");
          setEmail("");
          setPassword("");
          setConfirmedPassword("");
          setError(error.message);
          setLoading(false);
        }
      } else {
        //console.log("Sorry that username is taken.")
        setError("That username is already taken, please try another one.");
        setLoading(false);
      }
    } else {
      setError("Passwords do not match.");
      setLoading(false);
    }
  };

  const history = useHistory();

  return (
    <Box display="flex" flexDirection="column">
      {user && !newUserSigningUp ? <Redirect to="/double-auth-error" /> : null}
      <Container className={styles.authContainer}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1024px-Instagram_logo.svg.png"
          width="215px"
          alt=""
        />

        <form noValidate autoComplete="off" onSubmit={handleSignup}>
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
            label="Full Name"
            variant="outlined"
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <TextField
            className={styles.input}
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          <TextField
            className={styles.input}
            label="Confirm Password"
            variant="outlined"
            fullWidth
            type="password"
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
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
            Sign up
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

        <Typography className={styles.authText} align="center">
          By signing up, you agree to our Terms, Data Policy and Cookies Policy.
        </Typography>
        <PropagateLoader loading={loading} size={15} color="#3f51b5" />
      </Container>

      <Container className={styles.authContainer}>
        <Typography>
          Have an account? <Link to="/login">Log in</Link>
        </Typography>
      </Container>
    </Box>
  );
}
