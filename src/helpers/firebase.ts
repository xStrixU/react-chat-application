import mime from 'mime';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, uploadString } from 'firebase/storage';

export const signIn = (email: string, password: string) =>
  signInWithEmailAndPassword(getAuth(), email, password);

export const signUp = (email: string, password: string) =>
  createUserWithEmailAndPassword(getAuth(), email, password);

export const uploadImage = (path: string, image: File | string) => {
  const fileRef = ref(getStorage(), path);

  if (typeof image === 'string') {
    return uploadString(fileRef, image, 'data_url', {
      contentType: mime.getType(path) || undefined,
    });
  } else {
    return uploadBytes(fileRef, image);
  }
};
