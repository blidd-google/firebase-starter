import { Box } from '@mui/material';
import { useContext } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { UnitsContext } from '../../context';
import HabitCard from './HabitCard';

const _HabitStack = ({ stackArray, provided, droppable }) => {
  return (
    <Box
      sx={{ maxHeight: 500, overflow: 'auto' }}
      {...provided.droppableProps}
      ref={provided.innerRef}
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
      {provided.placeholder}
    </Box>
  );
};

const HabitStack = ({ id, stackHabitIDs, droppable = true }) => {
  const { units } = useContext(UnitsContext);
  const stackArray = stackHabitIDs.map((habitID) => units[habitID]);

  return (
    <>
      {droppable ? (
        <Droppable droppableId={id}>
          {(provided) => (
            <_HabitStack
              stackArray={stackArray}
              provided={provided}
              droppable={droppable}
            />
          )}
        </Droppable>
      ) : (
        <_HabitStack stackArray={stackArray} />
      )}
      {/* <Droppable droppableId={id}>
        {(provided) => (
          <Box
            sx={{ maxHeight: 500, overflow: 'auto' }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {stackArray.map((habit, index) => (
              <HabitCard
                key={habit.id}
                id={habit.id}
                summary={habit.summary}
                timeEst={habit.timeEst}
                doneDates={habit.doneDates}
                index={index}
              />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable> */}
    </>
  );
};

export default HabitStack;
