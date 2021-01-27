import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import FileSelector from './FileSelector'

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

const StepContent = ({ stepIndex }) => {
  const [ isoPath, setIsoPath ] = useState("");
  const [ destFolder, setDestFolder ] = useState("");

  switch (stepIndex) {
    case 0:
      return (
        <FileSelector
          accept=".iso"
          placeholder="Path of vanilla iso"
          key="0"
          file={isoPath}
          setFile={setIsoPath}
        />
      );
    case 1:
      return (
        <FileSelector
          placeholder="Path of your iso folder"
          directory
          key="1"
          file={destFolder}
          setFile={setDestFolder}
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
  const [ activeStep, setActiveStep ] = useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}><StepContent stepIndex={activeStep} /></Typography>
            <div className={classes.navigationButtons}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.backButton}
              >
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
