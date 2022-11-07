import { Box, Card, CardContent, Typography } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import { getAllHabits } from '../lib/server/projects';
import {
  DragDropContext,
  Draggable,
  Droppable,
  resetServerContext,
} from 'react-beautiful-dnd';

export const Habits = ({ habitsProp }) => {
  const [habits, setHabits] = useState(habitsProp);

  const arr = [];
  for (const [id, habit] of Object.entries(habits)) {
    arr.push(habit);
  }
  console.log(arr);

  const handleDragEnd = () => {};

  return (
    <Box>
      <DragDropContext onDragEnd={handleDragEnd}>
        <HabitStack id="1234" title="test stack" habits={arr} />
      </DragDropContext>
    </Box>
  );
};

export const HabitStack = ({ id, title, habits }) => {
  return (
    <Box sx={{ border: 1 }}>
      <Typography variant="h4">{title}</Typography>
      <Droppable droppableId="1234">
        {(provided) => (
          <Box ref={provided.innerRef} {...provided.droppableProps}>
            {habits.map((habit, index) => (
              <HabitCard
                key={habit.id}
                id={habit.id}
                summary={habit.summary}
                index={index}
              />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Box>
  );
};

export const HabitCard = ({ id, summary, index }) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <Card
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <CardContent>{summary}</CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export const getServerSideProps = async () => {
  resetServerContext();
  const habits = await getAllHabits();
  return {
    props: {
      habitsProp: habits,
    },
  };
};

export default Habits;
