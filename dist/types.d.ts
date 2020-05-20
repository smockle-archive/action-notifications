import type { GitHub } from "@actions/github";
export declare type Unpacked<T> = T extends (infer U)[] ? U : T extends PromiseLike<infer U> ? U : T;
export declare type Notification = Unpacked<Unpacked<ReturnType<typeof GitHub.prototype.activity.listNotifications>>["data"]>;
export declare type PullRequest = Unpacked<ReturnType<typeof GitHub.prototype.pulls.get>>["data"];
export declare type Issue = Unpacked<ReturnType<typeof GitHub.prototype.issues.get>>["data"];
