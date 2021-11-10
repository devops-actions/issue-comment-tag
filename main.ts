import * as core from '@actions/core'
import {Octokit} from 'octokit'
import dotenv from 'dotenv'

// always import the config
dotenv.config()

async function run(): Promise<void> {
  core.info('Starting')
  console.log('Starting')
  try {
    const PAT = core.getInput('GITHUB_TOKEN') || process.env.PAT || ''
    const issue = core.getInput('issue') || process.env.issue || ''
    const team = core.getInput('team') || process.env.team || ''
    const repo = core.getInput('repo') || process.env.repo || ''
    const owner = core.getInput('owner') || process.env.owner || ''

    if (!PAT || PAT === '') {
      core.setFailed(
        "Cannot load 'GITHUB_TOKEN' which is required to be able to post the issue"
      )
      return
    }

    if (team === '' && issue === '') {
      core.setFailed(
        "Both parameters 'team' or 'issue' are required to load all actions from it. Please provide one of them."
      )
      return
    }

    if (owner === '' && repo === '') {
      core.setFailed(
        "Both parameters 'owner' or 'repo' are required to load all actions from it. Please provide one of them."
      )
      return
    }

    console.log(`Parameters that we have. Owner: [${owner}], Repo: [${repo}], Issue: [${issue}], team: [${team}] and a token with length: [${PAT.length}]`)
    const octokit = new Octokit({auth: PAT})    
    try {
      console.log(`Getting the list of actions from the issue: [${issue}]`)
      const { data: currentIssue } = await octokit.rest.issues.get({
        owner,
        repo,
        issue_number: +issue,
      });

      console.log(`Found issue: ${currentIssue.title}`)
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
         console.log(`comment: [${comment.id}] with text [${comment.body_text}] and [${comment.body}]`)
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