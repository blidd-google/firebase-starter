import { Container, Grid, Typography } from '@mui/material';
import { BACKLOG, INPROGRESS, TODO } from '../lib/status';
import UnitList from './UnitList';

const LIST_TITLES = ['BACKLOG', 'TODO', 'IN PROGRESS'];

export function Roadmap({ projectId, units, topics, updateUnits, openUnit }) {
  return (
    <Grid container>
      {[BACKLOG, TODO, INPROGRESS].map((status) => (
        <Grid item xs={4} key={status} sx={{ alignContent: 'flex-start' }}>
          <Container sx={{ width: 350 }}>
            <Typography mb={3} variant="h5">
              {LIST_TITLES[status]}
            </Typography>
            <UnitList
              projectId={projectId}
              filterFn={(unit) => unit.status === status}
              units={units}
              topics={topics}
              update={updateUnits}
              openUnit={openUnit}
            />
          </Container>
        </Grid>
      ))}
    </Grid>
  );
}
