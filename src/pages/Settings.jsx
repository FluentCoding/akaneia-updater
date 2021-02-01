import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";
import HomeIcon from "@material-ui/icons/Home";
import { Link } from "react-router-dom";

import Logo from "../components/Logo";
import FileSelector from "../components/FileSelector";
import useSetupStore from "../SetupStore";

export default function Settings() {
  const isoFile = useSetupStore((state) => state.isoFile);
  const setIsoFile = useSetupStore((state) => state.setIsoFile);
  const destFolder = useSetupStore((state) => state.destFolder);
  const setDestFolder = useSetupStore((state) => state.setDestFolder);

  return (
    <Box style={{textAlign: 'center', width: '100%'}}>
      <Logo />
      <FileSelector
        accept=".iso"
        placeholder="Select a vanilla SSBM iso"
        key="0"
        file={isoFile}
        setFile={setIsoFile}
      />
      <FileSelector
        placeholder="Select your iso folder"
        key="1"
        directory
        file={destFolder}
        setFile={setDestFolder}
      />
      <Link to="/">
        <Fab color="primary">
          <HomeIcon />
        </Fab>
      </Link>
    </Box>
  );
}
