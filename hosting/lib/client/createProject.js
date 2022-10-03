import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/client';

export async function createProject(data) {
  if (!['active', 'backburner'].includes(data.status)) {
    throw new Error('Failed to create project: no status specified');
  }
  if (!data.name) {
    throw new Error('Failed to create project: name not specified');
  }
  const projectId = generateProjectId(data.name);
  const newProject = { ...data, id: projectId };
  await setDoc(doc(db, 'projects', projectId), newProject);
  return newProject;
}

function generateProjectId(name) {
  // prettier-ignore
  return name
      .substring(0, 63)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_');
}
