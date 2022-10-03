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
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { COMPLETE } from '../lib/status';

const EditFormHeader = ({ children, onClose }) => (
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

export default function UnitDetail({
  units,
  id,
  projectId,
  topics,
  onSubmit,
  onCancel,
  onDelete,
  onFollow,
  openForm,
}) {
  const [state, setState] = useState({
    id: id,
    projectId: projectId,
    summary: units[id].summary,
    status: units[id].status,
    prevId: getPrevIdIfExists(units, id),
    nextId: getNextIdIfExists(units, id),
    description: units[id].description ? units[id].description : '',
    topic: units[id].topic ? units[id].topic : '',
  });

  useEffect(() => {
    setState({
      id: id,
      projectId: projectId,
      summary: units[id].summary,
      status: units[id].status,
      prevId: getPrevIdIfExists(units, id),
      nextId: getNextIdIfExists(units, id),
      description: units[id].description ? units[id].description : '',
      topic: units[id].topic ? units[id].topic : '',
    });
  }, [id, projectId, units]);

  const handleClickDone = (event) => {
    event.preventDefault();
    onSubmit({
      ...state,
      status: COMPLETE,
    });
    onCancel();
  };

  const handleClickSave = (event) => {
    event.preventDefault();
    onSubmit(state);
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

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeStatus = (event) => {
    setState({
      ...state,
      status: Number(event.target.value),
    });
  };

  const handleClickCreateFollowup = (event) => {
    event.preventDefault();
    onFollow(state);
  };

  console.log('STATE', state);

  return (
    <Dialog open={true} onClose={handleClickCancel}>
      <EditFormHeader onClose={handleClickCancel}>Details</EditFormHeader>
      <DialogContent dividers>
        <Grid container alignItems={'center'}>
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

          <Grid item xs={12}>
            <TextField
              variant="standard"
              fullWidth
              label="Summary"
              name="summary"
              value={state.summary}
              onChange={handleChange}
            />
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
