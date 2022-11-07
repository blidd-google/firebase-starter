import {
  Box,
  Button,
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
import { BACKLOG, COMPLETE, INPROGRESS, TODO } from '../lib/status';
import UnitList from '../components/UnitList';
import { getAllUnitsForProject } from '../lib/client/unit';
import UnitDetailProvider from '../components/UnitDetail';
import { accumulateUnitMinutes, formatTimeEstimate } from '../lib/time';

import Link from 'next/link';

const steps = ['review', 'sketch', 'adjust'];

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
    setActiveStep(0);
  };

  // const handleReset = () => {
  //   setActiveStep(0);
  // };

  return (
    <Stack
      component="main"
      spacing={2}
      sx={{
        display: 'flex',
        width: 1200,
        justifyContent: 'center',
      }}
    >
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

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {activeStep > 0 ? (
          <Button onClick={handleBack} variant="outlined">
            Prev
          </Button>
        ) : (
          <Box />
        )}
        {activeStep < steps.length - 1 ? (
          <Button onClick={handleNext} variant="outlined">
            Next
          </Button>
        ) : (
          <Link href={'/projects/all'} passHref>
            <Button onClick={handleFinish} variant="contained">
              Finish
            </Button>
          </Link>
        )}
      </Box>

      {activeStep === 0 && (
        <Review units={units} topics={topics} updateUnits={updateUnits} />
      )}

      {activeStep === 1 && (
        <Sketch units={units} topics={topics} updateUnits={updateUnits} />
      )}

      {activeStep === 2 && <Adjust />}
    </Stack>
  );
}

const Review = ({ units, topics, updateUnits }) => {
  const overdueFilter = (unit) => {
    if (unit.dueDate === null) {
      return false;
    }
    if (unit.status === COMPLETE) {
      return false;
    }
    return dayjs.unix(unit.dueDate).isBefore(dayjs(), 'day');
  };

  const blockedFilter = (unit) => {
    return unit.status === INPROGRESS;
  };

  return (
    <Box>
      <Grid container>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant={'h5'}>Review</Typography>
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant={'body'}>
            Reschedule overdue work and handle blocked tasks.
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant={'h6'}>Overdue</Typography>
          <UnitDetailProvider
            units={units}
            topics={topics}
            updateUnits={updateUnits}
          >
            <UnitList
              projectId=""
              filterFn={overdueFilter}
              units={units}
              topics={topics}
              update={updateUnits}
            />
          </UnitDetailProvider>
        </Grid>

        <Grid item xs={6}>
          <Typography variant={'h6'}>Blocked</Typography>
          <UnitDetailProvider
            units={units}
            topics={topics}
            updateUnits={updateUnits}
          >
            <UnitList
              projectId=""
              filterFn={blockedFilter}
              units={units}
              topics={topics}
              update={updateUnits}
            />
          </UnitDetailProvider>
        </Grid>
      </Grid>
    </Box>
  );
};

const Sketch = ({ units, topics, updateUnits }) => {
  const backlogFilter = (unit) => {
    return unit.status === BACKLOG;
  };

  const recentFilter = (unit) => {
    return (
      unit.status === COMPLETE &&
      dayjs.unix(unit.dueDate).isAfter(dayjs().subtract(7, 'day'), 'day')
    );
  };

  const todayFilter = (unit) => {
    if (unit.status !== TODO) {
      return false;
    }
    return (
      !!unit.dueDate &&
      dayjs.unix(unit.dueDate).isBefore(dayjs().add(1, 'day'), 'day')
    );
  };

  const estimate = formatTimeEstimate(
    accumulateUnitMinutes(Object.values(units).filter(todayFilter), 0),
  );

  return (
    <Box>
      <Grid container>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant={'h5'}>Sketch</Typography>
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant={'body'}>
            Sketch out your plan for today.
          </Typography>
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant={'body'}>Total: {estimate}</Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography variant={'h6'}>Backlog</Typography>
          <UnitDetailProvider
            units={units}
            topics={topics}
            updateUnits={updateUnits}
          >
            <UnitList
              projectId=""
              filterFn={backlogFilter}
              units={units}
              topics={topics}
              update={updateUnits}
            />
          </UnitDetailProvider>
        </Grid>

        <Grid item xs={4}>
          <Typography variant={'h6'}>Recently Completed</Typography>
          <UnitDetailProvider
            units={units}
            topics={topics}
            updateUnits={updateUnits}
          >
            <UnitList
              projectId=""
              status={TODO}
              filterFn={recentFilter}
              units={units}
              topics={topics}
              update={updateUnits}
            />
          </UnitDetailProvider>
        </Grid>

        <Grid item xs={4}>
          <Typography variant={'h6'}>Today</Typography>
          <UnitDetailProvider
            units={units}
            topics={topics}
            updateUnits={updateUnits}
          >
            <UnitList
              projectId=""
              status={TODO}
              filterFn={todayFilter}
              units={units}
              topics={topics}
              update={updateUnits}
            />
          </UnitDetailProvider>
        </Grid>
      </Grid>
    </Box>
  );
};

const Adjust = () => {};

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
