import firebase from "firebase";
import nookies from "nookies";

import { UserProfile } from "#/packages/entities/types";

const TOKEN_KEY = "token";

// Login and save credentials
export async function makeLogin(): Promise<firebase.auth.UserCredential> {
  const provider = new firebase.auth.GoogleAuthProvider();
  const result = await firebase.auth().signInWithPopup(provider);
  return result;
}

// Reset local credentials
export async function makeLogout() {
  await firebase.auth().signOut();
  nookies.set(undefined, TOKEN_KEY, "", {});
}

export async function getUserProfile(): Promise<UserProfile> {
  const user = firebase.auth().currentUser;
  if (user == null || user.displayName == null || user.email == null)
    throw new TypeError("Firebase user is not available");

  // Set user cookies
  const token = await user.getIdToken();
  nookies.set(undefined, TOKEN_KEY, token, {});

  return {
    displayName: user.displayName,
    email: user.email,
  };
}
