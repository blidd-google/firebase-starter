import {
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  resetServerContext,
} from 'react-beautiful-dnd';
import { HabitStackWithDnd } from '../../components/habit';
import UnitDetailProvider from '../../components/UnitDetail';
import UnitList from '../../components/UnitList';
import { StackDisplayContext, UnitsContext } from '../../context';
import { useUnits } from '../../hooks';
import { putStack } from '../../lib/client/stack';
import { typeFilterFactory } from '../../lib/filters';
import { getStack } from '../../lib/server/habit';
import { getAllUnits } from '../../lib/server/projects';

function HabitStackDetail({ stackId, stackProp, unitsProp }) {
  const { units, updateUnits } = useUnits(unitsProp);
  const [stack, setStack] = useState(stackProp);
  // const [selected, setSelected] = useState([]);
  const [trashEnabled, setTrashEnabled] = useState(false);
  const [arrowsEnabled, setArrowsEnabled] = useState(true);

  const router = useRouter();

  const onDragStart = () => {
    setTrashEnabled(true);
    setArrowsEnabled(false);
  };

  const onDragUpdate = (update) => {
    const { destination } = update;
    if (destination !== null && destination.droppableId === 'delete') {
      console.log('hovering over delete');
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      setTrashEnabled(false);
      setArrowsEnabled(true);
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      setTrashEnabled(false);
      setArrowsEnabled(true);
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
    setTrashEnabled(false);
    setArrowsEnabled(true);
    setStack(reorderedStack);
    await putStack(reorderedStack);
  };

  const handleClickSave = async (event) => {
    await putStack(stack);
    router.push('/habits');
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

  // const handleMoveSelected = () => {
  //   setSelected([]);
  // };

  return (
    <UnitsContext.Provider value={{ units, updateUnits }}>
      <Stack component="main" sx={{ overflow: 'hidden' }}>
        <Grid container>
          <Grid item xs={6}>
            <TextField
              label="Title"
              name="title"
              size="small"
              value={stack.title}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Cue"
              name="cue"
              size="small"
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
            <DragDropContext
              onDragEnd={onDragEnd}
              onDragUpdate={onDragUpdate}
              onDragStart={onDragStart}
            >
              <UnitDetailProvider>
                <StackDisplayContext.Provider value={arrowsEnabled}>
                  <HabitStackWithDnd
                    id={stackId}
                    stackHabitIDs={stack.habitIDs}
                  />
                </StackDisplayContext.Provider>
              </UnitDetailProvider>
              <Droppable droppableId="delete">
                {(provided, snapshot) => {
                  if (trashEnabled) {
                    // N.B. We deliberately omit adding a behavior placeholder
                    // to avoid undefined behavior for the contents of the
                    // Droppable (e.g. the "DELETE" word)
                    return (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: 100,
                          margin: 1,
                          border: snapshot.isDraggingOver ? 3 : 1,
                          borderRadius: 1,
                          borderColor: 'error.main',
                        }}
                      >
                        <Typography color="error">DELETE</Typography>
                      </Box>
                    );
                  } else {
                    return (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: 100,
                          margin: 1,
                        }}
                      >
                        {provided.placeholder}
                      </Box>
                    );
                  }
                }}
              </Droppable>
            </DragDropContext>
          </Grid>

          <Grid item xs={6}>
            <UnitList
              filters={[typeFilterFactory('habit')]}
              onClick={handleClickUnit}
            />
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'right' }}>
            <Button variant="contained" onClick={handleClickSave}>
              Save
            </Button>
            <Button variant="outlined" onClick={() => router.push('/habits')}>
              Back
            </Button>
          </Grid>
        </Grid>
      </Stack>
    </UnitsContext.Provider>
  );
}

export const getServerSideProps = async ({ params }) => {
  resetServerContext();
  const { stackId } = params;
  const stack = await getStack(stackId);
  const units = await getAllUnits();
  return {
    props: {
      stackId,
      stackProp: stack,
      unitsProp: units,
    },
  };
};

export default HabitStackDetail;
