import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/client';


export async function putStack(data) {
  if (data.id === undefined) {
    throw new Error('Failed to create stack: no id specified');
  }
  if (data.title === undefined) {
    throw new Error('Failed to create stack: no title specified');
  }
  try {
    await setDoc(doc(db, 'stacks', data.id), data);
  } catch (err) {
    console.log(err);
  }
}
