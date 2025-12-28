import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
  User
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from './config';

type AuthResponse = {
  user: User | null;
  error: string | null;
};

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: unknown) {
    const message =
      error instanceof FirebaseError ? error.message : 'Something went wrong';
    return { user: null, error: message };
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // ✅ Fix: use the `name` parameter properly
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: name
      });
    }

    return { user: userCredential.user, error: null };
  } catch (error: unknown) {
    const message =
      error instanceof FirebaseError ? error.message : 'Something went wrong';
    return { user: null, error: message };
  }
}

export async function signInWithGoogle(): Promise<AuthResponse> {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return { user: userCredential.user, error: null };
  } catch (error: unknown) {
    const message =
      error instanceof FirebaseError ? error.message : 'Something went wrong';
    return { user: null, error: message };
  }
}

export async function signOut(): Promise<{ error: string | null }> {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: unknown) {
    const message =
      error instanceof FirebaseError ? error.message : 'Something went wrong';
    return { error: message };
  }
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}
