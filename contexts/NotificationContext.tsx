// contexts/NotificationContext.tsx
import * as Notifications from 'expo-notifications';
import React, { createContext, useContext, useState } from 'react';

// Use a more specific type
interface NotificationContextType {
  lastNotification: Notifications.Notification | null;
  setLastNotification: (notification: Notifications.Notification | null) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  lastNotification: null,
  setLastNotification: () => {},
});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [lastNotification, setLastNotification] = useState<Notifications.Notification | null>(null);
  
  // Add debugging to track updates
  // useEffect(() => {
  //   console.log("NotificationContext - notification state changed:", lastNotification);
  // }, [lastNotification]);
  
  const contextValue = {
    lastNotification,
    setLastNotification,
  };
  
  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);