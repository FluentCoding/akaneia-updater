import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import SettingsIcon from "@material-ui/icons/Settings";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grow from "@material-ui/core/Grow";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import store from "../util/config";
import fs from "fs";

import Settings from "../components/Settings";
import Logo from "../components/Logo";
import BuildCardGrid from "../components/BuildCardGrid";

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
  const [updating, setUpdating] = useState(false);
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
            anchorOrigin: { horizontal: "right", vertical: "top" },
          }
        );
      }
    }
  }, []);

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
            <div
              className={classes.settingsFab}
              onClick={() => setSettingsOpen(true)}
            >
              <Fab color="primary">
                <SettingsIcon />
              </Fab>
            </div>
          </Grow>
        </Grid>
        <Grid item>
          <Grow in mountOnEnter unmountOnExit>
            <Fab
              className={classes.fab}
              disabled={updating}
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
