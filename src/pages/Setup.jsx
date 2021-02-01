import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import FileSelector from "../components/FileSelector";
import useSetupStore from "../SetupStore";
import Updater from "../components/Updater";
import md5File from "md5-file";
import Logo from "../components/Logo";
import { useHistory } from 'react-router-dom';

const validMD5Hashes = ["0e63d4223b01d9aba596259dc155a174"];

const specifcyISO = "You have to specify an ISO!";
const specifcyDest = "You have to specify a destination folder!";
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

function validateStep(stepIndex, state) {
  switch (stepIndex) {
    case 0:
      if (!state.isoFile) return specifcyISO;
      return md5File(state.isoFile.path).then((received) => {
        if (validMD5Hashes.includes(received)) {
          return;
        } else {
          return Promise.reject(invalidMD5);
        }
      });
    case 1:
      if (!state.destFolder) return specifcyDest;
      else return;
    default:
      return undefined;
  }
}

const StepContent = ({ stepIndex }) => {
  const isoFile = useSetupStore((state) => state.isoFile);
  const setIsoFile = useSetupStore((state) => state.setIsoFile);
  const destFolder = useSetupStore((state) => state.destFolder);
  const setDestFolder = useSetupStore((state) => state.setDestFolder);
  switch (stepIndex) {
    case 0:
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
      return (
        <FileSelector
          placeholder="Select your iso folder"
          key="1"
          directory
          file={destFolder}
          setFile={setDestFolder}
        />
      );
    case 2:
      return <Updater />;
    default:
      return "Unknown stepIndex";
  }
};

export default function HorizontalLabelPositionBelowStepper() {
  const classes = useStyles();
  const [loading, setLoading] = [
    useSetupStore((state) => state.loading),
    useSetupStore((state) => state.setLoading),
  ];
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const state = useSetupStore((state) => state);
  const history = useHistory();

  const handleNext = () => {
    const result = validateStep(activeStep, state);
    if (result instanceof Promise) {
      setLoading(true);
      setError("");
      result.then(
        () => {
          setLoading(false);
          setActiveStep((step) => step + 1);
        },
        (rejection) => {
          setLoading(false);
          setError(rejection);
        }
      );
    } else {
      if (!result) {
        setError("");
        setActiveStep((step) => step + 1);
      } else {
        setError(result);
      }
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
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
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={loading}
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
