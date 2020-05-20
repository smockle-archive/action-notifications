import type { GitHub } from "@actions/github";

// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types
export type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends PromiseLike<infer U>
  ? U
  : T;

export type Notification = Unpacked<
  Unpacked<
    ReturnType<typeof GitHub.prototype.activity.listNotifications>
  >["data"]
>;

export type PullRequest = Unpacked<
  ReturnType<typeof GitHub.prototype.pulls.get>
>["data"];

export type Issue = Unpacked<
  ReturnType<typeof GitHub.prototype.issues.get>
>["data"];
