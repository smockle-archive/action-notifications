"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLateReview = void 0;
const store_1 = require("../store");
async function isLateReview(notification) {
    if (notification.reason !== "review_requested" || !notification.subject.url) {
        return false;
    }
    const pullRequest = await store_1.store.fetchPullRequest(notification.subject.url);
    return pullRequest.state === "closed";
}
exports.isLateReview = isLateReview;
