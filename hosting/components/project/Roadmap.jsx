import { Box, Button, Grid, Typography } from '@mui/material';
import { useContext } from 'react';
import { UnitDetailContext, UnitsContext } from '../../context';
import { createUnit } from '../../lib/client/unit';
import { statusFilterFactory } from '../../lib/filters';
import { BACKLOG, INPROGRESS, TODO } from '../../lib/constants';
import UnitList from '../UnitList';

const LIST_TITLES = ['BACKLOG', 'ACTIVE', 'IN PROGRESS'];
export default function Roadmap({ projectId }) {
  const { updateUnits } = useContext(UnitsContext);
  const openUnitDetail = useContext(UnitDetailContext);

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
    openUnitDetail(id);
  };

  return (
    <Grid container>
      {[BACKLOG, TODO, INPROGRESS].map((status) => (
        <Grid item xs={4} key={status}>
          <Box sx={{ width: 350, border: 1 }}>
            <Typography mb={3} variant="h5">
              {LIST_TITLES[status]}
            </Typography>
            <UnitList filters={[statusFilterFactory(status)]} />
          </Box>
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
