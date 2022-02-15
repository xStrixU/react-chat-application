import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';

import type { ReactNode } from 'react';

import { getChannelId, getUser } from 'helpers/user';
import { useAuth } from './AuthProvider';

import type {
  Channel,
  ChannelMessage,
  FirestoreChannelMessage,
  UserData,
} from 'types/types';

interface ChannelContextValue {
  channels: Channel[];
  channel: Channel | null;
  messages: ChannelMessage[];

  setChannel(channel: Channel): void;
  setChannelWithUser(userData: UserData): void;
}

const ChannelContext = createContext<ChannelContextValue | undefined>(
  undefined
);

export const ChannelProvider = ({ children }: { children: ReactNode }) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<ChannelMessage[]>([]);

  const { user } = useAuth();

  const setChannelWithUser = async ({ uid }: UserData) => {
    const channelId = await getChannelId(uid);
    const channel =
      channels.find(channel => channel.channelId === channelId) || null;

    setChannel(channel);
  };

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      query(collection(getFirestore(), 'users', user.uid, 'channels')),
      querySnapshot => {
        querySnapshot.docChanges().forEach(async ({ doc, type }) => {
          if (type === 'added') {
            const channel: Channel = {
              channelId: doc.data().channelId,
              userData: await getUser(doc.id),
            };

            setChannels(channels => [channel, ...channels]);
          }
        });
      }
    );

    return () => {
      setChannels([]);
      setChannel(null);

      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    if (!channel) return;

    const unsubscribe = onSnapshot(
      query(
        collection(getFirestore(), 'channels', channel.channelId, 'messages'),
        orderBy('created')
      ),
      querySnapshot => {
        querySnapshot.docChanges().forEach(async ({ doc, type }) => {
          if (type === 'added') {
            const { created, userUid, content } =
              doc.data() as FirestoreChannelMessage;
            const userData = await getUser(userUid);

            setMessages(messages => [
              ...messages,
              {
                created,
                userData,
                content,
              },
            ]);
          }
        });
      }
    );

    return () => {
      setMessages([]);

      unsubscribe();
    };
  }, [channel]);

  return (
    <ChannelContext.Provider
      value={{ channels, channel, messages, setChannel, setChannelWithUser }}
    >
      {children}
    </ChannelContext.Provider>
  );
};

export const useChannel = () => {
  const context = useContext(ChannelContext);

  if (context === undefined) {
    throw new Error('useChannel needs to be used inside ChannelProvider!');
  }

  return context;
};
