import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import * as dayjs from 'dayjs';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { createUnit, deleteUnit, putUnit } from '../lib/client/unit';
import { COMPLETE } from '../lib/status';

function getPrevIdIfExists(units, id) {
  const prevId = units[id].prevId;
  if (prevId && prevId.length > 0 && units[prevId]) {
    return prevId;
  }
  return '';
}

function getNextIdIfExists(units, id) {
  const nextId = units[id].nextId;
  if (nextId && nextId.length > 0 && units[nextId]) {
    return nextId;
  }
  return '';
}

const unitTypes = ['cue', 'habit', 'task'];

export default function UnitDetailProvider({
  units,
  topics,
  updateUnits,
  children,
}) {
  const [formId, setFormId] = useState('');

  const handleFollowEdit = async (state) => {
    // new followup unit
    const id = await createUnit({
      description: '',
      projectId: state.projectId,
      prevId: state.id,
      summary: `followup: ${state.summary}`,
      status: state.status,
      topic: state.topic,
    });
    await putUnit({
      ...state,
      nextId: id,
    });
    await updateUnits();
    setFormId(id);
  };

  const handleSubmitEdit = async (state) => {
    try {
      await putUnit({ ...state });
      await updateUnits();
      setFormId('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelEdit = (event) => {
    setFormId('');
  };

  const handleDeleteEdit = async (id) => {
    console.log('deleting...');
    try {
      await deleteUnit(id);
      await updateUnits();
      setFormId('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {formId !== '' && (
        <UnitDetail
          units={units}
          id={formId}
          topics={topics}
          onSubmit={handleSubmitEdit}
          onCancel={handleCancelEdit}
          onDelete={handleDeleteEdit}
          onFollow={handleFollowEdit}
          openForm={(id) => {
            setFormId(id);
          }}
        />
      )}
      <children.type
        {...children.props}
        openUnit={(id) => {
          setFormId(id);
        }}
      />
    </>
  );
}

function UnitDetail({
  units,
  id,
  topics,
  onSubmit,
  onCancel,
  onDelete,
  onFollow,
  openForm,
}) {
  const dateToUnix = (date) => {
    return date ? date.unix() : null;
  };

  const unixToDate = (epoch) => {
    return epoch ? dayjs.unix(epoch) : null;
  };

  const [state, setState] = useState({
    id: id,
    projectId: units[id].projectId,
    summary: units[id].summary,
    status: units[id].status,
    prevId: getPrevIdIfExists(units, id),
    nextId: getNextIdIfExists(units, id),
    description: units[id].description || '',
    topic: units[id].topic || '',
    dueDate: unixToDate(units[id].dueDate),
    timeEst: units[id].timeEst || null,
    type: units[id].type || 'task',
    schedule: units[id].schedule || [],
  });

  useEffect(() => {
    setState({
      id: id,
      type: units[id].type || 'task',
      projectId: units[id].projectId,
      summary: units[id].summary,
      status: units[id].status,
      prevId: getPrevIdIfExists(units, id),
      nextId: getNextIdIfExists(units, id),
      description: units[id].description || '',
      topic: units[id].topic || '',
      dueDate: unixToDate(units[id].dueDate),
      timeEst: units[id].timeEst || null,
      schedule: units[id].schedule || [],
    });
  }, [id, units]);

  const handleClickDone = (event) => {
    event.preventDefault();
    onSubmit({
      ...state,
      dueDate: dateToUnix(state.dueDate),
      doneDate: dateToUnix(dayjs()),
      status: COMPLETE,
    });
    onCancel();
  };

  const handleClickSave = (event) => {
    event.preventDefault();
    onSubmit({
      ...state,
      dueDate: dateToUnix(state.dueDate),
    });
    onCancel();
  };

  const handleClickCancel = (event) => {
    event.preventDefault();
    onCancel();
  };

  const handleClickDelete = (event) => {
    event.preventDefault();
    onDelete(id);
  };

  const handleClickCreateFollowup = (event) => {
    event.preventDefault();
    onFollow({
      ...state,
      dueDate: dateToUnix(state.dueDate),
    });
  };

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeDate = (value) => {
    setState({
      ...state,
      dueDate: value,
    });
  };

  const handleChangeStatus = (event) => {
    setState({
      ...state,
      status: Number(event.target.value),
    });
  };

  const handleChangeSchedule = (event, selectedDays) => {
    setState({
      ...state,
      schedule: selectedDays,
    });
  };

  return (
    <Dialog open={true} onClose={handleClickCancel}>
      <UnitDetailHeader onClose={handleClickCancel}>Details</UnitDetailHeader>
      <DialogContent dividers>
        <Grid container alignItems={'center'}>
          <Grid item xs={12}>
            <Typography>PROJECT: {state.projectId}</Typography>
          </Grid>
          <Grid item xs={12} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex' }} alignItems={'center'}>
              {state.prevId !== '' && (
                <>
                  <ArrowBackIosIcon />
                  <Chip
                    label={units[state.prevId].summary}
                    variant="outlined"
                    onClick={() => {
                      // console.log('GO TO PREV');
                      openForm(state.prevId);
                    }}
                  />
                </>
              )}
              {state.nextId !== '' && (
                <>
                  <Chip
                    label={units[state.nextId].summary}
                    variant="outlined"
                    onClick={() => {
                      openForm(state.nextId);
                    }}
                  />
                  <ArrowForwardIosIcon />
                </>
              )}
            </Box>
          </Grid>

          <Grid item xs={8}>
            <TextField
              variant="standard"
              fullWidth
              label="Summary"
              name="summary"
              value={state.summary}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Unit Type</InputLabel>
              <Select
                label="Unit Type"
                name="type"
                value={state.type}
                onChange={handleChange}
              >
                {unitTypes.map((type, index) => (
                  <MenuItem key={index} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sx={{ mt: 2, mb: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={state.description}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={7} sx={{ mr: 1 }}>
            <ToggleButtonGroup
              name="status"
              value={state.status}
              exclusive
              onChange={handleChangeStatus}
            >
              <ToggleButton name="status" value={0}>
                Backlog
              </ToggleButton>
              <ToggleButton name="status" value={1}>
                Todo
              </ToggleButton>
              <ToggleButton name="status" value={2}>
                In Progress
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          <Grid item xs={4}>
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
          </Grid>

          {state.type === 'habit' && (
            <Grid item>
              <ToggleButtonGroup
                name="schedule"
                value={state.schedule}
                onChange={handleChangeSchedule}
              >
                {['M', 'T', 'W', 'TH', 'F', 'SA', 'SU'].map((day, index) => (
                  <ToggleButton key={index} name="schedule" value={day}>
                    {day}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Grid>
          )}
          {state.type === 'task' && (
            <>
              <Grid item>
                <DesktopDatePicker
                  label="Due Date"
                  name="dueDate"
                  inputFormat="MM/DD/YYYY"
                  value={state.dueDate}
                  onChange={handleChangeDate}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={() => handleChangeDate(null)}
                >
                  Clear
                </Button>
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Slider
              label="Time Estimate"
              name="timeEst"
              value={state.timeEst}
              getAriaValueText={(val) => `${val} min`}
              valueLabelDisplay="auto"
              defaultValue={30}
              step={5}
              marks
              min={0}
              max={60}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={handleClickCreateFollowup}>
          Follow up
        </Button>
        <Button variant="contained" color="success" onClick={handleClickDone}>
          Done
        </Button>
        <Button variant="contained" color="error" onClick={handleClickDelete}>
          Delete
        </Button>
        <Button variant="contained" onClick={handleClickSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const UnitDetailHeader = ({ children, onClose }) => (
  <DialogTitle
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    {children}
    <IconButton onClick={onClose}>
      <CloseIcon />
    </IconButton>
  </DialogTitle>
);
