import { Issue, Notification, PullRequest } from "./types";
declare class Store {
    private readonly octokit;
    private _notifications;
    private _pullRequests;
    private _issues;
    constructor();
    get notifications(): Notification[];
    set notifications(notifications: Notification[]);
    fetchNotifications(): Promise<Notification[]>;
    fetchPullRequest(url: string): Promise<PullRequest>;
    fetchIssue(url: string): Promise<Issue>;
}
export declare const store: Store;
export {};
