import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { CircularProgress } from '@material-ui/core';

import FileSelector from './FileSelector';
import useSetupStore from '../SetupStore';
import md5File from 'md5-file';

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
      return md5File(state.isoFile.path);
  }
};

const StepContent = ({ stepIndex }) => {
  const isoFile = useSetupStore(state => state.isoFile);
  const setIsoFile = useSetupStore(state => state.setIsoFile);
  const destPath = useSetupStore(state => state.destPath);
  const setDestPath = useSetupStore(state => state.setDestPath);
  switch (stepIndex) {
    case 0:
      return (
        <FileSelector
          accept=".iso"
          placeholder="Path of vanilla iso"
          key="0"
          file={isoFile}
          setFile={setIsoFile}
        />
      );
    case 1:
      return (
        <FileSelector
          placeholder="Path of your iso folder"
          directory
          key="1"
          file={destPath}
          setFile={setDestPath}
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
      result.then((promiseResult) => {
        setLoading(false);
        if (!promiseResult) {
          setActiveStep((step) => step + 1);
        } else {
          setError(promiseResult);
        }
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
            <StepLabel></StepLabel>
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
          <div>
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
              <Button variant="contained" color="primary" onClick={handleNext}>
                {loading ? <CircularProgress size={24} color="black" /> : activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
