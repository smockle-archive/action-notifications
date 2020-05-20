"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRead = void 0;
function isRead(notification) {
    return notification.unread === false;
}
exports.isRead = isRead;
