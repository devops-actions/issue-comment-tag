import * as core from '@actions/core'
import {Octokit} from 'octokit'
import dotenv from 'dotenv'

// always import the config
dotenv.config()

async function run(): Promise<void> {
  console.log('Starting')
  try {
    const PAT = core.getInput('GITHUB_TOKEN') || process.env.PAT || ''
    var issue = core.getInput('issue') || process.env.issue || ''
    const pr = core.getInput('pr') || process.env.pr || ''
    const team = core.getInput('team') || process.env.team || ''
    let repo = core.getInput('repo') || process.env.repo || ''
    let owner = core.getInput('owner') || process.env.owner || ''
    //Retrieve GitHub endpoint so that Octokit can communicate to the correct GitHub instance instead of the default public "api.github.com"
    let BASE_URL = process.env.GITHUB_API_URL || "https://api.github.com"

    if (!PAT || PAT === '') {
      core.setFailed(
        "Cannot load 'GITHUB_TOKEN' which is required to be able to post the issue"
      )
      return
    }

    if (team === '') {
      core.setFailed(
        "Parameter 'team' is required. Please provide it, can be a single user as well"
      )
      return
    }
    
    if (issue === '' && pr === '') {
      core.setFailed(
        "Either parameters 'pr' or 'issue' is required. Please provide one of them."
      )
      return
    }
    
    if (pr !== ``) {
      // overwrite the issue number with the pr number
      issue = pr
    }


    if (owner === '' || repo === '') {
      core.setFailed(
        "Both parameters 'owner' or 'repo' are required. Please provide both of them."
      )
      return
    }

    // convert owner/repo to repo if needed
    if (repo.indexOf('/') > -1) {
      const parts = repo.split('/')
      owner = parts[0]
      repo = parts[1]
      console.log(`Converted owner/repo input for the repo to owner: [${owner}] and repo: [${repo}]`)
    }

    console.log(`Parameters that we have. Owner: [${owner}], Repo: [${repo}], Issue: [${issue}], team: [${team}] and a token with length: [${PAT.length}]`)
    const octokit = new Octokit({auth: PAT, baseUrl: BASE_URL})   
    // todo: check if the team / user to tag exists at all    

    try {
      console.log(`Getting the list of actions from the issue: [${issue}]`)
      const { data: currentIssue } = await octokit.rest.issues.get({
        owner,
        repo,
        issue_number: +issue,
      });

      console.log(`Found issue: [${currentIssue.title}]`)
      // todo: check if the team is already tagged in the issue body
    } catch (error) {
      core.setFailed(
        `Could not authenticate with GITHUB_TOKEN. Please check that it is correct and that it has [read access] to the organization or user account: ${error}`
      )
      return
    }

    let commentExists = false
    try {
      console.log(`Checking all comments on the issue to prevent us adding the comment twice: [${issue}]`)
      // todo, figure out pagination:
      const {data: comments} = await octokit.rest.issues.listComments({
        owner: owner,
        repo: repo,
        issue_number: +issue,
      })

      console.log(`Found issue comments: ${comments.length}`)
      comments.forEach(comment => {
         console.log(`comment: [${comment.id}] with text [${comment.body}]`)
         if (comment.body !== undefined) {
           // search for the @team in all comments
           if (comment.body.indexOf(`@${team}`) > -1) {
            commentExists = true
           }
         }
      })   

      if (commentExists) {
        console.log(`Comment exists`)
        return
      } else {
        console.log(`Comment does not exist.`)
        console.log(`Adding comment to the issue`)

        const body = `Tagging @${team} for notifications`
        octokit.rest.issues.createComment({
          owner,
          repo,
          issue_number: +issue,
          body,
        });
      }

      
    } catch (error) {
      core.setFailed(
        `Could not authenticate with GITHUB_TOKEN. Please check that it is correct and that it has [read access] to the organization or user account: ${error}`
      )
      return
    }

    console.log('Completed')
    } catch (error) {
      core.setFailed(`Error running action: : ${error}`)
    }
}

run()