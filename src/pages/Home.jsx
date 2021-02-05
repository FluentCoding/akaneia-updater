import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import SettingsIcon from "@material-ui/icons/Settings";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grow from "@material-ui/core/Grow";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import store from "../util/config";
import fs from "fs";

import Settings from "../components/Settings";
import Logo from "../components/Logo";
import BuildCardGrid from "../components/BuildCardGrid";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(5),
    right: theme.spacing(5),
  },
  settingsFab: {
    position: "absolute",
    bottom: theme.spacing(5),
    left: theme.spacing(5),
  },
  setupButton: {
    textDecoration: "none",
    color: "black",
  },
}));

export default function Home() {
  const history = useHistory();
  if (!store.get("trackedIsos")?.length) history.push("/setup");

  const classes = useStyles();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const vanillaIsoPath = store.get("vanillaIsoPath");

    if (!vanillaIsoPath) {
      enqueueSnackbar("Please specify a vanilla iso in the settings!", {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "top" },
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
  }, []);

  return (
    <Box className={classes.root}>
      <Settings open={settingsOpen} setOpen={setSettingsOpen} />
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item>
          <Logo />
        </Grid>
        <Grow in mountOnEnter unmountOnExit>
          <Grid item>
            <BuildCardGrid />
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
            <Link to="/setup" className={classes.fab}>
              <Fab color="primary">
                <AddIcon />
              </Fab>
            </Link>
          </Grow>
        </Grid>
      </Grid>
    </Box>
  );
}
