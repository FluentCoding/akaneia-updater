import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";
import HomeIcon from "@material-ui/icons/Home";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";

import Logo from "../components/Logo";
import FileSelector from "../components/FileSelector";
import useSetupStore from "../SetupStore";

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
}));

export default function Settings() {
  const classes = useStyles();

  const isoFile = useSetupStore((state) => state.isoFile);
  const setIsoFile = useSetupStore((state) => state.setIsoFile);

  return (
    <Box className={classes.root}>
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item>
          <Logo />
        </Grid>
        <Grid item>
          <FileSelector
            accept=".iso"
            placeholder="Path of your unmodified SSBM iso"
            key="0"
            file={isoFile}
            setFile={setIsoFile}
          />
        </Grid>
        <Grid item>
          <Link className={classes.fab} to="/">
            <Fab color="primary">
              <HomeIcon />
            </Fab>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
}
