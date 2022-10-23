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
  TextField,
  Typography,
} from '@mui/material';
import * as dayjs from 'dayjs';
import * as React from 'react';
import { useState } from 'react';
import { createUnit } from '../lib/client/unit';

const UnitList = ({ projectId, filterFn, units, topics, update, openUnit }) => {
  const [displayAddForm, setDisplayAddForm] = useState(false);
  // const [displayEditForm, setDisplayEditForm] = useState('');

  const [displayAlert, setDisplayAlert] = useState({
    display: false,
    severity: '',
    message: '',
  });

  const handleSubmitAdd = async (state) => {
    try {
      await createUnit(state);
      update();
    } catch (err) {
      setDisplayAlert({
        display: true,
        severity: 'error',
        message: err.message,
      });
    } finally {
      setDisplayAddForm(false);
    }
  };

  const handleCancelAdd = () => {
    setDisplayAddForm(false);
  };

  // prettier-ignore
  const unitsFiltered = Object.values(units).filter(filterFn);

  return (
    <>
      <Grid container spacing={2}>
        {unitsFiltered.map(({ id, ...props }) => (
          <Grid item xs={12} key={id}>
            <Unit unitProps={props} onClick={() => openUnit(id)} />
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
          {displayAddForm && (
            <AddUnitForm
              projectId={projectId}
              status={status}
              topics={topics ? topics : []}
              onSubmit={handleSubmitAdd}
              onCancel={handleCancelAdd}
            />
          )}
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
  unitProps: { summary, description, topic, dueDate },
  onClick,
}) => {
  return (
    <>
      <Card>
        <CardActionArea onClick={onClick}>
          <CardContent>
            <Typography sx={{ fontSize: 16 }} gutterBottom>
              {summary}
            </Typography>
            <Typography sx={{ fontSize: 14, mb: 1 }}>{description}</Typography>
            {dueDate && (
              <Typography>
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
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
};

const AddUnitForm = ({ projectId, status, topics, onSubmit, onCancel }) => {
  const [state, setState] = useState({
    projectId: projectId || '',
    status,
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
