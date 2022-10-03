import { Box, Container, Grid, Tab, Tabs, Typography } from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Topics from '../../components/Topics';
import UnitDetail from '../../components/UnitDetail';
import UnitList from '../../components/UnitList';
import {
  createUnit,
  deleteUnit,
  getAllUnits,
  putUnit,
} from '../../lib/client/unit';
import {
  getProjectDetails,
  getTopicsForProject,
  getUnitsForProject,
} from '../../lib/server/projects';
import { BACKLOG, INPROGRESS, TODO } from '../../lib/status';

const LIST_TITLES = ['BACKLOG', 'TODO', 'IN PROGRESS'];

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
  const [project, setProject] = useState(projectProp);
  const [units, setUnits] = useState(unitsProp);
  const [topics, setTopics] = useState(topicsProp);

  const [tab, setTab] = useState(0);

  // useEffect hooks change state when switching projects
  useEffect(() => {
    setProject(projectProp);
  }, [projectProp]);

  useEffect(() => {
    setUnits(unitsProp);
  }, [unitsProp]);

  useEffect(() => {
    setTopics(topicsProp);
  }, [topicsProp]);

  const [formId, setFormId] = useState('');

  // this callback will pull the latest data from firestore and
  // trigger a re-render of the unit lists
  const updateUnits = async () => {
    setUnits(await getAllUnits(currIdProp));
  };

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
    console.log('STATE', state, id);
    await putUnit({
      ...state,
      nextId: id,
    });
    await updateUnits();
    setFormId(id);
    console.log('set dispef to:', id);
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
    <Box component="main" sx={{ pl: 4 }}>
      <Box padding={2}>
        <Typography variant={'h4'}>{project.name}</Typography>
        <Typography variant={'h5'}>{project.description}</Typography>
      </Box>

      <Box padding={2}>
        <Tabs value={tab} onChange={(event, tab) => setTab(tab)}>
          <Tab label="roadmap" />
          <Tab label="topics" />
        </Tabs>
      </Box>

      {formId !== '' && <UnitDetail
        units={units}
        id={formId}
        projectId={currIdProp}
        topics={topics}
        onSubmit={handleSubmitEdit}
        onCancel={handleCancelEdit}
        onDelete={handleDeleteEdit}
        onFollow={handleFollowEdit}
        openForm={(id) => {
          console.log('GOING TO PREV', id);
          setFormId(id);
        }}
      />}

      {tab === 0 && (
        <Grid container>
          {[BACKLOG, TODO, INPROGRESS].map((status) => (
            <Grid item xs={4} key={status} sx={{ alignContent: 'flex-start' }}>
              <Container sx={{ width: 350 }}>
                <Typography mb={3} variant="h5">
                  {LIST_TITLES[status]}
                </Typography>
                <UnitList
                  projectId={currIdProp}
                  status={status}
                  units={units}
                  topics={topics}
                  update={updateUnits}
                  openUnit={(id) => setFormId(id)}
                />
              </Container>
            </Grid>
          ))}
          {/* <Grid item xs={4} sx={{ alignContent: 'flex-start' }}>
            <Container sx={{ width: 350 }}>
              <Typography mb={3} variant="h5">
                TODO
              </Typography>
              <UnitList
                projectId={currIdProp}
                status={TODO}
                units={units}
                topics={topics}
                update={updateUnits}
              />
            </Container>
          </Grid>
          <Grid item xs={4} sx={{ alignContent: 'flex-start' }}>
            <Container sx={{ width: 350 }}>
              <Typography mb={3} variant="h5">
                IN PROGRESS
              </Typography>
              <UnitList
                projectId={currIdProp}
                status={INPROGRESS}
                units={units}
                topics={topics}
                update={updateUnits}
              />
            </Container>
          </Grid> */}
        </Grid>
      )}
      {tab === 1 && <Topics topics={topics} />}
    </Box>
  );
}

// Project.propTypes = {
//   currIdProp: PropTypes.string,
//   unitsProp: PropTypes.object,
//   topicsProp: PropTypes.array,
// };

export const getServerSideProps = async ({ params }) => {
  const { id } = params;
  const project = await getProjectDetails(id);
  const topics = await getTopicsForProject(id);
  const units = await getUnitsForProject(id);

  return {
    props: {
      projectProp: project,
      currIdProp: id,
      unitsProp: units,
      topicsProp: topics,
    },
  };
};
