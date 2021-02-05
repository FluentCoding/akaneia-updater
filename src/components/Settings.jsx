import store from "../util/config";
import FileSelector from "./FileSelector";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Button } from "@material-ui/core";

export default (props) => {
  return (
    <Dialog
      open={props.open}
      onClose={() => props.setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Settings</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Vanilla ISO Path:
          <FileSelector
            accept=".iso"
            placeholder="Select an unmodified SSBM iso"
            key="0"
            file={store.get("vanillaIsoPath")}
            setFile={(val) => store.set("vanillaIsoPath", val)}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.setOpen(false)} color="primary" autoFocus>
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
};
