
import * as React from 'react';
import Project from '../../components/Project';
import { getAllUnits, getAllTopics } from '../../lib/server/projects';


const AllProjects = ({
  unitsProp,
  topicsProp,
}) => <Project
  currIdProp=''
  projectProp={{ name: 'All Projects', description: 'All work' }}
  unitsProp={unitsProp}
  topicsProp={topicsProp}
/>;

export default AllProjects;

export const getServerSideProps = async () => {
  const units = await getAllUnits();
  const topics = await getAllTopics();

  return {
    props: {
      unitsProp: units,
      topicsProp: topics,
    },
  };
};
