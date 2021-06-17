import { makeStyles } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { getSuggestedProfiles } from "../../firebase/firebaseServices";

import SuggestedProfile from "./subComponents/SuggestedProfile";


import { useSelector } from "react-redux";

const useStyles = makeStyles({
  suggestions: {
    position: "sticky",
  },
});

export default function Suggestions({  }) {
  const styles = useStyles();
  const [profiles, setProfiles] = useState([]);

  const { authUser, userFromDb } = useSelector((state) => {
    return state.user;
  });

  useEffect(() => {
    let isComponentMounted = true;
    async function suggestedProfiles() {
      const response = await getSuggestedProfiles(
        userFromDb.username,
        userFromDb.following
      );
      if (isComponentMounted) {
        setProfiles(response);
      }
    }

    if (userFromDb?.username) {
      suggestedProfiles();
    }

    return () => {
      isComponentMounted = false;
    };
  }, [userFromDb]);



  return (
    <div className={styles.suggestions}>
      <h3>Suggestions for you</h3>
      {profiles.map((profile) => (
        <SuggestedProfile
          key={profile.id}
          userFromDb={userFromDb}
          profile={profile}
        />
      ))}
    </div>
  );
}
