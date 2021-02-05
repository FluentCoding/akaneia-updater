import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import store from '../util/config';

import BuildCardGrid from "../components/BuildCardGrid";

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
  const history = useHistory();

  if (!store.get("trackedIsos").length)
    history.push("/setup");
  return (
    <Box className={classes.root}>
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item>
          <h1>Akaneia Updater</h1>
        </Grid>
        <Grid item>
          <h3>Your builds:</h3>
        </Grid>
        <Grid item>
          <BuildCardGrid />
        </Grid>
        <Grid item>
          <Link to="/setup" className={classes.fab}>
            <Fab color="primary">
              <AddIcon />
            </Fab>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
}
