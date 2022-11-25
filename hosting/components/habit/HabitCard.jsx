import { Box, Card, CardContent, Typography } from '@mui/material';
import { useContext } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { UnitDetailContext } from '../../context';
import { computeStreak } from '../../lib/time';

const _HabitCard = ({ displayProps, provided }) => {
  const openUnit = useContext(UnitDetailContext);
  const streak = computeStreak(displayProps.doneDates ?? []);
  let streakTag;
  if (streak > 0 && streak < 3) {
    streakTag = <Typography color="secondary">{streak} streak!</Typography>;
  }
  if (streak >= 3) {
    streakTag = <Typography color="error">🔥 {streak} streak!</Typography>;
  }
  return (
    <Box
      sx={{ padding: 1 }}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      ref={provided?.innerRef}
      onClick={() => openUnit(displayProps.id)}
    >
      <Card>
        <CardContent>
          <Typography>{displayProps.summary}</Typography>
          {displayProps.timeEst > 0 && (
            <Typography color="primary">{displayProps.timeEst} min</Typography>
          )}
          {streak > 0 && streakTag}
        </CardContent>
      </Card>
    </Box>
  );
};

const HabitCard = ({ id, summary, timeEst, doneDates, index, draggable }) => {
  return (
    <>
      {draggable ? (
        <Draggable draggableId={id} index={index}>
          {(provided) => (
            <_HabitCard
              displayProps={{ id, summary, timeEst, doneDates }}
              provided={provided}
            />
          )}
        </Draggable>
      ) : (
        <_HabitCard displayProps={{ id, summary, timeEst, doneDates }} />
      )}
    </>
  );
};

export default HabitCard;
