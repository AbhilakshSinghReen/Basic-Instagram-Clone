import {
  Box,
  Button,
  Container,
  makeStyles,
  Switch,
  Typography,
} from "@material-ui/core";

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import Header from "./components/Header";
import Skeleton from "react-loading-skeleton";
import AddIcon from "@material-ui/icons/Add";
import { db } from "../firebase/firebase";
import Grid from "@material-ui/core/Grid";

import CreatePostModal from "./components/CreatePostModal";
import CreateStoryModal from "./components/CreateStoryModal";
import ChangeProfilePictureModal from "./components/ChangeProfilePictureModal";

import { useSelector } from "react-redux";

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
    "&:hover": {
      cursor: "pointer",
    },
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

export default function Profile() {
  const styles = useStyles();
  const history = useHistory();

  const [privateProfile, setPrivateProfile] = useState(true);
  const [posts, setPosts] = useState([]);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [dpModalOpen, setDpModalOpen] = useState(false);

  const [showDp, setShowDp] = useState(true);

  const [newPost, setNewPost] = useState(0);

  const onNewPost = () => {
    setNewPost(newPost + 1);
  };

  const { authUser, userFromDb } = useSelector((state) => {
    return state.user;
  });

  //console.log("selected", selected);

  useEffect(() => {
    let isComponentMounted = true;

    const getUserPosts = async () => {
      if (userFromDb?.username) {
        const result = await db
          .collection("posts")
          .where("username", "==", userFromDb.username)
          .get();

        let userPosts = [];
        result.docs.map((doc) => {
          userPosts.push(doc.data());
        });
        if (isComponentMounted) {
          setPosts(userPosts);
        }
      }
    };

    getUserPosts();

    if (userFromDb) {
      setPrivateProfile(userFromDb.privateProfile);
    }

    return () => {
      isComponentMounted = false;
    };
  }, [userFromDb, newPost]);

  useEffect(() => {
    if (userFromDb?.docId) {
      if (privateProfile !== userFromDb?.privateProfile) {
        userFromDb.privateProfile = privateProfile;
        db.collection("users").doc(userFromDb.docId).update({
          privateProfile: privateProfile,
        });
      }
    }
  }, [privateProfile]);

  return (
    <div>
      <Header userFromDb={userFromDb} />

      <CreatePostModal
        open={postModalOpen}
        setOpen={setPostModalOpen}
        username={userFromDb?.username}
        onNewPost={onNewPost}
      />

      <CreateStoryModal
        open={storyModalOpen}
        setOpen={setStoryModalOpen}
        username={userFromDb?.username}
        onNewStory={() => {}}
      />

      <ChangeProfilePictureModal
        open={dpModalOpen}
        setOpen={setDpModalOpen}
        userDocId={userFromDb?.docId}
        username={userFromDb?.username}
      />

      {userFromDb ? (
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
              onMouseOver={() => {
                setShowDp(false);
              }}
              onMouseOut={() => {
                setShowDp(true);
              }}
              onClick={() => setDpModalOpen(true)}
            >
              {showDp ? (
                <img
                  className={styles.profilePicture}
                  alt={userFromDb?.username}
                  src={
                    userFromDb?.dpURL === ""
                      ? "https://i.ytimg.com/vi/Q8e7phcIZzM/maxresdefault.jpg"
                      : userFromDb?.dpURL
                  }
                />
              ) : (
                <img
                  className={styles.profilePicture}
                  style={{
                    opacity: "50%",
                  }}
                  alt={userFromDb?.username}
                  src={
                    userFromDb?.dpURL === ""
                      ? "editIcon.jpg"
                      : userFromDb?.dpURL
                  }
                />
              )}
            </div>
            <div className={styles.profileDetailsDiv}>
              <Typography variant="h4">{userFromDb.username}</Typography>
              <div className={styles.profileDetailsDiv2}>
                <Typography className={styles.profileDetailsText}>
                  <strong>{posts.length} </strong>
                  Posts
                </Typography>
                <Typography className={styles.profileDetailsText}>
                  <strong>{userFromDb.followers.length} </strong>
                  Followers
                </Typography>
                <Typography className={styles.profileDetailsText}>
                  <strong>{userFromDb.following.length} </strong>
                  Following
                </Typography>
              </div>
              <Typography variant="h6">{userFromDb.fullName}</Typography>
              <div className={styles.profileDetailsDiv2}>
                <Button
                  className={styles.profileDetailsText}
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => setPostModalOpen(true)}
                >
                  Post
                </Button>
                <Button
                  className={styles.profileDetailsText}
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => setStoryModalOpen(true)}
                >
                  Story
                </Button>
                <Typography variant="h6">Private: </Typography>
                <Switch
                  checked={privateProfile}
                  onChange={(e) => setPrivateProfile(e.target.checked)}
                  color="primary"
                  name="privateProfileToggleSwitch"
                />
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
                >
                  {post.isVideo ? (
                    <video className={styles.postImage}>
                      <source src={`${post.mediaURL}#t=0.1`} />
                    </video>
                  ) : (
                    <img className={styles.postImage} src={post.mediaURL} />
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
