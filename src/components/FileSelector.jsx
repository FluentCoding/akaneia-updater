import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import InputBase from '@material-ui/core/InputBase';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

const useStyles = makeStyles((theme) => ({
  input: {
    display: 'none',
  },
  inputBase: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  fileInputField: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  navigationButtons: {
    marginTop: "5em"
  },
  fileSelectButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function FileSelector({accept, directory, multiple}) {
  const classes = useStyles();

  return (
    <Paper className={classes.fileInputField}>
      <InputBase 
        className={classes.inputBase}
        id="outlined-basic"
        placeholder="Path of iso"
        disabled
      />
      <Divider className={classes.divider} orientation="vertical"/>
      <input
        accept={accept}
        className={classes.input}
        id="contained-button-file"
        dir={directory}
        multiple={multiple}
        type="file"
      />
      <label htmlFor="contained-button-file">
      <IconButton className={classes.fileSelectButton} variant="contained" color="primary" component="span">
        <InsertDriveFileIcon />
      </IconButton>
      </label>
    </Paper>
  );
}