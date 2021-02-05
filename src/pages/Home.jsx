import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grow from "@material-ui/core/Grow";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import store from "../util/config";

import BuildCardGrid from "../components/BuildCardGrid";
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
  const history = useHistory();

  if (!store.get("trackedIsos")) history.push("/setup");
  return (
    <Box className={classes.root}>
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item>
          <Logo />
        </Grid>
        <Grid item>
          <h3>Your builds:</h3>
        </Grid>
        <Grow in mountOnEnter unmountOnExit>
          <Grid item>
            <BuildCardGrid />
          </Grid>
        </Grow>
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
