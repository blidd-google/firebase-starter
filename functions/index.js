const functions = require('firebase-functions');
const admin = require('firebase-admin');
// const firestore = require('firebase-admin/firestore');

admin.initializeApp();
const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.setUnitId = functions.firestore
    .document('units/{docId}')
    .onCreate((snap, context) => {
      const unitWithId = {
        ...snap.data(),
        id: context.params.docId,
      };
      return snap.ref.set(unitWithId);
    });

exports.setTopicId = functions.firestore
    .document('topics/{docId}')
    .onCreate((snap, context) => {
      const topicWithId = {
        ...snap.data(),
        id: context.params.docId,
      };
      return snap.ref.set(topicWithId);
    });

exports.removeChildFromParent = functions.firestore
    .document('units/{docId}')
    .onDelete(async (snap, context) => {
      const data = snap.data();
      if (data.prevId && data.prevId.length > 0) {
        const prevRef = db.doc(`units/${data.prevId}`);
        const prevSnap = await prevRef.get();
        if (prevSnap.exists) {
          return prevRef.set({...prevSnap.data(), nextId: ''});
        }
      }
    });


exports.removeParentFromChild = functions.firestore
    .document('units/{docId}')
    .onDelete(async (snap, context) => {
      const data = snap.data();
      if (data.nextId && data.nextId.length > 0) {
        const nextRef = db.doc(`units/${data.nextId}`);
        const nextSnap = await nextRef.get();
        if (nextSnap.exists) {
          return nextRef.set({...nextSnap.data(), prevId: ''});
        }
      }
    });

exports.onfinalizetest = functions.storage.object().onFinalize((object) => {
  console.log('hello');
});

