import { Grid, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import * as React from 'react';
import { useState } from 'react';
import UnitDetailProvider from '../components/UnitDetail';
import UnitList from '../components/UnitList';
import { UnitsContext } from '../context';
import { useTopics, useUnits } from '../hooks';
import { getAllUnitsForProject } from '../lib/client/unit';
import { getAllStacks } from '../lib/server/habit';
import { getAllTopics, getAllUnits } from '../lib/server/projects';
import { TODO } from '../lib/status';
import { DAYS } from '../lib/time';
import { HabitStack, HabitStackContainer } from './habits';

export default function Agenda({ unitsProp, topicsProp, stacks }) {
  const { units, updateUnits } = useUnits(unitsProp);
  const { topics } = useTopics(topicsProp);

  const todayFilter = (unit) => {
    if (unit.status !== TODO) {
      return false;
    }
    return (
      !!unit.dueDate &&
      dayjs.unix(unit.dueDate).isBefore(dayjs().add(1, 'day'), 'day')
    );
  };

  const stacksFiltered = Object.values(stacks).filter((stack) => {
    return (
      stack.schedule.includes(DAYS[dayjs().day()]) ||
      stack.schedule.includes('ALL')
    );
  });

  return (
    <UnitsContext.Provider value={{ units, updateUnits }}>
      <Stack
        component="main"
        spacing={2}
        sx={{
          display: 'flex',
          width: 1200,
          justifyContent: 'center',
        }}
      >
        <Typography variant={'h5'}>Agenda</Typography>
        <UnitDetailProvider topics={topics}>
          <UnitList filterFn={todayFilter} units={units} />
        </UnitDetailProvider>

        {/* <Grid container>
        {stacksFiltered.map(({ id }) => (
          <Grid item key={id} xs={4}>
            <HabitStackContainer
              id={id}
              stacks={stacks}
              habits={units}
              updateHabits={updateUnits}
              topics={topicsProp}
              onCancel={() => {}}
            />
          </Grid>
        ))}
      </Grid> */}
      </Stack>
    </UnitsContext.Provider>
  );
}

export const getServerSideProps = async () => {
  const units = await getAllUnits();
  const topics = await getAllTopics();
  const stacks = await getAllStacks();

  return {
    props: {
      unitsProp: units,
      topicsProp: topics,
      stacksProp: stacks,
    },
  };
};
