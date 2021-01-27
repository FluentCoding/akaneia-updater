import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import Paper from '@material-ui/core/Paper';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

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
  input: {
    display: 'none',
  },
  inputBase: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  fileInputField: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  stepper: {
    backgroundColor: "transparent"
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

function getSteps() {
  return ['Set SSBM iso', 'Set iso folder', 'Finish setup'];
}

function getStepContent(stepIndex, classes) {
  switch (stepIndex) {
    case 0:
      return (
        <Paper className={classes.fileInputField}>
          <InputBase 
            className={classes.inputBase}
            id="outlined-basic"
            placeholder="Path of iso"
            disabled
          />
          <Divider className={classes.divider} orientation="vertical"/>
          <input
            accept=".iso"
            className={classes.input}
            id="contained-button-file"
            multiple
            type="file"
          />
          <label htmlFor="contained-button-file">
            <IconButton className={classes.fileSelectButton} variant="contained" color="primary" component="span">
              <InsertDriveFileIcon />
            </IconButton>
          </label>
        </Paper>
      );
    case 1:
      return (
        <InputBase id="outlined-basic" label="Path of iso folder" variant="outlined"/>
      );
    case 2:
      return 'This is the bit I really care about!';
    default:
      return 'Unknown stepIndex';
  }
}

export default function HorizontalLabelPositionBelowStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
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
            <Typography className={classes.instructions}>{getStepContent(activeStep, classes)}</Typography>
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
