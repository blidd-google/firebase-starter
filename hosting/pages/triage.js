import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import { getAllTopics, getAllUnits } from '../lib/server/projects';
import * as dayjs from 'dayjs';
import { INPROGRESS } from '../lib/status';
import UnitList from '../components/UnitList';
import { getAllUnitsForProject } from '../lib/client/unit';
import UnitDetailProvider from '../components/UnitDetail';

const steps = ['review', 'adjust', 'schedule'];

export default function Triage({ unitsProp, topicsProp }) {
  const [units, setUnits] = useState(unitsProp);
  const [topics, setTopics] = useState(topicsProp);

  const [activeStep, setActiveStep] = useState(0);

  const updateUnits = async () => {
    setUnits(await getAllUnitsForProject(''));
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleFinish = () => {
    // redirect back to somewhere
  };

  // const handleReset = () => {
  //   setActiveStep(0);
  // };

  return (
    <Stack component='main' spacing={2} sx={{
      display: 'flex',
      minWidth: 1200,
      justifyContent: 'center',
    }}>
      <Box>
        <Typography variant={'h4'}>Triage</Typography>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>

      {activeStep === 0 &&
        <Review units={units} topics={topics} updateUnits={updateUnits} />
      }

      {activeStep === 1 &&
        <Adjust />
      }

      <Box sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        {activeStep > 0 ?
          <Button onClick={handleBack} variant="outlined">Prev</Button> :
          <Box />
        }
        {activeStep < steps.length - 1 ? (
          <Button onClick={handleNext} variant="outlined">Next</Button>
        ) : (
          <Button onClick={handleFinish} variant="contained">Finish</Button>
        )}
      </Box>

    </Stack>
  );
}

const Review = ({ units, topics, updateUnits }) => {
  // const overdue = Object.values(units).filter();
  // console.log('OVERDUE:', overdue);

  const overdueFilter = (unit) => {
    return dayjs.unix(unit.dueDate).isBefore(dayjs());
  };

  const blocked = Object.values(units).filter((unit) => {
    return unit.status === INPROGRESS;
  });

  return (
    <Box >

      <Grid container>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant={'h5'}>Review</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant={'h6'}>Overdue</Typography>
          <UnitDetailProvider
            units={units}
            topics={topics}
            updateUnits={updateUnits}
          >
            <UnitList
              projectId=''
              filterFn={overdueFilter}
              units={units}
              topics={topics}
              update={updateUnits}
            />
          </UnitDetailProvider>

          {/* {overdue.map(({ summary }, index) => (
            <Card key={index}>
              <Typography variant='body'>{summary}</Typography>
            </Card>
          ))} */}
        </Grid>

        <Grid item xs={6}>
          <Typography variant={'h6'}>Blocked</Typography>
          {blocked.map(({ summary }, index) => (
            <Card key={index}>
              <Typography variant='body'>{summary}</Typography>
            </Card>
          ))}
        </Grid>

      </Grid>
    </Box>
  );
};

const Adjust = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Typography variant={'h6'}>Adjust</Typography>
    </Box>
  );
};

export const getServerSideProps = async () => {
  const units = await getAllUnits();
  const topics = await getAllTopics();

  return {
    props: {
      unitsProp: units,
      topicsProp: topics,
    },
  };
};
