import React, { useState, useEffect } from "react";
import { makeStyles, Avatar, IconButton } from "@material-ui/core";

import { db } from "../../../firebase/firebase";
import {
  userLikePost,
  getUserDpUrlFromUsername,
} from "../../../firebase/firebaseServices";

import firebase from "firebase";
import { useHistory } from "react-router-dom";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

const useStyles = makeStyles({
  postLikeDiv: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  postLikeButton: {
    marginLeft: 20,
  },
  post: {
    backgroundColor: "white",
    border: "1px solid lightgray",
    marginBottom: 45,
  },
  postHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  postImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },
  postCaption: {
    fontWeight: "normal",
    paddingLeft: 20,
    paddingBottom: 10,
    borderBottom: "1px solid lightgray",
  },
  postAvatar: {
    marginRight: 10,
    "&:hover": {
      cursor: "pointer",
    },
  },
  postMediaContainer: {
    padding: 10,
  },
  postComments: {
    paddingLeft: 20,
  },
  postCommentForm: {
    marginTop: 10,
    display: "flex",
  },
  postCommentInput: {
    flex: 1,
    border: "none",
    padding: 10,
    borderTop: "1px solid lightgray",
  },
  postCommentButton: {
    flex: 0,
    border: "none",
    borderTop: "1px solid lightgray",
    color: "#6082a3",
    backgroundColor: "transparent",
  },
});

export default function Post({ postId, postData, userFromDb }) {
  const styles = useStyles();
  const history = useHistory();

  const [liked, setLiked] = useState(false);

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [dpURL, setDpURL] = useState("");

  useEffect(() => {
    let isComponentMounted = true;

    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });

      setLiked(postData?.likes.includes(userFromDb?.username));

      const getDpURL = async () => {
        const url = await getUserDpUrlFromUsername(postData?.username);
        console.log(url);
        if (isComponentMounted) {
          setDpURL(url);
        }
      };

      getDpURL();
    }
    return () => {
      unsubscribe();
      isComponentMounted = false;
    };
  }, [postId, userFromDb]);

  useEffect(() => {
    const handleLike = async () => {
      await userLikePost(postId, userFromDb?.username, liked);
    };
    handleLike();
  }, [liked]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      username: userFromDb.username,
      comment: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  return (
    <div className={styles.post}>
      <div className={styles.postHeader}>
        <Avatar
          className={styles.postAvatar}
          alt={postData.username}
          src={dpURL}
          onClick={() => history.push(`/user/${postData.username}`)}
        />
        <h3>{postData.username}</h3>
      </div>
      <div className={styles.postMediaContainer}>
        {postData.isVideo ? (
          <video className={styles.postImage}>
            <source src={`${postData.mediaURL}#t=0.1`} />
          </video>
        ) : (
          <img className={styles.postImage} src={postData.mediaURL} alt="" />
        )}
      </div>
      <div className={styles.postLikeDiv}>
        <IconButton
          className={styles.postLikeButton}
          onClick={() => setLiked(!liked)}
        >
          {liked ? (
            <FavoriteIcon fontSize="large" color="secondary" />
          ) : (
            <FavoriteBorderIcon fontSize="large" />
          )}
        </IconButton>
      </div>
      <h4 className={styles.postCaption}>
        <strong>{postData.username}:</strong> {postData.caption}
      </h4>

      <div className={styles.postComments}>
        <h3>Comments</h3>
        {comments.map((cmt) => (
          <p key={cmt.id}>
            <strong>{cmt.data.username}: </strong>
            {cmt.data.comment}
          </p>
        ))}
      </div>

      <form className={styles.postCommentForm}>
        <input
          className={styles.postCommentInput}
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <button
          disabled={!comment}
          className={styles.postCommentButton}
          type="submit"
          onClick={postComment}
        >
          Post
        </button>
      </form>
    </div>
  );
}
