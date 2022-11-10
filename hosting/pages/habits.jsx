import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogContent,
  Grid,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import * as React from 'react';
import { useState } from 'react';
import { getAllHabits, getAllStacks } from '../lib/server/habit';
import {
  DragDropContext,
  Draggable,
  Droppable,
  resetServerContext,
} from 'react-beautiful-dnd';
import { putStack } from '../lib/client/stack';
import UnitDetailProvider, { UnitDetailHeader } from '../components/UnitDetail';
import UnitList from '../components/UnitList';
import {
  createStack,
  getAllHabitsFromClient,
  getAllStacksFromClient,
} from '../lib/client/unit';
import { getAllTopics } from '../lib/server/projects';

export const Habits = ({ habitsProp, stacksProp, topicsProp }) => {
  const [habits, setHabits] = useState(habitsProp);
  const [stacks, setStacks] = useState(stacksProp);
  const [schedule, setSchedule] = useState('ALL');
  const [detailId, setDetailId] = useState('');

  const updateHabits = async () => {
    setHabits(await getAllHabitsFromClient());
  };

  const stacksFiltered = Object.values(stacks).filter((stack) => {
    if (schedule === 'ALL') {
      return true;
    }
    if (!stack.schedule) {
      return false;
    }
    return stack.schedule.includes(schedule) || stack.schedule.includes('ALL');
  });

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
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
    await putStack(reorderedStack);
  };

  const handleChangeSchedule = (event) => {
    console.log(event.target.value);
    console.log(schedule);
    setSchedule(event.target.value);
  };

  const handleCancel = async (state) => {
    await putStack(state);
    setStacks(await getAllStacksFromClient());
    setDetailId('');
  };

  const handleNewStack = async () => {
    const id = await createStack({
      title: '[title]',
      cue: '[cue]',
      schedule: [schedule],
      habitIDs: [],
    });
    setStacks(await getAllStacksFromClient());
    setDetailId(id);
  };

  return (
    <Stack
      component="main"
      sx={{
        display: 'flex',
        width: 1200,
        justifyContent: 'center',
      }}
    >
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

      {!!detailId && (
        <HabitStackDetail
          stackId={detailId}
          stacks={stacks}
          habits={habits}
          updateHabits={updateHabits}
          topics={topicsProp}
          onCancel={handleCancel}
        />
      )}

      <Grid container>
        {stacksFiltered.map(({ id }) => (
          <Grid item key={id} xs={4}>
            <DragDropContext onDragEnd={onDragEnd}>
              <HabitStack
                id={id}
                stacks={stacks}
                habits={habits}
                updateHabits={updateHabits}
                topics={topicsProp}
                openDetail={() => setDetailId(id)}
              />
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
  );
};

const HabitStackDetail = ({
  stackId,
  stacks,
  habits,
  updateHabits,
  topics,
  onCancel,
}) => {
  const [stack, setStack] = useState(stacks[stackId]);
  const [selected, setSelected] = useState([]);
  const [trashEnabled, setTrashEnabled] = useState(false);

  const onDragStart = () => {
    setTrashEnabled(true);
  };

  const onDragEnd = async (result) => {
    setTrashEnabled(false);
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const reorderedIDs = Array.from(stack.habitIDs);
    if (destination.droppableId === 'delete') {
      const index = reorderedIDs.indexOf(draggableId);
      if (index > -1) {
        reorderedIDs.splice(index, 1);
      }
    } else {
      reorderedIDs.splice(source.index, 1);
      reorderedIDs.splice(destination.index, 0, draggableId);
    }
    const reorderedStack = {
      ...stack,
      habitIDs: reorderedIDs,
    };
    setStack(reorderedStack);
    await putStack(reorderedStack);
  };

  const handleClickCancel = (event) => {
    event.preventDefault();
    onCancel(stack);
  };

  const handleChange = (event) => {
    setStack({
      ...stack,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeSchedule = (event, schedule) => {
    // if the user clicked ALL, deselect everything else
    if (event.target.value === 'ALL') {
      setStack({ ...stack, schedule: ['ALL'] });
    } else {
      // if the user clicked something else, deselect ALL
      const index = schedule.indexOf('ALL');
      if (index > -1) {
        schedule.splice(index, 1);
      }
      setStack({
        ...stack,
        schedule,
      });
    }
  };

  const handleClickUnit = (habitId) => {
    // const index = selected.indexOf(habitId);
    // if (index > -1) {
    //   selected.splice(index, 1);
    //   setSelected(selected);
    // } else {
    //   setSelected([...selected, habitId]);
    // }
    if (stack.habitIDs.includes(habitId)) {
      console.log('already selected');
      return;
    }
    setStack({
      ...stack,
      habitIDs: [...stack.habitIDs, habitId],
    });
  };

  const handleMoveSelected = () => {
    console.log('SELECTED', selected);
    setSelected([]);
  };

  const stackArr = stack.habitIDs.map((habitID) => habits[habitID]);

  console.log('stack', stack);
  console.log('stackarr', stackArr);

  return (
    <Dialog fullScreen open={true} onClose={handleClickCancel}>
      <UnitDetailHeader onClose={handleClickCancel}>
        {stack.title}
      </UnitDetailHeader>
      <DialogContent dividers sx={{ overflow: 'hidden' }}>
        <Grid container>
          <Grid item xs={12}>
            <TextField
              label="Title"
              name="title"
              value={stack.title}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Cue"
              name="cue"
              value={stack.cue}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <ToggleButtonGroup
              name="schedule"
              value={stack.schedule || []}
              onChange={handleChangeSchedule}
            >
              {['M', 'T', 'W', 'TH', 'F', 'SA', 'SU', 'ALL'].map(
                (day, index) => (
                  <ToggleButton key={index} name="schedule" value={day}>
                    {day}
                  </ToggleButton>
                ),
              )}
            </ToggleButtonGroup>
          </Grid>

          <Grid item xs={6}>
            <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
              <UnitDetailProvider
                units={habits}
                updateUnits={updateHabits}
                topics={topics}
              >
                <HabitStackContent id={stackId} stackArray={stackArr} />
              </UnitDetailProvider>

              <Droppable droppableId="delete">
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 100,
                      margin: 1,
                      border: 1,
                      borderRadius: 1,
                      borderColor: 'error.main',
                    }}
                  >
                    <DeleteIcon color="error" />
                    <Typography color="error">DELETE</Typography>
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </DragDropContext>
          </Grid>

          <Grid item xs={6}>
            <UnitList
              filterFn={() => true}
              units={habits}
              onClick={handleClickUnit}
            />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" onClick={handleMoveSelected}>
              Move Selected
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export const HabitStack = ({
  id,
  stacks,
  habits,
  updateHabits,
  topics,
  openDetail,
}) => {
  const stackArr = stacks[id].habitIDs.map((habitID) => habits[habitID]);

  return (
    <Box sx={{ margin: 2, padding: 2, bgcolor: 'background.secondary' }}>
      <Typography variant="h6">{stacks[id].title}</Typography>
      <Typography variant="body">cue: {stacks[id].cue}</Typography>
      <UnitDetailProvider
        units={habits}
        updateUnits={updateHabits}
        topics={topics}
      >
        <HabitStackContent id={id} stackArray={stackArr} />
      </UnitDetailProvider>

      {!!openDetail && <Button onClick={openDetail}>Open</Button>}
    </Box>
  );
};

export const HabitStackContent = ({ id, stackArray, openUnit }) => {
  console.log('OPENUNIT', openUnit);
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <Box ref={provided.innerRef} {...provided.droppableProps}>
          {stackArray.map((habit, index) => (
            <Box key={index}>
              <HabitCard
                key={habit.id}
                id={habit.id}
                summary={habit.summary}
                timeEst={habit.timeEst}
                index={index}
                openUnit={openUnit || (() => {})}
              />
              {/* {index < stack.length - 1 && <ArrowDownwardIcon />} */}
            </Box>
          ))}
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  );
};

export const HabitCard = ({ id, summary, timeEst, index, openUnit }) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <Box
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          sx={{ padding: 1 }}
          onClick={() => openUnit(id)}
        >
          <Card>
            <CardContent>
              {summary}
              {timeEst > 0 && (
                <Typography color="primary">{timeEst} min</Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      )}
    </Draggable>
  );
};

export const getServerSideProps = async () => {
  resetServerContext();
  const habits = await getAllHabits();
  const stacks = await getAllStacks();
  const topics = await getAllTopics();
  return {
    props: {
      habitsProp: habits,
      stacksProp: stacks,
      topicsProp: topics,
    },
  };
};

export default Habits;
