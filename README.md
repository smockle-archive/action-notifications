# action-notifications

An action which closes GitHub notifications.

## Inputs

### `filter_read`

**Optional** Whether to filter read notifications. Default: `false`

### `filter_late_review`

**Optional** Whether to filter review requests for closed (merged or unmerged) pull requests. Default: `false`

### `filter_closed`

**Optional** Whether to filter closed issues and pull requests. Default: `false`

## Environment Variables

### `GITHUB_TOKEN`

**Required** A token to authenticate on behalf of the GitHub App installed on your repository.

## Example usage

```YAML
- name: Resolve notifications
  uses: "smockle/action-notifications@main"
  with:
    filter_read: true
    filter_late_review: true
    filter_closed: true
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
