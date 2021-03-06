import fs from "fs";
import { useSnackbar } from "notistack";

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import SettingsIcon from "@material-ui/icons/Settings";

import BuildCardGrid from "../components/BuildCardGrid";
import Settings from "../components/Settings";
import store from "../util/config";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2.5),
    right: theme.spacing(2.5),
  },
  settingsFab: {
    position: "absolute",
    bottom: theme.spacing(2.5),
    right: theme.spacing(11.5),
  },
  setupButton: {
    textDecoration: "none",
    color: "black",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export default function Home() {
  const history = useHistory();

  const classes = useStyles();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isUpdating, setUpdating] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!store.get("trackedIsos")?.length) history.push("/setup");
    else {
      const vanillaIsoPath = store.get("vanillaIsoPath");

      if (!vanillaIsoPath) {
        enqueueSnackbar("Please specify a vanilla iso in the settings!", {
          variant: "error",
        });
      } else if (!fs.existsSync(store.get("vanillaIsoPath"))) {
        enqueueSnackbar(
          "The specified vanilla iso doesn't exist anymore! Please choose one in the settings!",
          {
            variant: "error",
          }
        );
      }
    }
  }, [enqueueSnackbar, history]);

  return (
    <Box className={classes.root}>
      <Grid container direction="column" justify="center" alignItems="center">
        <Settings open={settingsOpen} setOpen={setSettingsOpen} />
        <Grow in mountOnEnter unmountOnExit>
          <Grid item>
            <BuildCardGrid setUpdating={setUpdating} />
          </Grid>
        </Grow>
        <Grid item>
          <Grow in mountOnEnter unmountOnExit>
            <Box
              className={classes.settingsFab}
              onClick={() => setSettingsOpen(true)}
            >
              <Fab color="primary">
                <SettingsIcon />
              </Fab>
            </Box>
          </Grow>
        </Grid>
        <Grid item>
          <Grow in mountOnEnter unmountOnExit>
            <Fab
              className={classes.fab}
              disabled={isUpdating}
              color="primary"
              onClick={() => history.push("/setup")}
            >
              <AddIcon />
            </Fab>
          </Grow>
        </Grid>
      </Grid>
    </Box>
  );
}
