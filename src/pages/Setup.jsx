import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSnackbar } from "notistack";
import { patchROM } from "../util/PatchingUtil";

import FileSelector from "../components/FileSelector";
import useSetupStore from "../SetupStore";
import Updater from "../components/Updater";
import md5File from "md5-file";
import Logo from "../components/Logo";
import { useHistory } from "react-router-dom";
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

function getSteps() {
  return ["Set SSBM iso", "Set iso folder", "Finish setup"];
}

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
      return;
    case 2:
      return patchROM(
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
          file={isoFile}
          setFile={setIsoFile}
        />
      );
    case 1:
      setDisabledNext(destFile === undefined);
      return (
        <FileSelector
          placeholder="Specify the save path"
          key="1"
          save
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
  const steps = getSteps();
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
    <div className={classes.root}>
      <Logo />
      <Stepper
        className={classes.stepper}
        activeStep={activeStep}
        alternativeLabel
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel />
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed
            </Typography>
            <Button onClick={handleReset}>Patch again</Button>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <Typography className={classes.instructions}>
              <StepContent stepIndex={activeStep} />
            </Typography>
            <div
              style={{
                color: "#ff0033",
                fontSize: 14,
                marginTop: 20,
                marginBottom: error ? -60 : -50,
              }}
            >
              {error}
            </div>
            <div className={classes.navigationButtons}>
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
                  <CircularProgress size={24} color="black" />
                ) : activeStep === steps.length - 1 ? (
                  "Finish"
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
