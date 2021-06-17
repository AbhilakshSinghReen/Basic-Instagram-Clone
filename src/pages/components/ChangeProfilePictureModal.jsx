import React, { useState } from "react";
import { Button, makeStyles, Typography, Modal } from "@material-ui/core";

import { storage } from "../../firebase/firebase";

import { updateUserDp } from "../../firebase/firebaseServices";

import PropagateLoader from "react-spinners/PropagateLoader";

import { useHistory } from "react-router-dom";

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
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
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
  applyDpButton: {
    marginTop: 20,
  },
}));

export default function ChangeProfilePictureModal({
  open,
  setOpen,
  userDocId,
  username,
}) {
  const styles = useStyles();
  const history = useHistory();
  const [file, setFile] = useState("");
  const [fileOriginal, setFileOriginal] = useState("");

  const acceptedFileTypes = ["jpg", "png"];
  const [error, setError] = useState("");

  const [isUploading, setIsUploading] = useState(false);

  const handleSelectedFileChange = (event) => {
    if (event.target.files[0]) {
      if (
        acceptedFileTypes.includes(event.target.files[0].name?.split(".").pop())
      ) {
        setFile(URL.createObjectURL(event.target.files[0]));
        setFileOriginal(event.target.files[0]);
        if (
          error === "No media chosen." ||
          error === "Invalid file type. You can only upload images."
        ) {
          setError("");
        }
      } else {
        setError("Invalid file type. You can only upload images.");
        event.target.value = null;
      }
    }
  };

  const handleDpUpdateInDb = async (newDpURL) => {
    await updateUserDp(userDocId, newDpURL);

    setIsUploading(false);
    setOpen(false);
    setFile("");
    setFileOriginal("");
    window.location.reload();    
  };

  const handleUpload = () => {
    setIsUploading(true);
    const uploadTask = storage
      .ref(`${username}/dp/${fileOriginal.name}`)
      .put(fileOriginal);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //progress display logic
      },
      (error) => {
        //error function
        //console.log(error);
        alert(error.message);
      },
      () => {
        //complete function
        storage
          .ref(`${username}/dp`)
          .child(fileOriginal.name)
          .getDownloadURL()
          .then((url) => {
            /*
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              mediaURL: url,
              username: username,
              isVideo: isVideo,
            });
            */

            handleDpUpdateInDb(url);
          });
      }
    );
  };

  const changeDp = () => {
    if (file) {
      handleUpload();
    } else {
      setError("No media chosen.");
    }
  };

  return (
    <div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className={[styles.modalDiv, styles.paper].join(" ")}>
          <h2>Change your display picture</h2>
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
              <input type="file" onChange={handleSelectedFileChange} />
            </div>

            <div className={styles.createPostImage}>
              {file ? (
                <img
                  src={file}
                  className={styles.createPostMediaPreview}
                  alt=""
                />
              ) : null}
            </div>
          </div>
          <PropagateLoader loading={isUploading} size={15} color="#3f51b5" />
          <Button
            className={styles.applyDpButton}
            color="primary"
            variant="contained"
            onClick={changeDp}
            disabled={isUploading}
          >
            Apply New Image
          </Button>
        </div>
      </Modal>
    </div>
  );
}
