import { addDoc, doc, setDoc, collection, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/client';

export async function createProject(data) {
  if (!['active', 'backburner'].includes(data.status)) {
    throw new Error('Failed to create project: no status specified');
  }
  if (!data.name) {
    throw new Error('Failed to create project: name not specified');
  }
  // const projectId = generateProjectId(data.name);
  // const newProject = { ...data, id: projectId };
  // await setDoc(doc(db, 'projects', projectId), newProject);

  const docRef = await addDoc(collection(db, 'projects'), data);
  await setDoc(docRef, { id: docRef.id }, { merge: true });
  return { id: docRef.id, ...data };
}

export async function putProject(data) {
  if (!data.id) {
    throw new Error('Failed to create project: id not specified');
  }
  await setDoc(doc(db, 'projects', data.id), data);
}

export async function deleteProject(id) {
  await deleteDoc(doc(db, 'projects', id));
}

// function generateProjectId(name) {
//   // prettier-ignore
//   return name
//       .substring(0, 63)
//       .toLowerCase()
//       .replace(/[^a-z0-9_-]/g, '_');
// }
