import React from "react";
import Container from "@material-ui/core/Container";
import makeStyles from "@material-ui/styles/makeStyles";

import Main from "./components/Main";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    userSelect: "none",
    userDrag: "none",
  },
}));

export default function App() {
  const classes = useStyles();

  return (
    <Container maxWidth="sm" className={classes.root}>
      <Main />
    </Container>
  );
}
