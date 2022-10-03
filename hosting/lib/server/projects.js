import { db } from '../../firebase/admin';

export async function getProjects() {
  const projectCollection = db.collection('projects');
  const snapshot = await projectCollection.get();
  const projects = [];
  snapshot.forEach((doc) => {
    projects.push(doc.data());
  });
  return projects;
}

export async function getProjectDetails(id) {
  const doc = await db.collection('projects').doc(id).get();
  return doc.data();
}

export async function getProjectData(id) {
  const projectCollection = db.collection('projects');
  const projectDoc = await projectCollection.doc(id).get();

  if (!projectDoc.exists) {
    return null;
  }

  return projectDoc.data();
}

export async function getUnitsForProject(id) {
  const unitCollection = db.collection('units');
  const snapshot = await unitCollection.where('projectId', '==', id).get();

  // const units = {
  //   backlog: [],
  //   todo: [],
  //   inProgress: [],
  // };
  // snapshot.forEach((doc) => {
  //   const data = doc.data();
  //   switch (data.status) {
  //     case 0:
  //       units.backlog.push(data);
  //       break;
  //     case 1:
  //       units.todo.push(data);
  //       break;
  //     case 2:
  //       units.inProgress.push(data);
  //       break;
  //     default:
  //       console.log('invalid status');
  //       break;
  //   }
  // });

  // const units = {};
  // for (const status of statuses) {
  //   units[status] = [];
  // }
  // snapshot.forEach((doc) => {
  //   const data = doc.data();
  //   console.log('data status', data.status);
  //   units[data.status].push(data);
  // });
  const units = {};
  snapshot.forEach((doc) => {
    const data = doc.data();
    units[data.id] = data;
  });

  console.log('units:', units);
  return units;
}

export async function getTopicsForProject(id) {
  const topicsRef = db.collection('topics');
  const snapshot = await topicsRef.where('projectId', '==', id).get();
  if (snapshot.docs.length === 0) {
    return {};
  }

  const topics = {};
  snapshot.forEach((topicDoc) => {
    topics[topicDoc.id] = topicDoc.data();
  });

  for (const topicId in topics) {
    // prettier-ignore
    const resourcesRef = db
        .collection('topics')
        .doc(topicId)
        .collection('resources');
    const snapshot = await resourcesRef.get();
    topics[topicId].resources = [];
    snapshot.forEach((resourceDoc) => {
      topics[topicId].resources.push(resourceDoc.data());
    });
  }

  const topicsArr = [];
  for (const topicId in topics) {
    topicsArr.push(topics[topicId]);
  }

  return topicsArr;
}
