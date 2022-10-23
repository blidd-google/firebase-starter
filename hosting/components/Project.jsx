import { Box, Tab, Tabs, Typography } from '@mui/material';
import * as dayjs from 'dayjs';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Roadmap } from './Roadmap';
import Topics from './Topics';
import { getAllUnitsForProject } from '../lib/client/unit';
import UnitDetailProvider from './UnitDetail';

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

  const [topicId, setTopicId] = useState('');

  // this callback will pull the latest data from firestore and
  // trigger a re-render of the unit lists
  const updateUnits = async () => {
    setUnits(await getAllUnitsForProject(currIdProp));
  };

  // const handleFollowEdit = async (state) => {
  //   // new followup unit
  //   const id = await createUnit({
  //     description: '',
  //     projectId: state.projectId,
  //     prevId: state.id,
  //     summary: `followup: ${state.summary}`,
  //     status: state.status,
  //     topic: state.topic,
  //   });
  //   console.log('STATE', state, id);
  //   await putUnit({
  //     ...state,
  //     nextId: id,
  //   });
  //   await updateUnits();
  //   setFormId(id);
  // };

  // const handleSubmitEdit = async (state) => {
  //   try {
  //     await putUnit({ ...state });
  //     await updateUnits();
  //     setFormId('');
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // const handleCancelEdit = (event) => {
  //   setFormId('');
  // };

  // const handleDeleteEdit = async (id) => {
  //   console.log('deleting...');
  //   try {
  //     await deleteUnit(id);
  //     await updateUnits();
  //     setFormId('');
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
    <Box component="main" sx={{ pl: 4 }}>
      <Box padding={2}>
        <Typography variant={'h4'}>{project.name}</Typography>
        <Typography variant={'h5'}>{project.description}</Typography>
        <Typography variant={'h6'}>
          hours per week: {project.hoursPerWeek}
        </Typography>
        <Typography variant={'h6'}>
          hours this week: {accumulateProjectHours(units, 7)}
        </Typography>
      </Box>

      <Box padding={2}>
        <Tabs value={tab} onChange={(event, tab) => setTab(tab)}>
          <Tab label="roadmap" />
          <Tab label="topics" />
        </Tabs>
      </Box>

      {tab === 0 && (
        <UnitDetailProvider
          units={units}
          topics={topics}
          updateUnits={updateUnits}
        >
          <Roadmap
            projectId={currIdProp}
            units={units}
            topics={topics}
            updateUnits={updateUnits}
          />
        </UnitDetailProvider>
      )}
      {tab === 1 && (
        <Topics topics={topics} openTopic={(id) => setTopicId(id)} />
      )}
    </Box>
  );
}

function accumulateProjectHours(units, numDays) {
  const today = new Date();
  let cutoff = new Date();
  cutoff.setDate(today.getDate() + numDays);
  cutoff = dayjs(cutoff);

  let total = 0;
  for (const unit of Object.values(units)) {
    if (unit.dueDate) {
      const dueDate = dayjs.unix(unit.dueDate);
      if (dueDate.isBefore(cutoff)) {
        const est = unit.timeEst ? unit.timeEst : 0;
        total += est;
      }
    }
  }
  return total / 60;
}

// Project.propTypes = {
//   currIdProp: PropTypes.string,
//   unitsProp: PropTypes.object,
//   topicsProp: PropTypes.array,
// };
