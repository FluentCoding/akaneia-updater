import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";
import UpdateIcon from "@material-ui/icons/Update";
import logo from "../static/logo.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  card: {
    padding: "2px 4px",
    display: "inline-flex",
    alignItems: "center",
    width: 400,
  },
  button: {
    flex: "0 1",
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0",
    textAlign: "left",
    marginLeft: "1rem",
    fontSize: 19,
  },
  version: {
    fontSize: 16,
  },
  cover: {
    width: "3rem",
    height: "3rem",
    justifyContent: "center",
    alignItems: "center",
  },
  cardAction: {
    display: "block",
    textAlign: "initial",
  },
}));

export default function SlpCardGrid() {
  const classes = useStyles();

  const data = [
    {
      name: "Akaneia Stable",
      version: "v0.51",
    },
    {
      name: "Akaneia Experimental",
      version: "v0.51",
    },
  ];

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="stretch"
      spacing={2}
    >
      {data &&
        data.map((build) => {
          return (
            <Grid item>
              <Paper className={classes.card} elevation={3}>
                <Box>
                  <img className={classes.cover} src={logo} alt="logo" />
                </Box>
                <Box className={classes.content}>
                  <Box>{build.name}</Box>
                  <Box className={classes.version} color="text.secondary">
                    {build.version}
                  </Box>
                </Box>
                <Box className={classes.button}>
                  <IconButton>
                    <SettingsIcon />
                  </IconButton>
                </Box>
                <Box className={classes.button}>
                  <IconButton>
                    <UpdateIcon />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          );
        })}
    </Grid>
  );
}
