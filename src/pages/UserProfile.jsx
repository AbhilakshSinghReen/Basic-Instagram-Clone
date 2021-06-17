import React, { useState, useEffect } from "react";

import Header from "./components/Header";
import Skeleton from "react-loading-skeleton";

import {
  getUserByUsername,
  getPostsOfUser,
} from "../firebase/firebaseServices";

import {
  Box,
  Button,
  Container,
  makeStyles,
  Typography,
} from "@material-ui/core";

import { useParams, useHistory } from "react-router-dom";

import { db } from "../firebase/firebase";

import Grid from "@material-ui/core/Grid";

import { useSelector } from "react-redux";

import DotLoader from "react-spinners/DotLoader";

import { handleToggleFollow } from "../firebase/firebaseServices";

const useStyles = makeStyles({
  loadingDiv: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
    borderBottom: "1px solid lightgray",
  },
  profileDetailsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 20,
    borderBottom: "1px solid lightgray",
  },
  profileImageDiv: {
    height: "100%",
    width: "35%",
  },
  profileDetailsDiv: {
    height: "100%",
    width: "65%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  profileDetailsDiv2: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  profilePicture: {
    width: "auto",
    height: "100%",
    marginLeft: "-50px",
  },
  profileDetailsText: {
    marginRight: 50,
  },
  createPostImageDiv: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    borderTop: "1px solid lightgray",
    borderBottom: "1px solid lightgray",
    paddingBottom: 20,
  },
  postImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    "&:hover": {
      cursor: "pointer",
    },
  },
  postCell: {
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 400,
  },
});

export default function UserProfile() {
  const styles = useStyles();
  const history = useHistory();
  let { username } = useParams();

  const [userBeingViewed, setUserBeingViewed] = useState(null);

  const [userIsBeingFollowed, setUserIsBeingFollowed] = useState(false);

  const [isupdatingDb, setIsUpdatingDb] = useState(false);

  const [posts, setPosts] = useState([]);

  const { authUser, userFromDb } = useSelector((state) => {
    return state.user;
  });

  useEffect(() => {
    let isComponentMounted = true;
    const getUser_By_Username = async (user_name) => {
      const result = await getUserByUsername(user_name);
      if (isComponentMounted) {
        setUserBeingViewed(result);
      }
    };

    if (username) {
      getUser_By_Username(username);
    }

    return () => {
      isComponentMounted = false;
    };
  }, [username]);

  useEffect(() => {
    if (userFromDb && userBeingViewed) {
      if (userFromDb.username === userBeingViewed.username) {
        history.push("/profile");
      }
    }

    setUserIsBeingFollowed(
      userBeingViewed?.followers.includes(userFromDb?.username)
    );
    getPosts();
  }, [userFromDb, userBeingViewed]);

  useEffect(() => {
    getPosts();
  }, [userIsBeingFollowed]);

  const toggleFollow = async (newIsFollowing) => {
    if (userFromDb && userBeingViewed) {
      if (newIsFollowing !== userIsBeingFollowed) {
        setIsUpdatingDb(true);
        await handleToggleFollow(
          userFromDb.docId,
          userFromDb.username,
          userBeingViewed.docId,
          userBeingViewed.username,
          newIsFollowing
        );
        setUserIsBeingFollowed(newIsFollowing);
        let newListOfFollowers = userBeingViewed.followers;
        if (
          newIsFollowing &&
          !userBeingViewed.followers.includes(userFromDb.username)
        ) {
          newListOfFollowers.push(userFromDb.username);
          getPosts();
        } else if (
          !newIsFollowing &&
          userBeingViewed.followers.includes(userFromDb.username)
        ) {
          newListOfFollowers = newListOfFollowers.filter(
            (u) => u !== userFromDb.username
          );
          setPosts([]);
        }
        setUserBeingViewed({
          ...userBeingViewed,
          followers: newListOfFollowers,
        });
        setIsUpdatingDb(false);
      }
    }
  };

  const getPosts = () => {
    if (posts.length === 0) {
      if (userIsBeingFollowed || userBeingViewed?.privateProfile === false) {
        const getPostsFromDB = async () => {
          const result = await getPostsOfUser(userBeingViewed.username);
          setPosts(result);
        };

        getPostsFromDB();
      }
    }
  };

  return (
    <div>
      <Header />

      {userBeingViewed ? (
        <Box
          className={styles.profileDetailsBox}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Container className={styles.profileDetailsContainer}>
            <div
              className={styles.profileImageDiv}
              style={{
                width: "200px",
                height: "200px",
                display: "inline-block",
                overflow: "hidden",
                borderRadius: "50%",
              }}
            >
              <img
                className={styles.profilePicture}
                alt={userBeingViewed?.username}
                src={
                  userBeingViewed?.dpURL === ""
                    ? "https://i.ytimg.com/vi/Q8e7phcIZzM/maxresdefault.jpg"
                    : userBeingViewed?.dpURL
                }
              />
            </div>
            <div className={styles.profileDetailsDiv}>
              <Typography variant="h4">{userBeingViewed.username}</Typography>
              <div className={styles.profileDetailsDiv2}>
                <Typography className={styles.profileDetailsText}>
                  <strong>{posts.length} </strong>
                  Posts
                </Typography>
                <Typography className={styles.profileDetailsText}>
                  <strong>{userBeingViewed.followers.length} </strong>
                  Followers
                </Typography>
                <Typography className={styles.profileDetailsText}>
                  <strong>{userBeingViewed.following.length} </strong>
                  Following
                </Typography>
              </div>
              <Typography variant="h6">{userBeingViewed.fullName}</Typography>

              <div className={styles.profileDetailsDiv2}>
                {isupdatingDb ? (
                  <DotLoader loading={isupdatingDb} size={15} color="#3f51b5" />
                ) : userIsBeingFollowed ? (
                  <Button
                    className={styles.profileDetailsText}
                    variant="contained"
                    color="secondary"
                    onClick={() => toggleFollow(false)}
                  >
                    UnFollow
                  </Button>
                ) : (
                  <Button
                    className={styles.profileDetailsText}
                    variant="contained"
                    color="primary"
                    onClick={() => toggleFollow(true)}
                  >
                    Follow
                  </Button>
                )}
              </div>
            </div>
          </Container>
          <hr />
          <Container>
            <Grid container spacing={3}>
              {posts.map((post) => (
                <Grid
                  className={styles.postCell}
                  item
                  sm={4}
                  onClick={() => history.push("/")}
                  key={post.id}
                >
                  {post.data.isVideo ? (
                    <video className={styles.postImage}>
                      <source src={`${post.data.mediaURL}#t=0.1`} />
                    </video>
                  ) : (
                    <img
                      className={styles.postImage}
                      src={post.data.mediaURL}
                    />
                  )}
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      ) : (
        <div className={styles.loadingDiv}>
          <Skeleton count={1} height={200} width={600} />
        </div>
      )}
    </div>
  );
}
