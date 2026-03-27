import React, { createContext, useContext, useState } from "react";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
}

interface NotificationContextProps {
  notifications: AppNotification[];
  addNotification: (title: string, message: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextProps>({} as any);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const addNotification = (title: string, message: string) => {
    setNotifications(prev => [{ id: Date.now().toString(), title, message, read: false }, ...prev]);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAllAsRead,
      unreadCount: notifications.filter(n => !n.read).length
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
