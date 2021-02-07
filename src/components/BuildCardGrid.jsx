import compareVersions from "compare-versions";
import fs from "fs";
import { useSnackbar } from "notistack";
import path from "path";

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import Badge from "@material-ui/core/Badge";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import UpdateIcon from "@material-ui/icons/Update";
import Pagination from "@material-ui/lab/Pagination";

import { fetchReleases } from "../util/GithubUtil";
import { patchROM } from "../util/PatchingUtil";
import store from "../util/config";

const MAX_SIZE = 3;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  card: {
    padding: "2px 4px",
    display: "inline-flex",
    alignItems: "center",
    width: 500,
  },
  button: {
    flex: "0 1",
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0",
    textAlign: "left",
    marginLeft: "1rem",
    fontSize: 19,
  },
  arrow: {
    verticalAlign: "text-top",
  },
  version: {
    marginInline: "0.5rem",
  },
  cover: {
    width: "3rem",
    height: "3rem",
    justifyContent: "center",
    alignItems: "center",
  },
  cardAction: {
    display: "block",
    textAlign: "initial",
  },
  pagination: {
    justifyContent: "center",
    alignSelf: "center",
    margin: "1rem",
    display: "inline-block",
  },
  loading: {
    height: "1rem",
  },
}));

export default function BuildCardGrid(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  var data = store.get("trackedIsos");
  const [trackedIsoStates, setTrackedIsoStates] = useState([]);
  const [open, setOpen] = useState(false);
  const [deletionIndex, setDeletionIndex] = useState(undefined);
  const [page, setPage] = useState(1);

  const handleClickOpen = (index) => {
    setDeletionIndex(index);
    setOpen(true);
  };

  const handleClose = (mode) => {
    setOpen(false);

    if (mode === "cancel") return;

    if (mode === "deleteFile") {
      var filePath = data[deletionIndex]?.destPath;
      if (filePath) {
        fs.unlink(filePath, (err) => {
          if (err) {
            enqueueSnackbar("Deleting the file failed!", {
              variant: "error",
            });
          } else {
            enqueueSnackbar("Deletion succeed!", {
              variant: "success",
            });
          }
        });
      }
    }

    data.splice(deletionIndex, 1);
    store.set("trackedIsos", data);

    if (!data.length) history.push("/setup");
    else {
      if (page > Math.ceil(data.length / MAX_SIZE)) setPage(page - 1);
      else forceUpdate();
    }
  };

  useEffect(() => {
    if (!loading) return;

    fetchReleases().then((result) => {
      setLoading(false);
      if (!result) {
        enqueueSnackbar("Connection failed!", {
          variant: "error",
        });
        return;
      }

      var trackedIsoStates = [];
      data?.forEach((trackedIso, i) => {
        var trackedIsoState = {};
        var asset = result.assets.find(
          (asset) => path.parse(asset.name).name === trackedIso.assetName
        );

        trackedIsoState.asset = {
          downloadUrl: asset ? asset.browser_download_url : undefined,
          name: trackedIso.assetName,
        };
        trackedIsoState.hasUpdate =
          asset && compareVersions(result.version, trackedIso.version) !== 0
            ? result.version
            : undefined;
        trackedIsoState.isUpdating = false;

        trackedIsoStates.push(trackedIsoState);
      });

      setTrackedIsoStates(trackedIsoStates);
    });
  }, [data, enqueueSnackbar, loading]);

  return (
    <>
      <Dialog
        open={open}
        onClose={() => handleClose("cancel")}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete entry</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to delete the patched file too?<br></br>
            {data && typeof data[deletionIndex] !== "undefined" && (
              <>
                Path: <i>{data[deletionIndex]?.destPath}</i>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Only delete entry
          </Button>
          <Button onClick={() => handleClose("deleteFile")} color="primary">
            Delete patched file too
          </Button>
          <Button onClick={() => handleClose("cancel")} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="stretch"
        spacing={2}
      >
        {data &&
          data.map((build, index) => {
            if (index < page * MAX_SIZE - MAX_SIZE || index >= page * MAX_SIZE)
              return undefined;

            return (
              <Grid item key={index}>
                <Paper className={classes.card} elevation={3}>
                  <Box className={classes.content}>
                    {build.name}
                    <Chip
                      className={classes.version}
                      color="default"
                      label={build.version}
                    />
                    {trackedIsoStates[index]?.hasUpdate && (
                      <ArrowRightAltIcon className={classes.arrow} />
                    )}
                    {trackedIsoStates[index]?.hasUpdate && (
                      <Chip
                        className={classes.version}
                        color="default"
                        label={trackedIsoStates[index]?.hasUpdate}
                      />
                    )}
                  </Box>
                  <Box className={classes.button}>
                    <IconButton
                      disabled={trackedIsoStates[index]?.isUpdating}
                      onClick={() => handleClickOpen(index)}
                    >
                      <DeleteIcon
                        color={
                          trackedIsoStates[index]?.isUpdating
                            ? "disabled"
                            : "error"
                        }
                      />
                    </IconButton>
                  </Box>
                  <IconButton
                    variant="contained"
                    color="inherit"
                    disabled={
                      !trackedIsoStates[index]?.hasUpdate ||
                      trackedIsoStates[index]?.isUpdating
                    }
                    onClick={() => {
                      if (trackedIsoStates[index]?.hasUpdate) {
                        const newTrackedIsoStates = trackedIsoStates;
                        props.setUpdating(true);
                        newTrackedIsoStates[index].isUpdating = true;
                        setTrackedIsoStates(newTrackedIsoStates);
                        forceUpdate();
                        const result = patchROM(
                          trackedIsoStates[index].asset,
                          undefined,
                          build.destPath,
                          trackedIsoStates[index].hasUpdate,
                          undefined,
                          store,
                          undefined,
                          undefined,
                          index
                        );
                        if (typeof result === "string") {
                          props.setUpdating(false);
                          newTrackedIsoStates[index].isUpdating = false;
                          newTrackedIsoStates[index].hasUpdate = undefined;
                          setTrackedIsoStates(newTrackedIsoStates);
                          forceUpdate();
                          return;
                        } else {
                          result.then(() => {
                            props.setUpdating(false);
                            newTrackedIsoStates[index].isUpdating = false;
                            newTrackedIsoStates[index].hasUpdate = undefined;
                            setTrackedIsoStates(newTrackedIsoStates);
                            forceUpdate();
                            build.version = trackedIsoStates[index].hasUpdate;
                          });
                        }
                      }
                    }}
                  >
                    {trackedIsoStates[index]?.isUpdating && (
                      <CircularProgress size={"1.36rem"} color="default" />
                    )}
                    {!trackedIsoStates[index]?.isUpdating && (
                      <Badge
                        color="error"
                        variant="dot"
                        invisible={!trackedIsoStates[index]?.hasUpdate}
                        showZero
                      >
                        <UpdateIcon />
                      </Badge>
                    )}
                  </IconButton>
                </Paper>
              </Grid>
            );
          })}
      </Grid>
      {data?.length > 3 && (
        <Pagination
          className={classes.pagination}
          disabled={data.length < MAX_SIZE}
          count={Math.ceil(data.length / MAX_SIZE)}
          page={page}
          onChange={(_ev, val) => setPage(val)}
        />
      )}
    </>
  );
}
