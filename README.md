[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/devops-actions/issue-comment-tag/badge)](https://api.securityscorecards.dev/projects/github.com/devops-actions/issue-comment-tag)

# devops-actions/issue-comment-tag
Tag a user or a team in an issue comment

Sometimes you want to tag a team or multiple persons when an issue (or something else) is created. This action will help you do that by tagging them in an issue by making a comment that tags them.
##### Note: only tagging a single person or a single team is currently supported.

# Usage:

## Required Permissions

This action requires specific GitHub token permissions to function correctly. You must grant these permissions in your workflow:

``` yaml
permissions:
  issues: write           # Required when working with issues
  pull-requests: write    # Required when working with pull requests
```

**Note:** If you do not set these permissions and your workflow has restricted permissions elsewhere, the action will fail with a clear error message indicating which permissions are missing.

## Requirements

A [GitHub App](https://docs.github.com/en/developers/apps/getting-started-with-apps/about-apps#about-github-apps) installed on the repository/organization that the GitHub Actions Workflow will execute from.
The GitHub Apps minimally should have the following permissions:
  - Read & write access to Issues
  - Read-only access to Members
  - Read-only access to Administration (Only applicable for GitHub Enterprise Server)
A method to retrieve an access token from the App, a good example for an action would be [this action](https://github.com/peter-murray/workflow-application-token-action).

``` yaml
  - uses: devops-actions/issue-comment-tag@v0.1.0
    with:
      team: < insert team or user name >
      issue: ${{ github.event.issue.number }}
      owner: ${{ github.repository_owner }}
      repo: ${{ github.repository }}
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

# Example workflow:
``` yaml
on:
  issues:
    types: [opened]

permissions:
  issues: write
    
jobs:
  tag-a-user:
    runs-on: ubuntu-latest
    steps: 
      - uses: devops-actions/issue-comment-tag@v0.1.0
        name: Tag a user or team in an issue comment
        with: 
          issue: ${{ github.event.issue.number }}
          team: < insert team or user name >
          owner: ${{ github.repository_owner }}
          repo: ${{ github.repository }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Important:** If you have limited permissions elsewhere in your workflow, you must explicitly grant the required permissions:
``` yaml
permissions:
  issues: write           # Required for issues
  pull-requests: write    # Required for pull requests
```

## Tagging an internal team or user
If you need to tag an internal team `@<org name>/team` or user, then you need to send in an **Access Token** that has the rights to do so: the normal `GITHUB_TOKEN` doesn't have access outside the current repository, which also means it cannot see the users in the organization.

If you are using a GitHub App for creating the access token, you need to give the App the following scope:
- Organization permissions - Members: Read only
