"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isClosed = void 0;
const store_1 = require("../store");
async function isClosed(notification) {
    if (!notification.subject.url) {
        return false;
    }
    let item;
    if (/\/issues\/\d+$/.test(notification.subject.url)) {
        item = await store_1.store.fetchIssue(notification.subject.url);
    }
    else if (/\/pulls\/\d+$/.test(notification.subject.url)) {
        item = await store_1.store.fetchPullRequest(notification.subject.url);
    }
    else {
        return false;
    }
    return item.state === "closed";
}
exports.isClosed = isClosed;
