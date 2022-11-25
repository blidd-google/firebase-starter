import { Box } from '@mui/material';
import { useContext } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { UnitsContext } from '../../context';
import HabitCard from './HabitCard';

const _HabitStack = ({ stackArray, provided, droppable }) => {
  return (
    <Box
      sx={{ maxHeight: 500, overflow: 'auto' }}
      {...provided?.droppableProps}
      ref={provided?.innerRef}
    >
      {stackArray.map((habit, index) => (
        <HabitCard
          key={habit.id}
          id={habit.id}
          summary={habit.summary}
          timeEst={habit.timeEst}
          doneDates={habit.doneDates}
          index={index}
          draggable={droppable}
        />
      ))}
      {provided?.placeholder}
    </Box>
  );
};

const HabitStackWithDnd = ({ id, stackHabitIDs }) => {
  const { units } = useContext(UnitsContext);
  const stackArray = stackHabitIDs.map((habitID) => units[habitID]);

  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <_HabitStack
          stackArray={stackArray}
          provided={provided}
          droppable={true}
        />
      )}
    </Droppable>
  );
};

const HabitStack = ({ id, stackHabitIDs }) => {
  const { units } = useContext(UnitsContext);
  const stackArray = stackHabitIDs.map((habitID) => units[habitID]);

  return <_HabitStack stackArray={stackArray} />;
};

export { HabitStack, HabitStackWithDnd };
