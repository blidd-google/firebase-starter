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
  const q = query(
      collection(db, 'stacks'),
      where('habitIDs', 'array-contains', id),
  );

  const promises = [];
  const snapshot = await getDocs(q);
  snapshot.forEach((docSnap) => {
    const stack = docSnap.data();
    const index = stack.habitIDs.indexOf(id);
    if (index > -1) {
      stack.habitIDs.splice(index, 1);
    }
    const promise = setDoc(doc(db, 'stacks', stack.id), stack);
    promises.push(promise);
  });

  await Promise.all(promises);
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

export async function getAllHabitsFromClient() {
  const ref = collection(db, 'habits');
  const snapshot = await getDocs(ref);
  const habits = {};
  snapshot.forEach((doc) => {
    const data = doc.data();
    habits[data.id] = data;
  });

  return habits;
}

export async function getAllStacksFromClient() {
  const ref = collection(db, 'stacks');
  const snapshot = await getDocs(ref);
  const stacks = {};
  snapshot.forEach((doc) => {
    const data = doc.data();
    stacks[data.id] = data;
  });

  return stacks;
}

export async function createStack(data) {
  if (!data.title) {
    throw new Error('Failed to create stack: title not specified');
  }

  const docRef = await addDoc(collection(db, 'stacks'), data);
  await setDoc(docRef, { id: docRef.id }, { merge: true });
  console.log('CREATE', data);
  return docRef.id;
}

export async function putStack(data) {
  if (data.id === undefined) {
    throw new Error('Failed to create stack: no id specified');
  }

  console.log('PUT:', data);
  try {
    await setDoc(doc(db, 'stacks', data.id), data);
  } catch (err) {
    console.log(err);
  }
}
