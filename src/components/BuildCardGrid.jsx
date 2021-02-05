import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Delete from "@material-ui/icons/Delete";
import store from "../util/config";
import { Badge, Button, CircularProgress } from "@material-ui/core";
import { fetchReleases } from "../util/GithubUtil";
import { useState } from "react";
import compareVersions from "compare-versions";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import fs from "fs";
import path from "path";
import { useSnackbar } from "notistack";
import { patchROM } from "../util/PatchingUtil";

const useStyles = makeStyles(() => ({
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
  version: {
    fontSize: 16,
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
}));

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

export default function BuildCardGrid() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [loading, setLoading] = useState(true);

  var data = store.get("trackedIsos");
  const [trackedIsoStates, setTrackedIsoStates] = useState([]);
  const [open, setOpen] = useState(false);
  const [deletionIndex, setDeletionIndex] = useState(undefined);
  const isUpdating =
    trackedIsoStates.filter((build) => build.isUpdating).length > 0;
  const forceUpdate = useForceUpdate();

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
              anchorOrigin: { horizontal: "right", vertical: "top" },
            });
          } else {
            enqueueSnackbar("Deletion succeed!", {
              variant: "success",
              anchorOrigin: { horizontal: "right", vertical: "top" },
            });
          }
        });
      }
    }

    data.splice(deletionIndex, 1);
    store.set("trackedIsos", data);

    if (!data.length) history.push("/setup");
    else forceUpdate();
  };

  useEffect(() => {
    async function updateStore() {
      if (!loading) return;

      const result = await fetchReleases();

      data?.forEach((trackedIso, i) => {
        var trackedIsoState = {};
        var asset = result.assets.find(
          (asset) => path.parse(asset.name).name === trackedIso.assetName
        );
        trackedIsoState.asset = {
          downloadUrl: asset.browser_download_url,
          name: trackedIso.assetName,
        };
        trackedIsoState.hasUpdate =
          compareVersions(result.version, trackedIso.version) === 1
            ? result.version
            : undefined;
        trackedIsoState.isUpdating = false;

        setTrackedIsoStates(trackedIsoStates.concat([trackedIsoState]));
      });

      setLoading(false);
    }
    updateStore();
  }, [data, loading, trackedIsoStates]);

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
          !loading &&
          data.map((build, index) => {
            return (
              <Grid item>
                <Paper className={classes.card} elevation={3}>
                  <Box className={classes.content}>
                    <Box>{build?.name}</Box>
                    <Box className={classes.version} color="text.secondary">
                      {build.version}
                    </Box>
                  </Box>
                  <Box className={classes.button}>
                    <IconButton disabled={trackedIsoStates[index]?.isUpdating} onClick={() => handleClickOpen(index)}>
                      <Delete color={trackedIsoStates[index]?.isUpdating ? "disabled" : "secondary"} />
                    </IconButton>
                  </Box>
                  <Badge
                    color="error"
                    badgeContent={trackedIsoStates[index]?.hasUpdate}
                    showZero
                  >
                    <Button
                      variant="contained"
                      color="secondary"
                      disabled={
                        !trackedIsoStates[index]?.hasUpdate ||
                        trackedIsoStates[index]?.isUpdating
                      }
                      style={{ marginLeft: 5, marginRight: 5 }}
                      onClick={() => {
                        if (trackedIsoStates[index]?.hasUpdate) {
                          const newTrackedIsoStates = trackedIsoStates;
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
                            newTrackedIsoStates[index].isUpdating = false;
                            newTrackedIsoStates[index].hasUpdate = undefined;
                            setTrackedIsoStates(newTrackedIsoStates);
                            forceUpdate();
                            return;
                          } else {
                            result.then(() => {
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
                      {isUpdating && (
                        <CircularProgress size={28} color="default" />
                      )}
                      {trackedIsoStates[index]?.hasUpdate &&
                        !trackedIsoStates[index]?.isUpdating &&
                        "Update"}
                      {!trackedIsoStates[index]?.hasUpdate &&
                        !trackedIsoStates[index]?.isUpdating &&
                        "No update available"}
                    </Button>
                  </Badge>
                </Paper>
              </Grid>
            );
          })}
      </Grid>
    </>
  );
}
