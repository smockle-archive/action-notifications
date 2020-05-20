#!/usr/bin/env node

import core from "@actions/core";

import { isClosed, isLateReview, isRead } from "./filters";
import { store } from "./store";

(async () => {
  try {
    // Retrieve token and use it to construct an authenticated REST API client
    core.debug(
      !!process.env.GITHUB_TOKEN
        ? "Retrieved a GitHub token"
        : "Failed to retrieve a GitHub token"
    );

    // Retrieve collection of filters to apply
    const filterRead = !!core.getInput("filter_read");
    const filterLateReview = !!core.getInput("filter_late_review");
    const filterClosed = !!core.getInput("filter_closed");

    // Request a list of GitHub notifications
    await store.fetchNotifications();

    // Determine ids of notifications to close
    let ids: string[] = [];
    for (const notification of store.notifications) {
      if (
        (filterRead && isRead(notification)) ||
        (filterLateReview && (await isLateReview(notification))) ||
        (filterClosed && (await isClosed(notification)))
      ) {
        ids.push(notification.id);
      }
    }

    // Close notifications
    // TODO: Actually close notifications
    console.log(
      `Closed ${ids.length} notifications out of ${store.notifications.length}.`
    );
  } catch (error) {
    core.setFailed(error.message);
  }
})();
