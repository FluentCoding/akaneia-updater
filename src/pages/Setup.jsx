import fs from "fs";
import md5File from "md5-file";
import { useSnackbar } from "notistack";

import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grow from "@material-ui/core/Grow";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import useSetupStore from "../SetupStore";
import patchRom from "../actions/patchRom";
import FileSelector from "../components/FileSelector";
import Updater from "../components/Updater";
import store from "../util/config";

const validMD5Hashes = ["0e63d4223b01d9aba596259dc155a174"];
const invalidMD5 =
  "This ISO will most likely not work with Akaneia! Try getting a valid one! NTSC-U 1.02";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    textAlign: "center",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  stepper: {
    backgroundColor: "transparent",
  },
  navigationButtons: {
    marginTop: "5em",
  },
}));

function validateStep(
  stepIndex,
  isoFile,
  destFile,
  asset,
  version,
  clear,
  enqueueSnackbar,
  closeSnackbar
) {
  switch (stepIndex) {
    case 0:
      if (!isoFile) return "Error";
      return md5File(isoFile).then((received) => {
        if (validMD5Hashes.includes(received)) {
          store.set("vanillaIsoPath", isoFile);
          return;
        } else {
          return Promise.reject(invalidMD5);
        }
      });
    case 1:
      if (!destFile) return "Error";

      // check if dest path is already used by other tracked isos
      if (
        store.has("trackedIsos") &&
        store
          .get("trackedIsos")
          .find((trackedIso) => destFile === trackedIso.destPath)
      ) {
        return "You're already using this ISO for tracking!";
      }

      return;
    case 2:
      if (!fs.existsSync(isoFile ?? store.get("vanillaIsoPath"))) {
        return "Your game file doesn't exist anymore!";
      }

      return patchRom(
        asset,
        isoFile,
        destFile,
        version,
        clear,
        store,
        enqueueSnackbar,
        closeSnackbar
      );
    default:
      return undefined;
  }
}

const StepContent = ({ stepIndex }) => {
  const [isoFile, setIsoFile] = [
    useSetupStore((state) => state.isoFile),
    useSetupStore((state) => state.setIsoFile),
  ];
  const [destFile, setDestFile] = [
    useSetupStore((state) => state.destFile),
    useSetupStore((state) => state.setDestFile),
  ];
  const [selectedAsset, setSelectedAsset] = [
    useSetupStore((state) => state.selectedAsset),
    useSetupStore((state) => state.setSelectedAsset),
  ];
  const setDisabledNext = useSetupStore((state) => state.setDisabledNext);
  switch (stepIndex) {
    case 0:
      !isoFile && setIsoFile(store.get("vanillaIsoPath"));
      setDisabledNext(isoFile === undefined);
      return (
        <FileSelector
          accept=".iso"
          placeholder="Select an unmodified SSBM iso"
          key="0"
          id="0"
          file={isoFile ?? store.get("vanillaIsoPath")}
          setFile={setIsoFile}
        />
      );
    case 1:
      setDisabledNext(destFile === undefined);
      return (
        <FileSelector
          placeholder="Specify the save path"
          key="1"
          id="1"
          save
          name={"Gamecube Game Image"}
          extensions={["iso"]}
          file={destFile}
          setFile={setDestFile}
        />
      );
    case 2:
      setDisabledNext(selectedAsset === undefined);
      return (
        <Updater
          selectedAsset={selectedAsset}
          setSelectedAsset={setSelectedAsset}
        />
      );
    default:
      return "Unknown stepIndex";
  }
};

export default function Setup() {
  const classes = useStyles();
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = [
    useSetupStore((state) => state.loading),
    useSetupStore((state) => state.setLoading),
  ];
  const isoFile = useSetupStore((state) => state.isoFile);
  const destFile = useSetupStore((state) => state.destFile);
  const version = useSetupStore((state) => state.version);
  const clear = useSetupStore((state) => state.clear);
  const selectedAsset = useSetupStore((state) => state.selectedAsset);
  const disabledNext = useSetupStore((state) => state.disabledNext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const steps = 3;

  const history = useHistory();

  const handleNext = () => {
    const result = validateStep(
      activeStep,
      isoFile,
      destFile,
      selectedAsset,
      version,
      clear,
      enqueueSnackbar,
      closeSnackbar
    );
    if (result instanceof Promise) {
      setLoading(true);
      setError("");
      result.then(
        () => {
          setLoading(false);
          if (activeStep === 2) {
            history.push("/");
          } else {
            setActiveStep((step) => step + 1);
          }
        },
        (rejection) => {
          setLoading(false);
          setError(typeof rejection === "string" ? rejection : "Error");
        }
      );
    } else {
      if (!result) {
        setError("");
        if (activeStep === 2) {
          history.push("/");
        } else {
          setActiveStep((step) => step + 1);
        }
      } else {
        setError(result);
      }
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
      clear();
      history.push("/");
    } else {
      setError("");
      setActiveStep((step) => step - 1);
    }
  };
  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box className={classes.root}>
      <Stepper
        className={classes.stepper}
        activeStep={activeStep}
        alternativeLabel
      >
        {[...Array(steps).keys()].map((label) => (
          <Step key={label}>
            <StepLabel />
          </Step>
        ))}
      </Stepper>
      <Box>
        {activeStep === steps.length ? (
          <Box>
            <Typography className={classes.instructions}>
              All steps completed
            </Typography>
            <Button onClick={handleReset}>Patch again</Button>
          </Box>
        ) : (
          <Box style={{ textAlign: "center" }}>
            <Typography className={classes.instructions}>
              <StepContent stepIndex={activeStep} />
            </Typography>
            <Box
              style={{
                color: "#ff0033",
                fontSize: 14,
                marginTop: 20,
                marginBottom: error ? -60 : -50,
              }}
            >
              {error}
            </Box>
            <Grow in mountOnEnter unmountOnExit>
              <Box className={classes.navigationButtons}>
                <Button
                  onClick={handleBack}
                  className={classes.backButton}
                  disabled={
                    loading ||
                    (activeStep === 0 && !store.get("trackedIsos")?.length)
                  }
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={loading || disabledNext}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : activeStep === steps.length - 1 ? (
                    "Finish"
                  ) : (
                    "Next"
                  )}
                </Button>
              </Box>
            </Grow>
          </Box>
        )}
      </Box>
    </Box>
  );
}
