import {
  Box,
  Button,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import * as React from 'react';
import { useState } from 'react';
import { getAllStacks } from '../../lib/server/habit';
import { DragDropContext, resetServerContext } from 'react-beautiful-dnd';
import { putStack } from '../../lib/client/stack';
import UnitDetailProvider from '../../components/UnitDetail';
import { createStack, getAllStacksFromClient } from '../../lib/client/unit';
import { getAllTopics, getAllUnits } from '../../lib/server/projects';
import { DAYS } from '../../lib/time';
import dayjs from 'dayjs';
import { HabitStackWithDnd } from '../../components/habit';
import {
  StackDisplayContext,
  TopicsContext,
  UnitsContext,
} from '../../context';
import { useUnits } from '../../hooks';
import { useRouter } from 'next/router';

export const Habits = ({ unitsProp, stacksProp, topicsProp }) => {
  const { units, updateUnits } = useUnits(unitsProp);
  const [stacks, setStacks] = useState(stacksProp);
  const [schedule, setSchedule] = useState(DAYS[dayjs().day()]);
  const [arrowsEnabled, setArrowsEnabled] = useState(true);

  const router = useRouter();

  const stacksFiltered = Object.values(stacks).filter((stack) => {
    if (schedule === 'ALL') {
      return true;
    }
    if (!stack.schedule) {
      return false;
    }
    return stack.schedule.includes(schedule) || stack.schedule.includes('ALL');
  });

  const onDragStart = () => {
    setArrowsEnabled(false);
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      setArrowsEnabled(true);
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      setArrowsEnabled(true);
      return;
    }
    const stack = stacks[source.droppableId];
    const reorderedIDs = Array.from(stack.habitIDs);
    reorderedIDs.splice(source.index, 1);
    reorderedIDs.splice(destination.index, 0, draggableId);
    const reorderedStack = {
      ...stack,
      habitIDs: reorderedIDs,
    };
    setStacks({
      ...stacks,
      [stack.id]: reorderedStack,
    });
    setArrowsEnabled(true);
    await putStack(reorderedStack);
  };

  const handleChangeSchedule = (event) => {
    setSchedule(event.target.value);
  };

  const handleNewStack = async () => {
    const id = await createStack({
      title: '[title]',
      cue: '[cue]',
      schedule: [schedule],
      habitIDs: [],
    });
    setStacks(await getAllStacksFromClient());
    router.push(`/habits/${id}`);
  };

  return (
    <UnitsContext.Provider value={{ units, updateUnits }}>
      <TopicsContext.Provider value={topicsProp}>
        <Stack
          component="main"
          sx={{
            display: 'flex',
            width: 1200,
            justifyContent: 'center',
          }}
        >
          <Typography variant="h2">Habits</Typography>
          <ToggleButtonGroup
            exclusive
            name="schedule"
            value={schedule}
            onChange={handleChangeSchedule}
          >
            {['M', 'T', 'W', 'TH', 'F', 'SA', 'SU', 'ALL'].map((day, index) => (
              <ToggleButton key={index} name="schedule" value={day}>
                {day}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Grid container>
            {stacksFiltered.map(({ id }) => (
              <Grid item key={id} xs={4}>
                <DragDropContext
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                >
                  <StackDisplayContext.Provider value={arrowsEnabled}>
                    <HabitStackContainer id={id} stacks={stacks} />
                  </StackDisplayContext.Provider>
                </DragDropContext>
              </Grid>
            ))}
            <Grid item xs={4}>
              <Button
                variant="outlined"
                endIcon={<AddIcon />}
                sx={{ margin: 2 }}
                onClick={handleNewStack}
              >
                New Stack
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </TopicsContext.Provider>
    </UnitsContext.Provider>
  );
};

export const HabitStackContainer = ({ id, stacks }) => {
  const router = useRouter();
  return (
    <Box sx={{ margin: 2, padding: 2, bgcolor: 'background.secondary' }}>
      <Typography variant="h6">{stacks[id].title}</Typography>
      <Typography variant="body">cue: {stacks[id].cue}</Typography>
      <UnitDetailProvider>
        <HabitStackWithDnd id={id} stackHabitIDs={stacks[id].habitIDs} />
      </UnitDetailProvider>

      <Button onClick={() => router.push(`/habits/${id}`)}>Open</Button>
    </Box>
  );
};

export const getServerSideProps = async () => {
  resetServerContext();
  const units = await getAllUnits();
  const stacks = await getAllStacks();
  const topics = await getAllTopics();
  return {
    props: {
      unitsProp: units,
      stacksProp: stacks,
      topicsProp: topics,
    },
  };
};

export default Habits;
