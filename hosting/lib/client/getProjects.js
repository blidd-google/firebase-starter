import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/client';

export async function getProjects() {
  const projectsRef = collection(db, 'projects');

  const querySnapshot = await getDocs(projectsRef);

  const projects = [];
  querySnapshot.forEach((doc) => {
    projects.push(doc.data());
  });

  // console.log("PROJECTS:", projects);
  return projects;
}
