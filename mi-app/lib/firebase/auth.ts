import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./client";

const usersCollectionName = "users";

type Credentials = {
  email: string;
  password: string;
};

export async function registerWithEmail({ email, password }: Credentials) {
  if (!auth || !db) {
    throw new Error("Firebase no está inicializado.");
  }

  const credential = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(
    doc(db, usersCollectionName, credential.user.uid),
    {
      uid: credential.user.uid,
      Correo: credential.user.email,
      email: credential.user.email,
      provider: credential.user.providerData[0]?.providerId ?? "password",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return credential.user;
}

export async function loginWithEmail({ email, password }: Credentials) {
  if (!auth || !db) {
    throw new Error("Firebase no está inicializado.");
  }

  const credential = await signInWithEmailAndPassword(auth, email, password);

  await setDoc(
    doc(db, usersCollectionName, credential.user.uid),
    {
      uid: credential.user.uid,
      Correo: credential.user.email,
      email: credential.user.email,
      lastLoginAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return credential.user;
}

export function mapAuthErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "Ese correo ya está registrado.";
      case "auth/invalid-email":
        return "El correo electrónico no es válido.";
      case "auth/weak-password":
        return "La contraseña debe tener al menos 6 caracteres.";
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Correo o contraseña incorrectos.";
      case "auth/network-request-failed":
        return "No se pudo conectar con Firebase. Revisa tu red.";
      case "auth/too-many-requests":
        return "Demasiados intentos. Intenta de nuevo más tarde.";
      default:
        return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error inesperado al autenticar.";
}