import React, {  useEffect } from "react";

import Header from "./components/Header";
import Timeline from "./components/Timeline";
import Suggestions from "./components/Suggestions";

import { Container, Grid } from "@material-ui/core";

import { useSelector } from "react-redux";

export default function Dashboard({  }) {
  useEffect(() => {
    document.title = "Instagram";
  }, []);

  const { authUser, userFromDb } = useSelector((state) => {
    return state.user;
  });

  return (
    <div>
      <Header userFromDb={userFromDb} />
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <Timeline userFromDb={userFromDb} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Suggestions userFromDb={userFromDb} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
