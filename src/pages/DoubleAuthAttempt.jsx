import React, { useContext } from "react";
import UserContext from "../context/userContext";

import { useHistory, Redirect } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core";

import { auth } from "../firebase/firebase";

const useStyles = makeStyles({
  authButton: {
    marginBottom: 20,
  },
  doubleAuthContainer: {
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

export default function DoubleAuthAttempt() {
  const history = useHistory();
  const styles = useStyles();

  const { user } = useContext(UserContext);

  return (
    <Box display="flex" flexDirection="column">
      {user ? null : <Redirect to="/login" />}

      <Container className={styles.doubleAuthContainer}>
        <Typography className={styles.authText} align="center">
          Oops. It looks like you are already logged in.
        </Typography>
        <Button
          className={styles.authButton}
          color="primary"
          variant="contained"
          fullWidth={true}
          onClick={() => {
            auth.signOut();
            history.push("/login");
          }}
        >
          Logout
        </Button>
        <Button
          className={styles.authButton}
          color="primary"
          variant="contained"
          fullWidth={true}
          onClick={() => history.push("/")}
        >
          Go to Dashboard
        </Button>
      </Container>
    </Box>
  );
}
