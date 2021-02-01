import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";
import SettingsIcon from "@material-ui/icons/Settings";
import { Link } from "react-router-dom";

import Logo from "../components/Logo";

export default function Home() {
  return (
    <Box>
      <Logo />
      <Link to="/settings">
        <Fab color="primary">
          <SettingsIcon />
        </Fab>
      </Link>
    </Box>
  );
}
