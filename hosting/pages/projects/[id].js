import Project from '../../components/Project';
import {
  getProjectDetails,
  getTopicsForProject,
  getUnitsForProject,
} from '../../lib/server/projects';

const ProjectById = ({
  currIdProp,
  projectProp,
  unitsProp,
  topicsProp,
}) => <Project
  currIdProp={currIdProp}
  projectProp={projectProp}
  unitsProp={unitsProp}
  topicsProp={topicsProp}
/>;

export default ProjectById;


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
