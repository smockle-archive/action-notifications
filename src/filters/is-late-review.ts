import { store } from "../store";
import { Notification } from "../types";

export async function isLateReview(
  notification: Notification
): Promise<boolean> {
  if (notification.reason !== "review_requested" || !notification.subject.url) {
    return false;
  }

  const pullRequest = await store.fetchPullRequest(notification.subject.url);
  return pullRequest.state === "closed";
}
