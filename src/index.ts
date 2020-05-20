#!/usr/bin/env node

import * as core from "@actions/core";

import { isClosed, isLateReview, isRead } from "./filters";
import { store } from "./store";

(async () => {
  try {
    // Retrieve token and use it to construct an authenticated REST API client
    console.log(
      !!process.env.GITHUB_TOKEN
        ? "Retrieved a GitHub token"
        : "Failed to retrieve a GitHub token"
    );

    // Retrieve collection of filters to apply
    const filterRead = !!core.getInput("filter_read");
    const filterLateReview = !!core.getInput("filter_late_review");
    const filterClosed = !!core.getInput("filter_closed");
    console.log(
      `Filters: ${[
        filterRead && "filterRead",
        filterLateReview && "filterLateReview",
        filterClosed && "filterClosed",
      ]
        .filter((x) => x)
        .join(", ")}`
    );

    // Request a list of GitHub notifications
    await store.fetchNotifications();
    console.log(`Retrieved ${store.notifications.length} notifications`);

    // Determine ids of notifications to close
    let ids: string[] = [];
    for (const notification of store.notifications) {
      if (
        (filterRead && isRead(notification)) ||
        (filterLateReview && (await isLateReview(notification))) ||
        (filterClosed && (await isClosed(notification)))
      ) {
        console.log(`Pushing notification with id: ${notification.id}`);
        ids.push(notification.id);
      }
    }

    // Close notifications
    // TODO: Actually close notifications
    console.log(
      `Closed ${ids.length} notifications out of ${store.notifications.length}.`
    );
  } catch (error) {
    console.log(error.message);
  }
})();
