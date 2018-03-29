const GitHubInterface = require('./GitHubInterface.js');

/**
 * @description Extract events from GitHub across several contexts including
 * 'repo' and 'user'.
 * @export
 * @class Events
 */
module.exports = class Events {

  /**
   * @description Creates an instance of the Contributor class.
   * @param {String} context Name of the context the events are related to
   * @param {String} contextOwner Name of the context owner
   * @param {String} contextName Name of the context
   * @memberof Contributors
   */
  constructor(context, contextOwner, contextName) {
    if (context === null || context === undefined ||
        typeof context != 'string' ) {
      throw new Error(`Expected string value for context parameter. ` +
        `Received: ${context}`);
    }

    // Validate the input parameters
    switch (context) {
      case 'repo':
        if (contextOwner === null || contextOwner === undefined ||
          typeof contextOwner != 'string' ) {
          throw new Error(`Expected string value for contextOwner parameter. ` +
            `Received: ${contextOwner}`);
        }
        if (contextName === null || contextName === undefined ||
          typeof contextName != 'string' ) {
          throw new Error(`Expected string value for contextName parameter. ` +
            `Received: ${contextName}`);
        }
        this.repoName = contextName;
        this.ownerName = contextOwner;
        this.userName = null;
        this.apiUrl = `https://api.github.com/repos/${contextOwner}/${contextName}/events`
        break;
      case 'user':
        if (contextName === null || contextName === undefined ||
          typeof contextName != 'string' ) {
          throw new Error(`Expected string value for contextName parameter. ` +
            `Received: ${contextName}`);
        }
        this.repoName = null;
        this.ownerName = null;
        this.userName = contextName;
        this.apiUrl = `https://api.github.com/users/${contextName}/events`;
        break;
      default:
        throw new Error(`Unable to interpret the supplied input parameters. ` +
          `Received: context: ${context} contextOwner: ${contextOwner} ` +
          `contextName: ${contextName}`);
    }

    this.context = context;
    this.events = [];
  }

  /**
   * @description Retrieve repo contributors information from GitHub
   * @memberof Contributors
   */
  async fetchAllInfo() {
    const response = await GitHubInterface.fetchFromApi(this.apiUrl);
    for (let i = 0; i < response.data.length; i++) {
      const payload = this.processEvent(response.data[i]);
      this.events.push({
        type: response.data[i].type,
        action: response.data[i].payload.action === undefined
          ? 'N/a'
          : response.data[i].payload.action,
        id: response.data[i].id,
        created_at: response.data[i].created_at,
        actor: response.data[i].actor.login,
        payload: payload
      });
    }
  }

  /**
   * @description Parse a GitHub event and extract the relevant event-specific
   * data
   * @param {Object} entry An event object describing the event
   * @returns {Object} An object containin key data about the event
   */
  processEvent(entry) {
    let payload = {};
    switch (entry.type) {
      case 'CommitCommentEvent':
        break;
      case 'CreateEvent':
        switch ( entry.payload.ref_type) {
          case 'branch':
            payload = {
              ref_type: entry.payload.ref_type,
              ref: entry.payload.ref,
              master_branch: entry.payload.master_branch,
              pusher_type: entry.payload.pusher_type
            };
            break;
          case 'repository':
            payload = {
              ref_type: entry.payload.ref_type,
              ref: entry.payload.ref,
              master_branch: entry.payload.master_branch
            };
            break;
          case 'tag':
            payload = {
              ref_type: entry.payload.ref_type,
              ref: entry.payload.ref,
              master_branch: entry.payload.master_branch
            };
            break;
        }
        break;
      case 'DeleteEvent':
        payload = {
          ref_type: entry.payload.ref_type,
          ref: entry.payload.ref,
          pusher_type: entry.payload.pusher_type
        };
        break;
      case 'DeploymentEvent':
        break;
      case 'DeploymentStatusEvent':
        break;
      case 'DownloadEvent':
        break;
      case 'FollowEvent':
        break;
      case 'ForkEvent':
        break;
      case 'ForkApplyEvent':
        break;
      case 'GistEvent':
        break;
      case 'GollumEvent':
        payload = {
          pages: entry.payload.pages
        };
        break;
      case 'InstallationEvent':
        break;
      case 'InstallationRepositoriesEvent':
        break;
      case 'IssueCommentEvent':
        payload = {
          state: entry.payload.issue.state,
          number: entry.payload.issue.number,
          url: entry.payload.issue.url,
          creator: entry.payload.issue.user.login,
          assignee: entry.payload.issue.assignee === null
            ? 'N/a'
            : entry.payload.issue.assignee.login,
          created_at: entry.payload.issue.created_at,
          updated_at: entry.payload.issue.updated_at,
          closed_at: entry.payload.issue.closed_at,
          comment: entry.payload.issue.body
        };
        break;
      case 'IssuesEvent':
        payload = {
          state: entry.payload.issue.state,
          number: entry.payload.issue.number,
          url: entry.payload.issue.url,
          creator: entry.payload.issue.user.login,
          assignee: entry.payload.issue.assignee === null
            ? 'N/a'
            : entry.payload.issue.assignee.login,
          created_at: entry.payload.issue.created_at,
          updated_at: entry.payload.issue.updated_at,
          closed_at: entry.payload.issue.closed_at
        };
        break;
      case 'LabelEvent':
        break;
      case 'MarketplacePurchaseEvent':
        break;
      case 'MemberEvent':
        break;
      case 'MembershipEvent':
        break;
      case 'MilestoneEvent':
        break;
      case 'OrganizationEvent':
        break;
      case 'OrgBlockEvent':
        break;
      case 'PageBuildEvent':
        break;
      case 'ProjectCardEvent':
        break;
      case 'ProjectColumnEvent':
        break;
      case 'ProjectEvent':
        break;
      case 'PublicEvent':
        break;
      case 'PullRequestEvent':
        payload = {
          ref: entry.payload.pull_request.head.label,
          base: entry.payload.pull_request.base.label,
          id: entry.payload.pull_request.id,
          state: entry.payload.pull_request.state,
          title: entry.payload.pull_request.title,
          created_by: entry.payload.pull_request.user.login,
          merged_by: entry.payload.pull_request.merged_by === null
            ? 'N/a'
            : entry.payload.pull_request.merged_by.login,
          commits: entry.payload.pull_request.commits,
          additions: entry.payload.pull_request.additions,
          deletions: entry.payload.pull_request.deletions,
          changed_files: entry.payload.pull_request.changed_files
        };
        break;
      case 'PullRequestReviewEvent':
        break;
      case 'PullRequestReviewCommentEvent':
        payload = {
          creator: entry.payload.comment.user.login,
          pull_request_review_id: entry.payload.comment.pull_request_review_id,
          pull_request_id: entry.payload.pull_request.id,
          pull_request_number: entry.payload.pull_request.number,
          pull_request_state: entry.payload.pull_request.state,
          pull_request_creator: entry.payload.pull_request.user.id,
          comment: entry.payload.comment.body
        };
        break;
      case 'PushEvent':
        payload = {
          ref: entry.payload.ref,
          commits: entry.payload.size,
          id: entry.payload.push_id
        };
        break;
      case 'ReleaseEvent':
        break;
      case 'RepositoryEvent':
        break;
      case 'StatusEvent':
        break;
      case 'TeamEvent':
        break;
      case 'TeamAddEvent':
        break;
      case 'WatchEvent':
        break;
    };
    return payload;
  }
};
