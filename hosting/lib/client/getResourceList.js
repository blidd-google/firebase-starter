import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/client';

export async function getResourceList(topicId) {
  const resourcesRef = collection(db, 'topics', topicId, 'resources');

  const querySnapshot = await getDocs(resourcesRef);

  const resources = [];
  querySnapshot.forEach((doc) => {
    resources.push(doc.data());
  });
  return resources;
}
