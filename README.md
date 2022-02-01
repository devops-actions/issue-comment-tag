# devops-actions/issue-comment-tag
Tag a user or a team in an issue comment

Sometimes you want to tag a team or multiple persons when an issue (or something else) is created. This action will help you do that by tagging them in an issue.


# Usage:

Requirements:

A GitHub Apps [https://docs.github.com/en/developers/apps/getting-started-with-apps/about-apps#about-github-apps] installed on the repository/organization that the GitHub Actions Workflow will execute from
The GitHub Apps minimally should have the following permissions:
  - Read & write access to Issues
  - Read-only access to Members
  - Read-only access to Administration (Only applicable for GitHub Enterprise Server)
A method to retrieve `GITHUB_TOKEN` (script/action), a good example for action would be `peter-murray/workflow-application-token-action`

``` yaml
  - uses: devops-actions/issue-comment-tag
    with:
      team: < insert team or user name >
      issue: ${{ github.issue.number }}
      owner: ${{ github.repository_owner }}
      repo: ${{ github.repository_name }}
      GITHUB_TOKEN: ${{ GITHUB_TOKEN }}
```

# Example workflow:
``` yaml
on:
  issues:
    types: [opened]
    
jobs:
  tag-a-user:
    runs-on: ubuntu-latest
    steps: 
      - uses: devops-actions/issue-comment-tag
        name: Tag a user or team in an issue comment
        with: 
          issue: ${{ github.issue.number }}
          team: < insert team or user name >
          owner: ${{ github.repository_owner }}
          repo: ${{ github.repository_name }}
          GITHUB_TOKEN: ${{ GITHUB_TOKEN }}
```