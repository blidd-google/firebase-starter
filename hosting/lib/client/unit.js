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

export async function createUnit(data) {
  if (!data.projectId) {
    throw new Error('Failed to create unit: projectId not specified');
  }
  if (!(data.status in [0, 1, 2])) {
    throw new Error('Failed to create unit: no status specified');
  }
  if (!data.summary) {
    throw new Error('Failed to create unit: summary not specified');
  }

  const docRef = await addDoc(collection(db, 'units'), data);
  await setDoc(docRef, { id: docRef.id }, { merge: true });
  console.log('CREATE', data);
  return docRef.id;
}

export async function putUnit(data) {
  if (data.id === undefined) {
    throw new Error('Failed to create unit: no id specified');
  }
  if (data.projectId === undefined) {
    throw new Error('Failed to create unit: no project id specified');
  }
  if (data.summary === undefined) {
    throw new Error('Failed to create unit: no summary specified');
  }
  if (data.status === undefined) {
    throw new Error('Failed to create unit: no status specified');
  }

  console.log('PUT:', data);
  try {
    await setDoc(doc(db, 'units', data.id), data);
  } catch (err) {
    console.log(err);
  }
}

export async function deleteUnit(id) {
  await deleteDoc(doc(db, 'units', id));
}

export async function getAllUnitsForProject(projectId) {
  const unitsRef = collection(db, 'units');

  let q;
  if (projectId === '') {
    q = query(unitsRef);
  } else {
    q = query(unitsRef, where('projectId', '==', projectId));
  }
  const snapshot = await getDocs(q);

  const units = {};
  // for (const status of statuses) {
  //   units[status] = [];
  // }
  // snapshot.forEach((doc) => {
  //   const data = doc.data();
  //   units[data.status].push(data);
  // });
  snapshot.forEach((doc) => {
    const data = doc.data();
    units[data.id] = data;
  });

  return units;
}

