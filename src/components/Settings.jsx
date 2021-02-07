import { Button } from "@material-ui/core";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";

import store from "../util/config";
import FileSelector from "./FileSelector";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const Settings = (props) => {
  const classes = useStyles();
  return (
    <Dialog
      className={classes.root}
      open={props.open}
      onClose={() => props.setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Settings</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Path of your unmodified SSBM iso:
        </DialogContentText>
        <FileSelector
          accept=".iso"
          placeholder="Select an unmodified SSBM iso"
          variant="outlined"
          key="0"
          id="0"
          file={store.get("vanillaIsoPath")}
          setFile={(val) => store.set("vanillaIsoPath", val)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.setOpen(false)} color="primary" autoFocus>
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Settings;
