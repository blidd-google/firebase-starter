import { Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import * as React from 'react';
import { useState } from 'react';
import UnitDetailProvider from '../components/UnitDetail';
import UnitList from '../components/UnitList';
import { getAllUnitsForProject } from '../lib/client/unit';
import { getAllTopics, getAllUnits } from '../lib/server/projects';
import { TODO } from '../lib/status';

export default function Agenda({ unitsProp, topicsProp }) {
  const [units, setUnits] = useState(unitsProp);
  const [topics, setTopics] = useState(topicsProp);

  const todayFilter = (unit) => {
    if (unit.status !== TODO) {
      return false;
    }
    return (
      !!unit.dueDate &&
      dayjs.unix(unit.dueDate).isBefore(dayjs().add(1, 'day'), 'day')
    );
  };

  const updateUnits = async () => {
    setUnits(await getAllUnitsForProject(''));
  };

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
      <Typography variant={'h5'}>Agenda</Typography>
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
    </Stack>
  );
}

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
