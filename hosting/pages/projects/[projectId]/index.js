import Project from '../../../components/Project';
import {
  getProjectDetails,
  getTopicsForProject,
  getUnitsForProject,
} from '../../../lib/server/projects';

const ProjectById = ({
  currIdProp,
  projectProp,
  unitsProp,
  topicsProp,
  tabProp = 0,
}) => <Project
  currIdProp={currIdProp}
  projectProp={projectProp}
  unitsProp={unitsProp}
  topicsProp={topicsProp}
/>;

export default ProjectById;


export const getServerSideProps = async ({ params }) => {
  const { projectId } = params;
  const project = await getProjectDetails(projectId);
  const topics = await getTopicsForProject(projectId);
  const units = await getUnitsForProject(projectId);

  return {
    props: {
      projectProp: project,
      currIdProp: projectId,
      unitsProp: units,
      topicsProp: topics,
    },
  };
};
