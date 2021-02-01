import React from "react";
import logo from "./logo.svg";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/styles/makeStyles";
//import config from './util/config'

import Setup from "./components/Setup";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    userSelect: "none",
    userDrag: "none",
  },
  logo: {
    height: "13rem",
    pointerEvents: "none",
    margin: "3rem",
  },
  updateButton: {
    marginBottom: "2rem",
  },
  updateLogs: {
    padding: "0.5rem",
  },
}));

export default function App() {
  const classes = useStyles();

  return (
    <Container maxWidth="sm" className={classes.root}>
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item>
          <img src={logo} alt="logo" className={classes.logo} />
        </Grid>
        <Grid item>
          <Setup />
        </Grid>
      </Grid>
    </Container>
  );
}
