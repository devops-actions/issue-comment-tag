# github-action-issue-comment-tag
Tag a user or a team in an issue comment

Sometimes you want to tag a team or multiple persons when an issue (or something else) is created. This action will help you do that by tagging them in an issue.


# Usage:

``` yaml
  - uses: rajbos/github-action-issue-comment-tag
    with:
      team: < insert team or user name >
      issue: ${{ github.issue.number }}
      owner: ${{ github.repository_owner }}
      repo: ${{ github.repository_name }}
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
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
      - uses: rajbos/github-action-issue-comment-tag
        name: Tag a user or team in an issue comment
        with: 
          issue: ${{ github.issue.number }}
          team: < insert team or user name >
          owner: ${{ github.repository_owner }}
          repo: ${{ github.repository_name }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```