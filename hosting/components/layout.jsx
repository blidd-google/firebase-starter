/* eslint-disable quote-props */
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { createProject } from '../lib/client/createProject';
import { getProjects } from '../lib/client/getProjects';

/**
 * Checks if two lists of projects are equal.
 * @param {List} a The first list.
 * @param {List} b The second list.
 * @return {boolean} Whether the two lists are eqla.
 */
function areProjectListsEqual(a, b) {
  // console.log("AB", a, b);
  return (
    a.length === b.length && [...a].every((p, index) => p.id === b[index].id)
  );
}

export default function Layout({ children }) {
  const [projects, setProjects] = useState([]);
  const [displayForm, setDisplayForm] = useState(false);
  const router = useRouter();

  const handleSubmit = async (state) => {
    try {
      const project = await createProject(state);
      setProjects(await getProjects());
      setDisplayForm(false);
      router.push(`${project.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setDisplayForm(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const p = await getProjects();
      if (!areProjectListsEqual(p, projects)) {
        setProjects(p);
      }
    };
    fetchData();
  }, [projects]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar
        selected={router.asPath.split('/').pop()}
        activeProjects={projects.filter((p) => p.status === 'active')}
        backburnerProjects={projects.filter((p) => p.status === 'backburner')}
        onClickNew={() => setDisplayForm(true)}
      />
      <ProjectForm
        open={displayForm}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
      {children}
    </Box>
  );
}

function Sidebar({ selected, activeProjects, backburnerProjects, onClickNew }) {
  const [workspace, setWorkspace] = useState(selected);

  useEffect(() => {
    setWorkspace(selected);
  }, [selected]);

  return (
    <Drawer
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 250,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <Divider />
      <List>
        <ListItem>
          <ListItemButton>OVERVIEW</ListItemButton>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemButton>PROJECTS</ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={onClickNew}>
            <ListItemText primary="NEW" />
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>

        <List sx={{ pl: 2 }}>
          <ListItem>Active</ListItem>
          {activeProjects.map((project) => (
            <ListItem sx={{ pl: 2 }} key={project.id} disablePadding>
              <Link href={`/projects/${project.id}`} passHref>
                <ListItemButton
                  selected={project.id === workspace}
                  onClick={() => setWorkspace(project.id)}
                >
                  <ListItemText primary={project.name} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
          <ListItem>Backburner</ListItem>
          {backburnerProjects.map((project) => (
            <ListItem sx={{ pl: 2 }} key={project.id} disablePadding>
              <Link href={`/projects/${project.id}`}>
                <ListItemButton
                  selected={project.id === workspace}
                  onClick={() => setWorkspace(project.id)}
                >
                  <ListItemText primary={project.name} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </List>
    </Drawer>
  );
}

const ProjectForm = ({ open, onSubmit, onCancel }) => {
  const [state, setState] = useState({
    name: '',
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
    <Dialog open={open} onClose={handleClickCancel}>
      <DialogTitle>Create a New Project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This is the project creation dialog
        </DialogContentText>

        <Grid container alignItems={'flex-end'}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              autoFocus
              variant="standard"
              margin="dense"
              label="Name"
              name="name"
              value={state.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="standard"
              margin="dense"
              label="Description"
              name="description"
              value={state.description || ''}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              type="number"
              variant="standard"
              margin="dense"
              label="Hours Per Week"
              name="hoursPerWeek"
              value={state.hoursPerWeek || 0}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth size="small">
              <InputLabel htmlFor="status">Status</InputLabel>
              <Select
                id="status"
                label="Status"
                name="status"
                value={state.status}
                onChange={handleChange}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="backburner">Backburner</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClickSave}>
          Save
        </Button>
        <Button variant="outlined" onClick={handleClickCancel}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
