export type UserUid = string;

export type ChannelId = string;

export interface Channel {
  channelId: ChannelId;
  userData: UserData;
}

export interface ChannelMessage {
  created: number;
  userData: UserData;
  content: string;
}

export interface FirestoreChannelMessage {
  created: number;
  userUid: UserUid;
  content: string;
}

export interface FirestoreUserData {
  firstName: string;
  lastName: string;
}

export interface UserData extends FirestoreUserData {
  uid: UserUid;
  profilePicture: string;
}
