"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const github_1 = require("@actions/github");
class Store {
    constructor() {
        this.octokit = new github_1.GitHub(process.env.GITHUB_TOKEN);
    }
    get notifications() {
        var _a;
        return Object.values((_a = this._notifications) !== null && _a !== void 0 ? _a : {});
    }
    set notifications(notifications) {
        // index notification array by id
        this._notifications = notifications.reduce((notifications, notification) => ({
            ...notifications,
            [notification.id]: notification,
        }), {});
    }
    async fetchNotifications() {
        // if available, return cached notifications
        if (this._notifications) {
            return this.notifications;
        }
        // otherwise, return cached notifications after fetching and caching
        const { data: notifications, } = await this.octokit.activity.listNotifications();
        this.notifications = notifications;
        return this.notifications;
    }
    async fetchPullRequest(url) {
        var _a, _b;
        // if available, return cached pull request
        if ((_a = this._pullRequests) === null || _a === void 0 ? void 0 : _a[url]) {
            return (_b = this._pullRequests) === null || _b === void 0 ? void 0 : _b[url];
        }
        // otherwise, return cached pull request after fetching and caching
        const [owner, repo, pull_number] = url
            .replace("https://api.github.com/repos/", "")
            .replace("/pulls", "")
            .split("/");
        const { data: pullRequest } = await this.octokit.pulls.get({
            owner,
            repo,
            pull_number: Number(pull_number),
        });
        this._pullRequests = {
            ...this._pullRequests,
            [url]: pullRequest,
        };
        return pullRequest;
    }
    async fetchIssue(url) {
        var _a, _b;
        // if available, return cached pull request
        if ((_a = this._issues) === null || _a === void 0 ? void 0 : _a[url]) {
            return (_b = this._issues) === null || _b === void 0 ? void 0 : _b[url];
        }
        // otherwise, return cached pull request after fetching and caching
        const [owner, repo, issue_number] = url
            .replace("https://api.github.com/repos/", "")
            .replace("/pulls", "")
            .split("/");
        const { data: issue } = await this.octokit.issues.get({
            owner,
            repo,
            issue_number: Number(issue_number),
        });
        this._issues = {
            ...this._issues,
            [url]: issue,
        };
        return issue;
    }
}
exports.store = new Store();
