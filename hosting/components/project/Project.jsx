import {
  Box,
  Fab,
  Grid,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Topics from '../Topics';
import { deleteProject, putProject } from '../../lib/client/project';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { ProjectsContext, TopicsContext, UnitsContext } from '../../context';
import { useTopics, useUnits } from '../../hooks';
import UnitDetailProvider from '../UnitDetail';
import Roadmap from './Roadmap';
import Backlog from './Backlog';

/**
 * Main page displaying project information.
 * @param {number} param0
 * @return {number}
 */
export default function Project({
  currIdProp,
  projectProp,
  unitsProp,
  topicsProp,
}) {
  const { units, updateUnits } = useUnits(unitsProp, currIdProp);
  const { topics } = useTopics(topicsProp, currIdProp);

  const [project, setProject] = useState(projectProp);
  const { projects, setProjects } = useContext(ProjectsContext);

  const [tab, setTab] = useState(0);
  const [editable, setEditable] = useState(false);

  const router = useRouter();

  // useEffect hooks change state when switching projects
  useEffect(() => {
    setProject(projectProp);
  }, [projectProp]);

  const handleChange = (event) => {
    setProject({
      ...project,
      [event.target.name]: event.target.value,
    });
  };

  const handleSave = async () => {
    await putProject(project);
    const idx = projects.findIndex((elt) => elt.id === project.id);
    const projectsUpdated = [...projects];
    projectsUpdated[idx] = project;
    setProjects(projectsUpdated);
    setEditable(false);
  };

  const handleDelete = async () => {
    await deleteProject(project.id);
    const idx = projects.findIndex((elt) => elt.id === project.id);
    setProjects(projects.splice(idx));
    router.push(`/projects/all`);
  };

  const handleCreateUnit = async () => {};

  const headerButton = editable ? (
    <Fab color="secondary" aria-label="edit" onClick={handleSave}>
      <CheckIcon />
    </Fab>
  ) : (
    <Fab color="secondary" aria-label="check" onClick={() => setEditable(true)}>
      <EditIcon />
    </Fab>
  );

  return (
    <UnitsContext.Provider value={{ units, updateUnits }}>
      <TopicsContext.Provider value={topics}>
        <Box component="main" sx={{ pl: 4 }}>
          <Grid container padding={2}>
            <Grid item xs={12}>
              <Stack direction="row" spacing={3}>
                {editable ? (
                  <Stack>
                    <TextField
                      variant="standard"
                      label="Project Name"
                      name="name"
                      value={project.name || 0}
                      onChange={handleChange}
                    />
                    <TextField
                      fullWidth
                      variant="standard"
                      label="Description"
                      name="description"
                      value={project.description || 0}
                      onChange={handleChange}
                    />
                    <TextField
                      variant="standard"
                      label="Hours Per Week"
                      name="hoursPerWeek"
                      type="number"
                      value={project.hoursPerWeek || 0}
                      onChange={handleChange}
                    />
                  </Stack>
                ) : (
                  <Stack>
                    <Typography variant={'h4'}>{project.name}</Typography>
                    <Typography variant={'h5'}>
                      {project.description}
                    </Typography>
                    <Typography variant={'body'}>
                      hours per week: {project.hoursPerWeek}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Fab color="primary" onClick={handleCreateUnit}>
                <AddIcon />
              </Fab>
              {headerButton}
              <Fab color="error" aria-label="delete" onClick={handleDelete}>
                <DeleteIcon />
              </Fab>
            </Grid>
          </Grid>

          <Box padding={2}>
            <Tabs value={tab} onChange={(event, tab) => setTab(tab)}>
              <Tab label="roadmap" />
              <Tab label="backlog" />
              <Tab label="topics" />
            </Tabs>
          </Box>

          {tab === 0 && (
            <UnitDetailProvider>
              <Roadmap projectId={currIdProp} />
            </UnitDetailProvider>
          )}
          {tab === 1 && (
            <UnitDetailProvider>
              <Backlog />
            </UnitDetailProvider>
          )}
          {tab === 2 && <Topics projectId={currIdProp} topics={topics} />}
        </Box>
      </TopicsContext.Provider>
    </UnitsContext.Provider>
  );
}

// Project.propTypes = {
//   currIdProp: PropTypes.string,
//   unitsProp: PropTypes.object,
//   topicsProp: PropTypes.array,
// };
