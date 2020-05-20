import { GitHub } from "@actions/github";

import { Issue, Notification, PullRequest } from "./types";

class Store {
  private readonly octokit: GitHub;

  private _notifications: { [id: string]: Notification } | undefined;
  private _pullRequests: { [url: string]: PullRequest } | undefined;
  private _issues: { [url: string]: Issue } | undefined;

  constructor() {
    this.octokit = new GitHub(process.env.GITHUB_TOKEN!);
  }

  get notifications() {
    return Object.values(this._notifications ?? {});
  }
  set notifications(notifications: Notification[]) {
    // index notification array by id
    this._notifications = notifications.reduce(
      (notifications, notification) => ({
        ...notifications,
        [notification.id]: notification,
      }),
      {}
    );
  }

  async fetchNotifications(): Promise<Notification[]> {
    // if available, return cached notifications
    if (this._notifications) {
      return this.notifications;
    }
    // otherwise, return cached notifications after fetching and caching
    const {
      data: notifications,
    } = await this.octokit.activity.listNotifications();
    this.notifications = notifications;
    return this.notifications;
  }

  async fetchPullRequest(url: string): Promise<PullRequest> {
    // if available, return cached pull request
    if (this._pullRequests?.[url]) {
      return this._pullRequests?.[url];
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

  async fetchIssue(url: string): Promise<Issue> {
    // if available, return cached issue
    if (this._issues?.[url]) {
      return this._issues?.[url];
    }
    // otherwise, return cached issue after fetching and caching
    const [owner, repo, issue_number] = url
      .replace("https://api.github.com/repos/", "")
      .replace("/issues", "")
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

export const store = new Store();
