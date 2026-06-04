import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/api";

import styles from "./NotificationsList.module.css";

function NotificationsList({ title }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load notifications:", error);
      setNotifications([]);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read,
  ).length;

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      await loadNotifications();
      window.dispatchEvent(new Event("notificationsUpdated"));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      alert("Failed to update notification.");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      await loadNotifications();
      window.dispatchEvent(new Event("notificationsUpdated"));
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      alert("Failed to update notifications.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            className={styles.markAllButton}
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className={styles.emptyMessage}>
          You do not have any notifications.
        </p>
      ) : (
        <div className={styles.list}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`${styles.card} ${
                !notification.is_read ? styles.unread : ""
              }`}
            >
              <div className={styles.notificationContent}>
                <div className={styles.notificationTop}>
                  <span className={styles.icon}>
                    {!notification.is_read ? "🔵" : "✅"}
                  </span>

                  <h3>{notification.title}</h3>
                </div>

                <p>{notification.message}</p>

                <div className={styles.meta}>
                  <small>{notification.created_at}</small>

                  <span
                    className={`${styles.statusText} ${
                      !notification.is_read
                        ? styles.unreadText
                        : styles.readText
                    }`}
                  >
                    {!notification.is_read ? "Unread" : "Read"}
                  </span>
                </div>
              </div>

              {!notification.is_read && (
                <button
                  className={styles.readButton}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  Mark as read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsList;
