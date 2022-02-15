import { getAuth } from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

import { signUp as firebaseSignUp, uploadImage } from './firebase';

import type {
  Channel,
  ChannelMessage,
  FirestoreChannelMessage,
  FirestoreUserData,
  UserData,
  UserUid,
} from 'types/types';

import defaultProfilePicture from 'assets/images/default-profile-picture.jpg';

const usersCache: Record<UserUid, UserData> = {};

const loadUser = async (uid: UserUid) => {
  const userDocSnap = await getDoc(doc(getFirestore(), 'users', uid));

  if (!userDocSnap.exists()) {
    throw new Error(`User with unique id: ${uid} not found!`);
  }

  const firestoreUserData = userDocSnap.data() as FirestoreUserData;
  const profilePicture = await getDownloadURL(
    ref(getStorage(), `profile-pictures/${uid}.png`)
  );

  const userData: UserData = {
    uid,
    profilePicture,
    ...firestoreUserData,
  };

  usersCache[uid] = userData;

  return userData;
};

const checkIfLoggedIn = () => {
  const user = getAuth().currentUser;

  if (user === null) {
    throw new Error('You are not logged in!');
  }

  return user;
};

export const getUser = async (uid: UserUid) =>
  usersCache[uid] ?? (await loadUser(uid));

export const signUp = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  const {
    user: { uid },
  } = await firebaseSignUp(email, password);
  const username = `${firstName} ${lastName}`;

  await setDoc(doc(getFirestore(), 'users', uid), {
    username,
    lowercaseUsername: username.toLowerCase(),
  });
  await uploadImage(`profile-pictures/${uid}.png`, defaultProfilePicture);
};

export const setFirestoreData = async (data: FirestoreUserData) => {
  const { uid } = checkIfLoggedIn();
  const cachedUser = await getUser(uid);

  usersCache[cachedUser.uid] = {
    ...cachedUser,
    ...data,
  };

  await setDoc(doc(getFirestore(), 'users', uid), data);
};

export const setProfilePicture = async (image: File | string) => {
  const { uid } = checkIfLoggedIn();

  await uploadImage(`profile-pictures/${uid}.png`, image);
};

export const findUsers = async (username: string) => {
  const querySnapshot = await getDocs(
    query(
      collection(getFirestore(), 'users'),
      orderBy('lowercaseUsername'),
      where('lowercaseUsername', '>=', username)
    )
  );
  const currentUser = getAuth().currentUser;
  const usersData = await Promise.all(
    querySnapshot.docs
      .filter(doc => currentUser === null || doc.id !== currentUser.uid)
      .map(async doc => await getUser(doc.id))
  );

  return usersData;
};

export const getChannels = async () => {
  const { uid } = checkIfLoggedIn();
  const querySnapshot = await getDocs(
    query(collection(getFirestore(), 'users', uid, 'channels'))
  );
  const channels: Channel[] = await Promise.all(
    querySnapshot.docs.map(async doc => ({
      userData: await getUser(doc.id),
      channelId: doc.data().channelId,
    }))
  );

  return channels;
};

export const createChannel = async (uid: UserUid) => {
  const user = checkIfLoggedIn();
  const data = { channelId: uuidv4() };

  await setDoc(doc(getFirestore(), 'users', user.uid, 'channels', uid), data);
  await setDoc(doc(getFirestore(), 'users', uid, 'channels', user.uid), data);

  return data.channelId;
};

export const getChannelId = async (uid: UserUid) => {
  const user = checkIfLoggedIn();

  const docSnap = await getDoc(
    doc(getFirestore(), 'users', user.uid, 'channels', uid)
  );

  return docSnap.exists()
    ? (docSnap.data().channelId as string)
    : createChannel(uid);
};

export const getMessages = async (channelId: string) => {
  const querySnapshot = await getDocs(
    query(
      collection(getFirestore(), 'channels', channelId, 'messages'),
      orderBy('created')
    )
  );
  const messages: ChannelMessage[] = await Promise.all(
    querySnapshot.docs.map(async doc => {
      const { created, userUid, content } =
        doc.data() as FirestoreChannelMessage;

      return {
        created,
        content,
        userData: await getUser(userUid),
      };
    })
  );

  return messages;
};

export const putMessage = async (channelId: string, content: string) => {
  const user = checkIfLoggedIn();
  const message: FirestoreChannelMessage = {
    created: Timestamp.now().seconds,
    userUid: user.uid,
    content,
  };

  await addDoc(
    collection(getFirestore(), 'channels', channelId, 'messages'),
    message
  );
};
