import React, {  } from "react";
import { auth } from "../../firebase/firebase";
import { useHistory } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import { Hidden, makeStyles } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";

//import { getUserById } from "../../firebase/firebaseServices";
import Skeleton from "react-loading-skeleton";

import { useSelector } from "react-redux";

const useStyles = makeStyles({
  headerAppBar: {
    border: "1px solid lightgray",
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchTextField: {
    maxWidth: "50%",
  },
  avatar: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  appBarMargin: {
    height: 100,
  },
});

export default function Header() {
  const history = useHistory();
  const styles = useStyles();

  const { authUser, userFromDb } = useSelector((state) => {
    return state.user;
  });

  /*
    Left: Instagram text logo
    Middle: Search
    Right: Buttons/Avatar
  */

  return (
    <div>
      <AppBar
        className={styles.headerAppBar}
        position="fixed"
        color="default"
        elevation={0}
      >
        <Container className={styles.headerContainer}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1024px-Instagram_logo.svg.png"
            height="75px"
            alt=""
          />
          <Hidden smDown>
            <TextField
              className={styles.searchTextField}
              label="Search"
              variant="outlined"
              fullWidth
              type="text"
              size="small"
              //value={password}
              //onChange={(e) => setPassword(e.target.value)}
            />
          </Hidden>
          {authUser ? (
            userFromDb ? (
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
              >
                <IconButton
                  onClick={() => {
                    history.push("/");
                  }}
                >
                  <HomeOutlinedIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    auth.signOut();
                    history.push("/login");
                  }}
                >
                  <ExitToAppIcon />
                </IconButton>
                <div
                  onClick={() => {
                    history.push(`/profile`);
                  }}
                >
                  <Avatar
                    className={styles.avatar}
                    alt={userFromDb?.username}
                    src={
                      userFromDb?.dpURL === ""
                        ? "https://i.ytimg.com/vi/Q8e7phcIZzM/maxresdefault.jpg"
                        : userFromDb.dpURL
                    }
                  />
                </div>
              </Box>
            ) : (
              <div>
                <Skeleton count={1} height={50} width={150} />
              </div>
            )
          ) : (
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
            >
              <Button
                className={styles.authButton}
                color="primary"
                variant="contained"
                onClick={() => history.push("/login")}
              >
                Log In
              </Button>
              <Button
                className={styles.authButton}
                color="primary"
                variant="text"
                onClick={() => history.push("/signup")}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Container>
      </AppBar>
      <div className={styles.appBarMargin}></div>
    </div>
  );
}
