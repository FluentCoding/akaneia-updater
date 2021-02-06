import React from "react";
import Container from "@material-ui/core/Container";
import Slide from "@material-ui/core/Slide";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/styles/makeStyles";
import { SnackbarProvider } from "notistack";

import Main from "./components/Main";
import Logo from "./components/Logo";

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
      <SnackbarProvider
        maxSnack={1}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Grid container direction="column" justify="center" alignItems="center">
          <Slide direction="down" in mountOnEnter unmountOnExit>
            <Grid item>
              <Logo />
            </Grid>
          </Slide>
          <Grid item>
            <Main />
          </Grid>
        </Grid>
      </SnackbarProvider>
    </Container>
  );
}
