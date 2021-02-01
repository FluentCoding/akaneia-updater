import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/styles/makeStyles";

import logo from "../static/logo.svg";

const useStyles = makeStyles(() => ({
  logo: {
    height: "13rem",
    pointerEvents: "none",
    margin: "3rem",
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
