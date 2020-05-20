import { store } from "../store";
import { Notification } from "../types";

export async function isClosed(notification: Notification): Promise<boolean> {
  if (!notification.subject.url) {
    return false;
  }

  let item: { state: string };
  if (/\/issues\/\d+$/.test(notification.subject.url)) {
    item = await store.fetchIssue(notification.subject.url);
  } else if (/\/pulls\/\d+$/.test(notification.subject.url)) {
    item = await store.fetchPullRequest(notification.subject.url);
  } else {
    return false;
  }
  return item.state === "closed";
}
