import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/client';

export async function getUnitList(projectId, status) {
  const unitsRef = collection(db, 'units');

  // prettier-ignore
  const q = query(
      unitsRef,
      where('projectId', '==', projectId),
      where('status', '==', status),
  );
  const snapshot = await getDocs(q);

  const units = [];
  snapshot.forEach((doc) => {
    units.push(doc.data());
  });
  return units;
}
