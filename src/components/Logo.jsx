import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

import logo from "../static/logo.svg";

const useStyles = makeStyles(() => ({
  logo: {
    height: "12rem",
    pointerEvents: "none",
    margin: "2rem",
  },
}));

export default function Logo() {
  const classes = useStyles();

  return (
    <Box>
      <img src={logo} alt="logo" className={classes.logo} />
    </Box>
  );
}
