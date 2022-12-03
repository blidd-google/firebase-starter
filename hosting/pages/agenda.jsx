import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import * as React from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { HabitStack } from '../components/habit';
import UnitDetailProvider from '../components/UnitDetail';
import UnitList from '../components/UnitList';
import { TopicsContext, UnitsContext } from '../context';
import { useTopics, useUnits } from '../hooks';
import { TODO } from '../lib/constants';
import {
  applyFiltersToUnits,
  statusFilterFactory,
  timeFilterFactory,
} from '../lib/filters';
import { getAllStacks } from '../lib/server/habit';
import { getAllTopics, getAllUnits } from '../lib/server/projects';
import { DAYS, formatTimeEstimate } from '../lib/time';

export default function Agenda({ unitsProp, topicsProp, stacksProp }) {
  const { units, updateUnits } = useUnits(unitsProp);
  const { topics } = useTopics(topicsProp);

  const stacksFiltered = Object.values(stacksProp).filter((stack) => {
    return (
      stack.schedule.includes(DAYS[dayjs().day()]) ||
      stack.schedule.includes('ALL')
    );
  });

  return (
    <UnitsContext.Provider value={{ units, updateUnits }}>
      <TopicsContext.Provider value={topics}>
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

          <Grid container>
            {stacksFiltered.map(({ id }) => (
              <Grid item key={id} xs={4}>
                <Box
                  sx={{
                    margin: 2,
                    padding: 2,
                    bgcolor: 'background.secondary',
                  }}
                >
                  <Typography variant="body">
                    cue: {stacksProp[id].cue}
                  </Typography>
                  <UnitDetailProvider>
                    <HabitStack
                      id={id}
                      stackHabitIDs={stacksProp[id].habitIDs}
                      droppable={false}
                    />
                  </UnitDetailProvider>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Workload />
        </Stack>
      </TopicsContext.Provider>
    </UnitsContext.Provider>
  );
}

// const todayFilter = (unit) => {
//   if (unit.status !== TODO) {
//     return false;
//   }
//   return (
//     !!unit.dueDate &&
//     dayjs.unix(unit.dueDate).isBefore(dayjs().add(1, 'day'), 'day')
//   );
// };

// const tomorrowFilter = (unit) => {
//   if (unit.status !== TODO) {
//     return false;
//   }
//   return (
//     !!unit.dueDate &&
//     dayjs.unix(unit.dueDate).isBefore(dayjs().add(2, 'day'), 'day')
//   );
// };

const Workload = () => {
  const { units } = useContext(UnitsContext);
  const [preview, setPreview] = useState(false);

  const filters = [statusFilterFactory(TODO)];
  if (preview) {
    filters.push(timeFilterFactory({ end: dayjs().add(1, 'day') }));
  } else {
    filters.push(timeFilterFactory({ end: dayjs() }));
  }

  const unitsFiltered = applyFiltersToUnits(units, filters);
  const timeEst = unitsFiltered.reduce((acc, curr) => acc + curr.timeEst, 0);

  return (
    <Box>
      <Button variant="outlined" onClick={() => setPreview(!preview)}>
        {!preview ? 'preview tomorrow' : 'back'}
      </Button>
      <Typography>Time Est: {formatTimeEstimate(timeEst)}</Typography>
      <UnitDetailProvider>
        <UnitList filters={filters} units={units} />
      </UnitDetailProvider>
    </Box>
  );
};

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
