import { collection, onSnapshot, query, where } from 'firebase/firestore';
import useSWRSubscription, { SWRSubscriptionOptions } from 'swr/subscription';
import { database } from '@/utils/firebase';

export const useNotifications = (userId: string) => {
  return useSWRSubscription<TNotification[], unknown>(`notifications-${userId}`, (_: any, { next }: SWRSubscriptionOptions<TNotification[], unknown>) => {
    const collectionRef = collection(database, 'notifications');
    const q = query(collectionRef, where('user_id', '==', userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notifications: TNotification[] = [];
      querySnapshot.forEach((doc) => {
        notifications.push({ ...doc.data() as TNotification, id: doc.id });
      });
      next(null, notifications);
    });

    return () => unsubscribe();
  });
};