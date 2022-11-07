import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase/client';

export async function createNewTopic(projectId) {
  const docRef = await addDoc(collection(db, 'topics'), {
    name: 'untitled',
    notes: '',
    projectId,
  });
  await setDoc(docRef, { id: docRef.id }, { merge: true });
  return docRef.id;
}

export async function putTopic(data) {
  console.log('DATA', data);
  if (data.id === undefined) {
    throw new Error('Failed to create topic: no id specified');
  }
  if (data.projectId === undefined) {
    throw new Error('Failed to create topic: no project id specified');
  }
  if (data.name === undefined) {
    throw new Error('Failed to create topic: no name specified');
  }

  try {
    await setDoc(doc(db, 'topics', data.id), data);
  } catch (err) {
    console.log(err);
  }
}

export async function deleteTopic(id) {
  await deleteDoc(doc(db, 'topics', id));
}
