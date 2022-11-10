import { db } from '../../firebase/admin';

export async function getAllHabits() {
  const unitCollection = db.collection('units');
  const snapshot = await unitCollection.where('type', '==', 'habit').get();
  const habits = {};
  snapshot.forEach((doc) => {
    const data = doc.data();
    habits[data.id] = data;
  });
  return habits;
}

export async function getAllStacks() {
  const ref = db.collection('stacks');
  const snapshot = await ref.get();
  const stacks = {};
  snapshot.forEach((doc) => {
    const data = doc.data();
    stacks[data.id] = data;
  });
  return stacks;
}
