import React, { useState } from "react";
import {
  Button,
  makeStyles,
  TextField,
  Typography,
  Modal,
} from "@material-ui/core";

import firebase from "firebase";
import { db, storage } from "../../firebase/firebase";

import PropagateLoader from "react-spinners/PropagateLoader";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "60vw",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  modalDiv: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  mediaInputHeading: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 20,
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
  createPostImage: {
    height: "25vw",
    width: "25vw",
    border: "1px solid lightgray",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  createPostMediaPreview: {
    maxWidth: "25vw",
    maxHeight: "25vw",
    objectFit: "contain",
  },
  createPostCaptionDiv: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    borderBottom: "1px solid lightgray",
    width: "25vw",
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 20,
  },
}));

export default function CreateStoryModal({
  open,
  setOpen,
  username,
  onNewStory,
}) {
  const styles = useStyles();
  const [file, setFile] = useState("");
  const [fileOriginal, setFileOriginal] = useState("");
  const [isVideo, setIsVideo] = useState(false);
  const videoFileTypes = ["mp4"];
  const acceptedFileTypes = ["mp4", "png"];

  const [progress, setProgress] = useState(0);

  const [caption, setCaption] = useState("");

  const [error, setError] = useState("");

  const [isUploading, setIsUploading] = useState(false);

  const handleSelectedFileChange = (event) => {
    if (event.target.files[0]) {
      if (
        acceptedFileTypes.includes(event.target.files[0].name?.split(".").pop())
      ) {
        setIsVideo(
          videoFileTypes.includes(event.target.files[0].name?.split(".").pop())
        );

        setFile(URL.createObjectURL(event.target.files[0]));
        setFileOriginal(event.target.files[0]);
        if (
          error === "No media chosen." ||
          error === "Invalid file type. You can only upload images and videos."
        ) {
          setError("");
        }
      } else {
        setError("Invalid file type. You can only upload images and videos.");
        event.target.value = null;
      }
    }
  };

  const handleUpload = () => {
    setIsUploading(true);
    const uploadTask = storage
      .ref(`${username}/media/${fileOriginal.name}`)
      .put(fileOriginal);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //progress display logic
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
        console.log(progress);
      },
      (error) => {
        //error function
        //console.log(error);
        alert(error.message);
      },
      () => {
        //complete function
        storage
          .ref(`${username}/media`)
          .child(fileOriginal.name)
          .getDownloadURL()
          .then((url) => {
            //post the image inside the DB
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              mediaURL: url,
              username: username,
              isVideo: isVideo,
              likes: [],
            });

            setProgress(0);
            setCaption("");
            setFile("");
            setFileOriginal("");
            setIsVideo(false);
            setIsUploading(false);
            onNewStory();
            setOpen(false);
            //window.location.reload();
          });
      }
    );
  };

  const makePost = () => {
    if (file) {
      if (caption) {
        //Make post logic here
        handleUpload();
      } else {
        setError("Caption is empty.");
      }
    } else {
      setError("No media chosen.");
    }
  };

  return (
    <div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className={[styles.modalDiv, styles.paper].join(" ")}>
          <h2>Create a new story</h2>
          {error ? (
            <>
              {" "}
              <Typography align="center" color="secondary">
                {error}
              </Typography>{" "}
              <br />{" "}
            </>
          ) : null}
          <div className={styles.createPostImageDiv}>
            <div className={styles.mediaInputHeading}>
              <h3>Media</h3>
              <input type="file" onChange={handleSelectedFileChange} />
            </div>
            <div className={styles.createPostImage}>
              {file ? (
                isVideo ? (
                  <video className={styles.createPostMediaPreview} controls>
                    <source src={file} />
                  </video>
                ) : (
                  <img
                    src={file}
                    className={styles.createPostMediaPreview}
                    alt=""
                  />
                )
              ) : null}
            </div>
          </div>

          <div className={styles.createPostCaptionDiv}>
            <TextField
              label="Caption"
              variant="outlined"
              color="primary"
              fullWidth
              multiline
              rows={3}
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
                if (error === "Caption is empty.") {
                  setError("");
                }
              }}
            />
          </div>
          <PropagateLoader loading={isUploading} size={15} color="#3f51b5" />
          <Button
            color="primary"
            variant="contained"
            onClick={makePost}
            disabled={isUploading}
          >
            Post
          </Button>
        </div>
      </Modal>
    </div>
  );
}
