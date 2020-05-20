#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("@actions/core"));
const filters_1 = require("./filters");
const store_1 = require("./store");
(async () => {
    try {
        // Retrieve token and use it to construct an authenticated REST API client
        core_1.default.debug(!!process.env.GITHUB_TOKEN
            ? "Retrieved a GitHub token"
            : "Failed to retrieve a GitHub token");
        // Retrieve collection of filters to apply
        const filterRead = !!core_1.default.getInput("filter_read");
        const filterLateReview = !!core_1.default.getInput("filter_late_review");
        const filterClosed = !!core_1.default.getInput("filter_closed");
        // Request a list of GitHub notifications
        await store_1.store.fetchNotifications();
        // Determine ids of notifications to close
        let ids = [];
        for (const notification of store_1.store.notifications) {
            if ((filterRead && filters_1.isRead(notification)) ||
                (filterLateReview && (await filters_1.isLateReview(notification))) ||
                (filterClosed && (await filters_1.isClosed(notification)))) {
                ids.push(notification.id);
            }
        }
        // Close notifications
        // TODO: Actually close notifications
        console.log(`Closed ${ids.length} notifications out of ${store_1.store.notifications.length}.`);
    }
    catch (error) {
        core_1.default.setFailed(error.message);
    }
})();
