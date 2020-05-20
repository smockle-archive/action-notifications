#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const filters_1 = require("./filters");
const store_1 = require("./store");
(async () => {
    try {
        // Retrieve token and use it to construct an authenticated REST API client
        console.log(!!process.env.GITHUB_TOKEN
            ? "Retrieved a GitHub token"
            : "Failed to retrieve a GitHub token");
        // Retrieve collection of filters to apply
        const filterRead = !!core.getInput("filter_read");
        const filterLateReview = !!core.getInput("filter_late_review");
        const filterClosed = !!core.getInput("filter_closed");
        console.log(`Filters: ${[
            filterRead && "filterRead",
            filterLateReview && "filterLateReview",
            filterClosed && "filterClosed",
        ]
            .filter((x) => x)
            .join(", ")}`);
        // Request a list of GitHub notifications
        await store_1.store.fetchNotifications();
        console.log(`Retrieved ${store_1.store.notifications.length} notifications`);
        // Determine ids of notifications to close
        let ids = [];
        for (const notification of store_1.store.notifications) {
            if ((filterRead && filters_1.isRead(notification)) ||
                (filterLateReview && (await filters_1.isLateReview(notification))) ||
                (filterClosed && (await filters_1.isClosed(notification)))) {
                console.log(`Pushing notification with id: ${notification.id}`);
                ids.push(notification.id);
            }
        }
        // Close notifications
        // TODO: Actually close notifications
        console.log(`Closed ${ids.length} notifications out of ${store_1.store.notifications.length}.`);
    }
    catch (error) {
        console.log(error.message);
    }
})();
