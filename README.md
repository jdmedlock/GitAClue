# GitAClue - GitHub Information Extraction Library

[![Build Status](https://travis-ci.org/jdmedlock/GitAClue.svg?branch=development)](https://travis-ci.org/jdmedlock/GitAClue) [![GitHub last commit](https://img.shields.io/github/last-commit/google/skia.svg)](https://github.com/jdmedlock/GitAClue)
<br/>
[![Packagist](https://img.shields.io/packagist/l/doctrine/orm.svg)](https://github.com/jdmedlock/GitAClue/)

GitAClue provides Javascript developers with access to GitHub data
and metrics for use in their applications. Despite the fact that GitHub's
API makes it easy to access
information, GitAClue makes it even simpler by insulating the caller from the
GitHub API and by organizing the resulting data in the form of contextually related
objects.

GitAClue is opinionated in that it provides access the most frequently required
data rather than all of the data available through the GitHub API.

[Installation](#installation) | [Usage](#usage) |
[Change Log](#change-log) | [Contributing](#contributing) |
[Authors](#authors) |
[License](#license)

## Installation

Using NPM:
```
$ npm install gitaclue
```

## Usage

Requests are made by calling `gitaclue.get(options)`
which returns a JSON document containing the requested information.

### Parameters

'options' describes both the information you require, as well as the order
it will be returned in resulting JSON document.
```
[
  { context: 'context-id', contextOwner: 'context-owner', contextName: 'context-name',
    segments: ['segment1', ...] },
  { context: 'context-id', contextOwner: 'context-owner', contextName: 'context-name',
    segments: ['segment1', ...] },
  ...
]
```

The `context` parameter is a string that names the starting point for the
requested GitHub information, while `contextOwner` and `contextName` identify
the specific context to be retrieved. For example, a context of 'repo', a
contextOwner of 'jdmedlock', and a contextName of 'GitAClue'
establishes the starting point of the information to be retrieved as being to the
repo named 'GitAClue'. Only one context value, context owner, and
context name may be specified in each entry.

`segments` is a list of zero or more sets of information related to a context.
For example, producing a list of conributors is relevant only within the
context of a repo.

It is valid to request a context with no segments. It is also valid to specify
the same segment name in more than one context within a single request. The
following table lists the combinations of context and segments that may be
requested together. Over time, GitAClue will be enhanced to provide access to
additional contexts and segments.

| Context      | Context Owner | Context Name | Valid Segment Names |
|:-------------|:--------------|:-------------|:--------------------|
| organization | N/a           | Required     | repolist            |
| ratelimit    | N/a           | N/a          | N/a                 |
| repo         | Required      | Required     | contributors, events |
| user         | N/a           | Required     | N/a                 |


### Return Value
GitAClue returns a JSON string of the following format:
```
{
  "01": {
    context: {
      <context-1-info>
      segment: {<segment-1-info>},
      segment: {<segment-2-info>},
      ...
    }
  },
  "02": {
    context: {
      <context-2-info>
      segment: {<segment-1-info>},
      segment: {<segment-2-info>},
      ...
    },
    ...
  }
}
```
A numerical key is assigned to each context in the result JSON to provide
uniqueness for those cases where multiple contexts of the same type are
requested in a single call to the `get` function.

### Errors

In the event that an error is encountered the returned
JSON string will include an 'error' property with a string value containing
the error message. For example,
```
{
  error: 'option parameter is null, undefined, or not an object'
}
```

The GitHub API imposes [rate limits](https://developer.github.com/v3/#rate-limiting)
defining the maximum number of API calls that can be made in an hour.
Since GitAClue uses unauthenticated access to retrieve public data through
the API it is subject to rate limits.

When the rate limit is exceeded the following error message will be issued.
For example,
```
GitHub API rate limit exceeded - 0 of 60 remaining. Status:403
```

### Example
The following program requests information about a repo and a user (not necessarily
related to one another) in a single get request,
```
const gitaclue = require('../gitaclue');

gitaclue.get([
  { context: 'repo', contextOwner: 'ShowMeCoders', contextName: 'showmecoders',
    segments: ['contributors'] },
  { context: 'user', contextOwner: '', contextName: 'jdmedlock' },
])
.then((response) => {
  console.log(`\nResponse from GitAClue.get(): ${response}`);
  const ghInfoObject = JSON.parse(response);
  console.log(`\nRepo name:${ghInfoObject[0].repo.name}`);
  console.log('...Contributors:');
  ghInfoObject[0].repo.contributors.forEach(element => {
    console.log(`......${element.name}`);
  });
  console.log(`\nUser name:${ghInfoObject[1].user.name}`);
})
.catch((error) => {
  console.log(error);
});
```
which generates the output:
```
Response from GitAClue.get(): {
  "0": {
    "repo": {
      "name": "showmecoders",
      "owner": "ShowMeCoders",
      "apiUrl": "https://api.github.com/repos/ShowMeCoders/showmecoders",
      "id": 123702029,
      "description": "A portfolio of Missouri participants in the Grow With Google Challenge Scholarship program at Udacity",
      "html_url": "https://github.com/ShowMeCoders/showmecoders",
      "private": false,
      "forked": false,
      "cloned": true,
      "created_at": "2018-03-03T15:01:18Z",
      "updated_at": "2018-04-14T14:54:32Z",
      "pushed_at": "2018-04-14T14:59:46Z",
      "noStars": 5,
      "noWatchers": 5,
      "language": "HTML",
      "license": {
        "key": "mit",
        "name": "MIT License",
        "spdx_id": "MIT",
        "url": "https://api.github.com/licenses/mit"
      },
      "noForks": 0,
      "contributors": [
        {
          "name": "jdmedlock",
          "apiUrl": "https://api.github.com/users/jdmedlock",
          "id": 1287072,
          "avatar_url": "https://avatars3.githubusercontent.com/u/1287072?v=4",
          "html_url": "https://github.com/jdmedlock",
          "type": "User",
          "location": "St. Louis, MO",
          "email": null,
          "bio": "Experienced IT professional with a background in both software development and infrastructure. Main areas of focus are Scrum and Javascript/NodeJS development.",
          "followers": 49,
          "following": 6,
          "created_at": "2011-12-27T00:14:59Z",
          "updated_at": "2018-04-13T20:57:08Z"
        },
        {
          "name": "ZumDeWald",
          "apiUrl": "https://api.github.com/users/ZumDeWald",
          "id": 35619162,
          "avatar_url": "https://avatars0.githubusercontent.com/u/35619162?v=4",
          "html_url": "https://github.com/ZumDeWald",
          "type": "User",
          "location": "St. Louis, MO",
          "email": null,
          "bio": "I'm NEW, but working on it...",
          "followers": 5,
          "following": 9,
          "created_at": "2018-01-20T03:52:14Z",
          "updated_at": "2018-03-26T19:46:31Z"
        },
        {
          "name": "nickhaynes",
          "apiUrl": "https://api.github.com/users/nickhaynes",
          "id": 36779922,
          "avatar_url": "https://avatars0.githubusercontent.com/u/36779922?v=4",
          "html_url": "https://github.com/nickhaynes",
          "type": "User",
          "location": null,
          "email": null,
          "bio": "Former politico and aspiring developer.",
          "followers": 3,
          "following": 3,
          "created_at": "2018-02-24T01:13:02Z",
          "updated_at": "2018-04-11T17:02:36Z"
        },
        {
          "name": "kylegeary",
          "apiUrl": "https://api.github.com/users/kylegeary",
          "id": 19237299,
          "avatar_url": "https://avatars3.githubusercontent.com/u/19237299?v=4",
          "html_url": "https://github.com/kylegeary",
          "type": "User",
          "location": "USA",
          "email": null,
          "bio": "Web application manager and front-end developer",
          "followers": 1,
          "following": 0,
          "created_at": "2016-05-07T10:05:49Z",
          "updated_at": "2018-04-14T00:41:01Z"
        },
        {
          "name": "MawsayB",
          "apiUrl": "https://api.github.com/users/MawsayB",
          "id": 28719588,
          "avatar_url": "https://avatars0.githubusercontent.com/u/28719588?v=4",
          "html_url": "https://github.com/MawsayB",
          "type": "User",
          "location": "St. Charles, Missouri",
          "email": null,
          "bio": "Software Developer",
          "followers": 7,
          "following": 0,
          "created_at": "2017-05-16T01:12:15Z",
          "updated_at": "2018-01-31T00:52:55Z"
        },
        {
          "name": "blevine08",
          "apiUrl": "https://api.github.com/users/blevine08",
          "id": 35310871,
          "avatar_url": "https://avatars1.githubusercontent.com/u/35310871?v=4",
          "html_url": "https://github.com/blevine08",
          "type": "User",
          "location": "Columbia, Missouri, USA",
          "email": null,
          "bio": "A naturally creative individual working in IT. Current Windows Server Admin for IBM and Front End Developer in training.",
          "followers": 4,
          "following": 0,
          "created_at": "2018-01-10T20:10:50Z",
          "updated_at": "2018-04-11T18:37:38Z"
        },
        {
          "name": "xvasser",
          "apiUrl": "https://api.github.com/users/xvasser",
          "id": 32984629,
          "avatar_url": "https://avatars1.githubusercontent.com/u/32984629?v=4",
          "html_url": "https://github.com/xvasser",
          "type": "User",
          "location": null,
          "email": null,
          "bio": null,
          "followers": 2,
          "following": 7,
          "created_at": "2017-10-21T15:38:58Z",
          "updated_at": "2018-04-12T17:57:22Z"
        }
      ]
    }
  },
  "1": {
    "user": {
      "name": "jdmedlock",
      "apiUrl": "https://api.github.com/users/jdmedlock",
      "id": 1287072,
      "avatar_url": "https://avatars3.githubusercontent.com/u/1287072?v=4",
      "html_url": "https://github.com/jdmedlock",
      "type": "User",
      "location": "St. Louis, MO",
      "email": null,
      "bio": "Experienced IT professional with a background in both software development and infrastructure. Main areas of focus are Scrum and Javascript/NodeJS development.",
      "followers": 49,
      "following": 6,
      "created_at": "2011-12-27T00:14:59Z",
      "updated_at": "2018-04-13T20:57:08Z"
    }
  }
}

Repo name:showmecoders
...Contributors:
......jdmedlock
......ZumDeWald
......nickhaynes
......kylegeary
......MawsayB
......blevine08
......xvasser

User name:jdmedlock
```
## Change Log

For more information see [Change Log](https://github.com/jdmedlock/GitAClue/blob/development/CHANGELOG.md)

## Contributing

See [Contributing](https://github.com/jdmedlock/GitAClue/blob/development/CONTRIBUTING.md)
and our [Collaborator Guide](https://github.com/jdmedlock/GitAClue/blob/development/COLLABORATOR_GUIDE.md).

## Authors

Developers on this project can be found on the [Contributors](https://github.com/jdmedlock/GitAClue/graphs/contributors) page of this repo.

## License

[MIT](https://tldrlegal.com/license/mit-license)
