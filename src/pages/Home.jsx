import { Button } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";
import SettingsIcon from "@material-ui/icons/Settings";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Link } from "react-router-dom";

import Logo from "../components/Logo";

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
  setupButton: {
    textDecoration: "none",
    color: "black",
  },
}));

export default function Home() {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item>
          <Logo />
        </Grid>
        <Grid item>
          <Link className={classes.setupButton} to="/setup">
            <Button variant="contained" color="primary">
              SETUP
            </Button>
          </Link>
        </Grid>
        <Grid item>
          <Link to="/settings" className={classes.fab}>
            <Fab color="primary">
              <SettingsIcon />
            </Fab>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
}
