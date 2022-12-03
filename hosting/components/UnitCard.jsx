import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useContext } from 'react';
import { useState } from 'react';
import { TopicsContext } from '../context';
import { computeStreak, isOverdue } from '../lib/time';

export default function UnitCard({
  unitProps: { type, summary, description, topicId, dueDate, doneDates },
  onClick,
}) {
  const [border, setBorder] = useState(1);
  const topics = useContext(TopicsContext);
  const topic = topics?.find((t) => t.id === topicId);

  let dueDateLabel;
  if (isOverdue(dueDate)) {
    dueDateLabel = (
      <Typography color={'error'} fontWeight="fontWeightMedium">
        {dayjs.unix(dueDate).format('MM/DD/YYYY')} OVERDUE!
      </Typography>
    );
  } else if (dueDate) {
    dueDateLabel = (
      <Typography color={'primary'}>
        {dayjs.unix(dueDate).format('MM/DD/YYYY')}
      </Typography>
    );
  }

  const streak = computeStreak(doneDates ?? []);

  return (
    <>
      <Card
        sx={{ border: border }}
        onMouseOver={() => setBorder(2)}
        onMouseOut={() => setBorder(1)}
      >
        <CardActionArea onClick={onClick}>
          <CardContent>
            <Typography sx={{ fontSize: 16 }} gutterBottom>
              {summary}
            </Typography>
            <Typography sx={{ fontSize: 14, mb: 1 }}>{description}</Typography>
            {dueDateLabel}
            {topicId && (
              <Chip
                label={topic?.name}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            {type === 'habit' && streak > 0 && (
              <Typography color="secondary">{streak} streak!</Typography>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}
