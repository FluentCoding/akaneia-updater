import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import InputBase from '@material-ui/core/InputBase';
import FolderIcon from '@material-ui/icons/Folder';
import path from 'path';

const useStyles = makeStyles((theme) => ({
  input: {
    display: 'none',
  },
  inputBase: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  directoryInputField: {
    padding: '2px 4px',
    display: 'inline-flex',
    alignItems: 'center',
    width: 400,
  },
  navigationButtons: {
    marginTop: "5em"
  },
  directorySelectButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));


export default function DirectorySelector({placeholder, directory, setDirectory}) {
  const [ inputPath, setInputPath ] = useState(directory); // DUPLICATE FOR RERENDER
  const selectDirectory = (e) => {
    setDirectory(e.target.files[0].webkitRelativePath.split(path.sep)[0]);
    setInputPath(e.target.files[0].webkitRelativePath.split(path.sep)[0]); // rerender
  };
  const classes = useStyles();

  return (
    <Paper className={classes.directoryInputField}>
      <InputBase 
        className={classes.inputBase}
        id="outlined-basic"
        placeholder={placeholder}
        value={inputPath}
        disabled
      />
      <Divider className={classes.divider} orientation="vertical" />
      <input
        className={classes.input}
        id="contained-button-file"
        type="file"
        webkitdirectory=""
        mozdirectory="" 
        msdirectory="" 
        odirectory=""
        directory=""
        multiple
        onChange={selectDirectory}
      />
      <label htmlFor="contained-button-file">
        <IconButton className={classes.dirSelectButton} variant="contained" color="primary" component="span">
          <FolderIcon />
        </IconButton>
      </label>
    </Paper>
  );
}