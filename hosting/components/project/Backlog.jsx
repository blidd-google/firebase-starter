import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useState } from 'react';
import { useContext } from 'react';
import { TopicsContext, UnitDetailContext, UnitsContext } from '../../context';
import {
  applyFiltersToUnits,
  statusFilterFactory,
  typeFilterFactory,
} from '../../lib/filters';
import { BACKLOG } from '../../lib/status';
import UnitCard from '../UnitCard';
import UnitList from '../UnitList';

export default function Backlog() {
  const { units } = useContext(UnitsContext);
  const topics = useContext(TopicsContext);

  const [classifier, setClassifier] = useState('milestone');

  let classes;
  if (classifier === 'milestone') {
    classes = applyFiltersToUnits(units, [typeFilterFactory('milestone')]);
    classes.sort((a, b) => a.summary.localeCompare(b.summary));
  } else if (classifier === 'topicId') {
    classes = topics;
  }

  return (
    <Grid container>
      <Grid item xs={2}>
        <FormControl fullWidth size="small">
          <InputLabel>Group By</InputLabel>
          <Select
            label="Group By"
            value={classifier}
            onChange={(event) => setClassifier(event.target.value)}
          >
            <MenuItem value="milestone">Milestone</MenuItem>
            <MenuItem value="topicId">Topic</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {classes.map((cls) => (
        <ClassList key={cls.id} classifier={classifier} cls={cls} />
      ))}
    </Grid>
  );
}

function ClassList({ classifier, cls }) {
  const openForm = useContext(UnitDetailContext);

  const filters = [
    statusFilterFactory(BACKLOG),
    (unit) => unit[classifier] === cls.id,
  ];

  return (
    <Grid item xs={3} key={cls.id}>
      {classifier === 'milestone' && (
        <Box
          sx={{
            minHeight: 150,
            padding: 2,
            bgcolor: 'background.secondary',
          }}
        >
          <UnitCard unitProps={cls} onClick={() => openForm(cls.id)} />
        </Box>
      )}
      <Box>
        <UnitList filters={filters} />
      </Box>
    </Grid>
  );
}
