import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { useContext } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { StackDisplayContext, UnitDetailContext } from '../../context';
import { computeStreak } from '../../lib/time';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SouthIcon from '@mui/icons-material/South';

const _HabitCard = ({ displayProps, provided, last }) => {
  const openUnit = useContext(UnitDetailContext);

  const arrowsEnabled = useContext(StackDisplayContext);

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
      <Stack sx={{ display: 'flex', alignItems: 'stretch' }}>
        <Card sx={{ border: 1 }}>
          <CardContent>
            <Typography>{displayProps.summary}</Typography>
            {displayProps.timeEst > 0 && (
              <Typography color="primary">
                {displayProps.timeEst} min
              </Typography>
            )}
            {streak > 0 && streakTag}
          </CardContent>
        </Card>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            height: 20,
          }}
        >
          {arrowsEnabled && !last && <SouthIcon />}
        </Box>
      </Stack>
    </Box>
  );
};

const HabitCard = ({
  id,
  summary,
  timeEst,
  doneDates,
  index,
  draggable,
  last,
}) => {
  return (
    <>
      {draggable ? (
        <Draggable draggableId={id} index={index}>
          {(provided) => (
            <_HabitCard
              displayProps={{ id, summary, timeEst, doneDates }}
              provided={provided}
              last={last}
            />
          )}
        </Draggable>
      ) : (
        <_HabitCard
          displayProps={{ id, summary, timeEst, doneDates }}
          last={last}
        />
      )}
    </>
  );
};

export default HabitCard;
