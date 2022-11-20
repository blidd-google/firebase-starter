import AddIcon from '@mui/icons-material/Add';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import * as dayjs from 'dayjs';
import * as React from 'react';
import { useState } from 'react';
import { createUnit } from '../lib/client/unit';
import { BACKLOG } from '../lib/status';
import isToday from 'dayjs/plugin/isToday';
import { computeStreak } from '../lib/time';
import { useContext } from 'react';
import { UnitDetailContext, UnitsContext } from '../context';
dayjs.extend(isToday);

const UnitList = ({ filterFn, onClick }) => {
  const [displayAddForm, setDisplayAddForm] = useState(false);
  const [displayAlert, setDisplayAlert] = useState({
    display: false,
    severity: '',
    message: '',
  });
  const { units } = useContext(UnitsContext);
  const openUnit = useContext(UnitDetailContext);

  // if no filter fn is specified, will return all units
  const unitsFiltered = Object.values(units).filter(filterFn || (() => true));
  onClick = openUnit || onClick;

  return (
    <>
      <Grid container spacing={2} sx={{ maxHeight: 500, overflow: 'auto' }}>
        {unitsFiltered.map(({ id, ...props }) => (
          <Grid item xs={12} key={id}>
            <Unit unitProps={props} onClick={() => onClick(id) || (() => {})} />
          </Grid>
        ))}
        <Grid item xs={12}>
          {!displayAddForm && (
            <Button
              variant="outlined"
              endIcon={<AddIcon />}
              onClick={() => setDisplayAddForm(true)}
            >
              Quick Add
            </Button>
          )}
          {/* {displayAddForm && (
            <AddUnitForm
              projectId={projectId}
              status={status}
              topics={topics ? topics : []}
              onSubmit={handleSubmitAdd}
              onCancel={handleCancelAdd}
            />
          )} */}
        </Grid>
        <Grid item xs={12}>
          <Stack>
            {displayAlert.display && (
              <Alert
                severity={displayAlert.severity}
                onClose={() => {
                  setDisplayAlert({
                    display: false,
                    severity: '',
                    message: '',
                  });
                }}
              >
                {displayAlert.message}
              </Alert>
            )}
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

const Unit = ({
  unitProps: { summary, description, topic, dueDate, doneDates },
  onClick,
}) => {
  const [border, setBorder] = useState(1);

  const isOverdue = (dueDate) => {
    if (dueDate === null) {
      return false;
    }
    return dayjs.unix(dueDate).isBefore(dayjs(), 'day');
  };

  let dueDateColor = 'primary';
  if (isOverdue(dueDate)) {
    dueDateColor = 'error';
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
            {dueDate && (
              <Typography color={dueDateColor}>
                {dayjs.unix(dueDate).format('MM/DD/YYYY')}
              </Typography>
            )}
            {topic && (
              <Chip
                label={topic}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            {streak > 0 && (
              <Typography color="secondary">{streak} streak!</Typography>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
};

const AddUnitForm = ({ projectId, status, topics, onSubmit, onCancel }) => {
  const [state, setState] = useState({
    projectId: projectId || '',
    status: status || BACKLOG,
    description: '',
    priority: 0,
    topic: '',
  });

  const handleClickSave = (event) => {
    event.preventDefault();
    onSubmit(state);
  };

  const handleClickCancel = (event) => {
    event.preventDefault();
    onCancel();
  };

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Card>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          required
          fullWidth
          size="small"
          margin="dense"
          label="Summary"
          name="summary"
          value={state.summary}
          onChange={handleChange}
        />
        <TextField
          required
          fullWidth
          size="small"
          margin="dense"
          label="Project ID"
          name="projectId"
          value={state.projectId}
          onChange={handleChange}
        />
        <FormControl fullWidth size="small">
          <InputLabel>Topic</InputLabel>
          <Select
            label="Topic"
            name="topic"
            value={state.topic}
            onChange={handleChange}
          >
            {topics.map(({ id, name, resources }) => (
              <MenuItem key={id} value={name}>
                {name}
              </MenuItem>
            ))}
            ;
          </Select>
        </FormControl>
      </Box>

      <Button variant="contained" onClick={handleClickSave}>
        Save
      </Button>
      <Button variant="outlined" onClick={handleClickCancel}>
        Cancel
      </Button>
    </Card>
  );
};

export default UnitList;
