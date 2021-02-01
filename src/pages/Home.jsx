import { Button } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";
import SettingsIcon from "@material-ui/icons/Settings";
import { Link } from "react-router-dom";

import Logo from "../components/Logo";

export default function Home() {
  return (
    <Box style={{ textAlign: "center", width: "100%" }}>
      <Logo />
      <Link
        to="/setup"
        style={{ textDecoration: "none", color: "black", marginRight: 20 }}
      >
        <Button variant="contained" color="primary">
          Setup
        </Button>
      </Link>
      <Link to="/settings">
        <Fab color="primary">
          <SettingsIcon />
        </Fab>
      </Link>
    </Box>
  );
}
