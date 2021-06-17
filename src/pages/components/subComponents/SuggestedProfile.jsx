import { Avatar, makeStyles, Button } from "@material-ui/core";
import React, { useState } from "react";

import { handleToggleFollow } from "../../../firebase/firebaseServices";

import DotLoader from "react-spinners/DotLoader";

const useStyles = makeStyles({
  container: {
    margin: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid lightgray",
  },
  detailsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  avatar: {
    marginRight: 10,
  },
});

export default function SuggestedProfile({ userFromDb, profile }) {
  const styles = useStyles();

  const [updatingDb, setUpdatingDb] = useState(false);
  const [followed, setFollowed] = useState(false);

  const handleFollow = async () => {
    setUpdatingDb(true);
    await handleToggleFollow(
      userFromDb.docId,
      userFromDb.username,
      profile.id,
      profile.data.username,
      true
    );
    setFollowed(true);
    setUpdatingDb(false);
  };

  //avatar, username, follow button
  return followed ? null : (
    <div className={styles.container}>
      <div className={styles.detailsContainer}>
        <Avatar
          className={styles.avatar}
          src={
            profile.data?.dpURL === ""
              ? "https://i.ytimg.com/vi/Q8e7phcIZzM/maxresdefault.jpg"
              : profile.data?.dpURL
          }
        />
        <p>
          <strong>{profile.data.username}</strong>
        </p>
      </div>
      {updatingDb ? (
        <DotLoader loading={updatingDb} size={15} color="#3f51b5" />
      ) : (
        <Button color="primary" variant="text" onClick={handleFollow}>
          Follow
        </Button>
      )}
    </div>
  );
}
