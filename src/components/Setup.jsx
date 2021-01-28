import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { CircularProgress, setRef } from '@material-ui/core';

import FileSelector from './FileSelector';
import DirSelector from './DirectorySelector';
import useSetupStore from '../SetupStore';
import md5File from 'md5-file';

const validMD5Hashes = [
  "0e63d4223b01d9aba596259dc155a174"
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    textAlign: 'center'
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  stepper: {
    backgroundColor: "transparent"
  },
  navigationButtons: {
    marginTop: "5em"
  },
}));

function getSteps() {
  return ['Set SSBM iso', 'Set iso folder', 'Finish setup'];
}

function validateStep(stepIndex, state) {
  switch(stepIndex) {
    case 0:
      if (state.isoFile === undefined)
        return false;
      return md5File(state.isoFile.path).then(received => {
        if (validMD5Hashes.includes(received)) {
          return;
        } else {
          return Promise.reject("This ISO will most likely not work with Akaneia! Try getting a valid one! NTSC-U 1.02");
        }
      });
    default:
      return undefined;
  }
};

const StepContent = ({ stepIndex }) => {
  const isoFile = useSetupStore(state => state.isoFile);
  const setIsoFile = useSetupStore(state => state.setIsoFile);
  const destFolder = useSetupStore(state => state.destFolder);
  const setDestFolder = useSetupStore(state => state.setDestFolder);
  switch (stepIndex) {
    case 0:
      return (
        <FileSelector
          accept=".iso"
          placeholder="Select a vanilla SSBM iso"
          key="0"
          file={isoFile}
          setFile={setIsoFile}
        />
      );
    case 1:
      return (
        <DirSelector
          placeholder="Select your iso folder"
          key="1"
          directory={destFolder}
          setDirectory={setDestFolder}
        />
      );
    case 2:
      return 'This is the bit I really care about!';
    default:
      return 'Unknown stepIndex';
  }
}

export default function HorizontalLabelPositionBelowStepper() {
  const classes = useStyles();
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState("");
  const [ activeStep, setActiveStep ] = useState(0);
  const steps = getSteps();
  const state = useSetupStore(state => state);

  const handleNext = () => {
    const result = validateStep(activeStep, state);
    if (result instanceof Promise) {
      setLoading(true);
      setError("");
      result.then(() => {
        setLoading(false);
        setActiveStep((step) => step + 1);
      }, (rejection) => {
        setLoading(false);
        setError(rejection);
      });
    } else {
      setActiveStep((step) => step + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((step) => step - 1);
  };
  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Stepper className={classes.stepper} activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel />
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>All steps completed</Typography>
            <Button onClick={handleReset}>Patch again</Button>
          </div>
        ) : (
          <div style={{textAlign: 'center'}}>
            <Typography className={classes.instructions}><StepContent stepIndex={activeStep} /></Typography>
            <div style={{color: 'red', fontSize: 14, marginTop: 20, marginBottom: -52}}>{error}</div>
            <div className={classes.navigationButtons}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.backButton}
              >
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext} disabled={loading}>
                {loading ? <CircularProgress size={24} color="black" /> : activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
