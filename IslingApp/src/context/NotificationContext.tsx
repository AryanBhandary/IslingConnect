import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
}

export interface AppointmentStatusEvent {
  appointmentId?: string;
  department?: string;
  status?: string;
}

interface NotificationContextProps {
  notifications: AppNotification[];
  addNotification: (title: string, message: string) => void;
  addAppointmentNotification: (event: AppointmentStatusEvent) => void;
  markAllAsRead: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextProps>({} as any);
let notificationSequence = 0;
const STORAGE_KEY_PREFIX = "isling_notifications";

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [storageKey, setStorageKey] = useState<string | null>(null);
  const recentEventMapRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const initStorage = async () => {
      try {
        const userJson = await AsyncStorage.getItem("user");
        let userId = "guest";

        if (userJson) {
          const user = JSON.parse(userJson);
          userId = user?.id || user?._id || "guest";
        }

        const key = `${STORAGE_KEY_PREFIX}_${userId}`;
        setStorageKey(key);

        const saved = await AsyncStorage.getItem(key);
        if (!saved) return;

        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return;

        const normalized: AppNotification[] = parsed.map((n: any, index: number) => ({
          id: String(n?.id ?? `${Date.now()}-${index}`),
          title: String(n?.title ?? "Notification"),
          message: String(n?.message ?? ""),
          read: Boolean(n?.read),
          createdAt: Number(n?.createdAt ?? Date.now()),
        }));

        setNotifications(normalized);
      } catch (error) {
        console.error("Failed to load notifications from storage", error);
      }
    };

    initStorage();
  }, []);

  useEffect(() => {
    const persistNotifications = async () => {
      if (!storageKey) return;
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(notifications));
      } catch (error) {
        console.error("Failed to save notifications to storage", error);
      }
    };

    persistNotifications();
  }, [notifications, storageKey]);

  const addNotification = useCallback((title: string, message: string) => {
    notificationSequence += 1;
    const uniqueId = `${Date.now()}-${notificationSequence}`;
    setNotifications(prev => [{
      id: uniqueId,
      title,
      message,
      read: false,
      createdAt: Date.now()
    }, ...prev]);
  }, []);

  const addAppointmentNotification = useCallback((event: AppointmentStatusEvent) => {
    const appointmentId = event.appointmentId || "unknown";
    const department = event.department || "Appointment";
    const status = event.status || "Updated";
    const eventKey = `${appointmentId}-${department}-${status}`;
    const now = Date.now();
    const lastSeenAt = recentEventMapRef.current[eventKey] || 0;

    // Ignore duplicate event bursts from socket reconnect/re-subscribe behavior.
    if (now - lastSeenAt < 10000) return;

    recentEventMapRef.current[eventKey] = now;
    addNotification(
      "Appointment Update",
      `Your ${department} appointment status is now: ${status}`
    );
  }, [addNotification]);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const value = useMemo(() => ({
    notifications,
    addNotification,
    addAppointmentNotification,
    markAllAsRead,
    unreadCount: notifications.filter(n => !n.read).length
  }), [notifications, addNotification, addAppointmentNotification, markAllAsRead]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
