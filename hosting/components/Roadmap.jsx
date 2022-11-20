import { Button, Container, Grid, Typography } from '@mui/material';
import { useContext } from 'react';
import { UnitsContext } from '../context';
import { createUnit } from '../lib/client/unit';
import { BACKLOG, INPROGRESS, TODO } from '../lib/status';
import UnitDetailProvider from './UnitDetail';
import UnitList from './UnitList';

const LIST_TITLES = ['BACKLOG', 'ACTIVE', 'IN PROGRESS'];
export function Roadmap({ projectId, topics }) {
  const { units, updateUnits } = useContext(UnitsContext);

  const handleNew = async (event) => {
    event.preventDefault();
    // create empty new unit
    const id = await createUnit({
      projectId,
      status: BACKLOG,
      summary: 'untitled',
    });
    await updateUnits();
    // open up unit detail dialog
  };
  return (
    <Grid container>
      {[BACKLOG, TODO, INPROGRESS].map((status) => (
        <Grid item xs={4} key={status} sx={{ alignContent: 'flex-start' }}>
          <Container sx={{ width: 350 }}>
            <Typography mb={3} variant="h5">
              {LIST_TITLES[status]}
            </Typography>
            <UnitDetailProvider topics={topics}>
              <UnitList filterFn={(unit) => unit.status === status} />
            </UnitDetailProvider>
          </Container>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button variant="contained" onClick={handleNew}>
          Add Unit
        </Button>
      </Grid>
    </Grid>
  );
}
