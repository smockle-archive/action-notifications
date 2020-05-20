import { Notification } from "../types";

export function isRead(notification: Notification): boolean {
  return notification.unread === false;
}
