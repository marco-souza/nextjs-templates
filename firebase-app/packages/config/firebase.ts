import firebase from "firebase";

import "firebase/auth";

export const firebaseConfig = {
  appId: process.env.APP_ID,
  apiKey: process.env.API_KEY,
  projectId: process.env.PROJECT_ID,
  measurementId: process.env.MEASUREMENT_ID,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  authDomain: `${process.env.PROJECT_ID}.firebaseapp.com`,
  storageBucket: `${process.env.PROJECT_ID}.appspot.com`,
  databaseURL: `https://${process.env.PROJECT_ID}.firebaseio.com`,
};

// Initialize Firebase
export function setupFirebase(): void {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
}
