import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useContext } from 'react';
import { TopicsContext } from '../../context';
import { statusFilterFactory } from '../../lib/filters';
import { BACKLOG } from '../../lib/constants';
import UnitList from '../UnitList';
import { useClasses } from '../../hooks';
import { CLASSIFIERS } from '../classes';

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

export default function Backlog() {
  const topics = useContext(TopicsContext);
  const { classes, classifierId, setClassifierId } = useClasses('milestone');
  const [state, setState] = useState({
    timeEst: 60,
    // filteredTopics: [...topics.map((t) => t.id), ''],
    filteredTopics: [],
  });

  // filters apply to all classes
  const filters = [statusFilterFactory(BACKLOG)];
  filters.push((unit) => unit.timeEst <= state.timeEst);
  filters.push((unit) => {
    if (state.filteredTopics.length === 0) {
      return true;
    }
    return state.filteredTopics.includes(unit.topicId);
  });

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeTopics = (event) => {
    const {
      target: { value },
    } = event;
    setState({
      ...state,
      [event.target.name]: value,
    });
  };

  return (
    <Grid container>
      <Grid item xs={2}>
        <FormControl fullWidth>
          <InputLabel>Group By</InputLabel>
          <Select
            label="Group By"
            value={classifierId}
            onChange={(event) => setClassifierId(event.target.value)}
          >
            {CLASSIFIERS.map(({ id, name }) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Filter By Topics</InputLabel>
          <Select
            multiple
            name="filteredTopics"
            label="Select Topics"
            value={state.filteredTopics}
            onChange={handleChangeTopics}
          >
            {topics.map(({ id, name }) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography>Filter by Time Est</Typography>
        <FormControl fullWidth size="small">
          <Slider
            label="Filter by Time Est"
            name="timeEst"
            value={state.timeEst}
            valueLabelDisplay="auto"
            step={15}
            min={0}
            max={60}
            marks={true}
            onChange={handleChange}
          />
        </FormControl>
      </Grid>
      {classes.map((cls) => (
        <ClassList
          key={cls.id}
          classifier={classifierId}
          cls={cls}
          filters={filters}
        />
      ))}
    </Grid>
  );
}

function ClassList({ cls, filters }) {
  filters = [...filters, cls.isMember];
  return (
    <Grid item xs={2} key={cls.id}>
      {cls.buildHeader()}
      <Box>
        <UnitList filters={filters} />
      </Box>
    </Grid>
  );
}
