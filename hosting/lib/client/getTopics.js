import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/client';

export async function getTopics(projectId) {
  const topicsRef = collection(db, 'topics');

  const q = query(topicsRef, where('projectId', '==', projectId));
  const querySnapshot = await getDocs(q);

  const topics = [];
  querySnapshot.forEach((doc) => {
    topics.push(doc.data());
  });
  return topics;
}
