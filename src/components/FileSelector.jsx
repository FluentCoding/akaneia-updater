import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import InputBase from '@material-ui/core/InputBase';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import Folder from '@material-ui/icons/Folder';
import useSetupStore from '../SetupStore'

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
    display: 'inline-flex',
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

export default function FileSelector({accept, placeholder, directory, multiple, file, setFile, key}) {
  const [ path, setPath ] = useState(directory ? file : file?.name); // duplicate for rerender
  const loading = useSetupStore(store => store.loading);
  const selectFile = (e) => {
    var value = e.target.files[0];
    setPath(value.name);
    setFile(value);
  };
  
  const classes = useStyles();

  useEffect(() => {
    if (directory) {
      require('electron').ipcRenderer.on('dir-selected-' + key, (_event, args) => {
        var url = args[0];

        setFile(url);
        setPath(url);
      });
    }
  }, [directory, key, setFile]);

  return (
    <Paper className={classes.fileInputField}>
      <InputBase 
        className={classes.inputBase}
        id="outlined-basic"
        placeholder={placeholder}
        value={path}
        disabled
      />
      <Divider className={classes.divider} orientation="vertical" />
      <input
        accept={accept}
        className={classes.input}
        id={directory ? undefined : "contained-button-file"}
        multiple={multiple}
        onChange={directory ? undefined : selectFile}
        type="file"
      />
      <label htmlFor={loading ? "" : "contained-button-file"}>
        <IconButton className={classes.fileSelectButton} variant="contained" color="primary" component="span" onClick={() => {
          if (directory && !loading) {
            window.postMessage({
              type: 'select-dirs',
              key: key
            })
          }
          }}>
          {directory ? <Folder /> : <InsertDriveFileIcon />}
        </IconButton>
      </label>
    </Paper>
  );
}