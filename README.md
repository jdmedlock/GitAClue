# GitAClue - GitHub Information Extraction Library

[![Build Status](https://travis-ci.org/jdmedlock/GitAClue.svg?branch=development)](https://travis-ci.org/jdmedlock/GitAClue) [![GitHub last commit](https://img.shields.io/github/last-commit/google/skia.svg)](https://github.com/jdmedlock/GitAClue)
<br/>
[![Packagist](https://img.shields.io/packagist/l/doctrine/orm.svg)](https://github.com/jdmedlock/GitAClue/)

GitAClue provides the Javascript developer with access to various GitHub data
and metrics. Despite the fact that GitHub's API makes it to access this
information, GitAClue makes even simpler by insulating the caller from this
API and by organizing the resulting data in the form of objects familiar to
Javascript developers.

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

'options' describe the both the information you require as well as the order
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
requested GitHub information while `contextOwner` and `contextName` identify the
specific context to be
retrieved. For example, a context of 'repo', a contextOwner of 'jdmedlock', and
a contextName of 'GitAClue'
establishes the starting point of the information to be retrieved as being to the
repo named 'GitAClue'. Only one context value, context owner, and
context name may be specified in each entry.

`segments` is a list of zero or more sets of information realated to a context.
For example, producing a list of conributors is relevant only within the 
context of a repo.

It is valid to request a context with no segments. It is also valid to specify
the same segment name in more than one context within a single request. The
following table lists the combinations of context and segments that may be
requested together. Over time GitAClue will be enhanced to provide access to
additional contexts and segments.

| Context Name | Valid Segment Names |
|:-------------|:--------------------|
| user         | N/a                 |
| repo         | contributors        |

### Return Value
GitAClue returns a JSON string of the following format:
```
{
  context: {
    <context-1-info>
    segment: {<segment-1-info>},
    segment: {<segment-2-info>},
    ...
  },
  context: {
    <context-2-info>
    segment: {<segment-1-info>},
    segment: {<segment-2-info>},
    ...
  },
  ...
}
```

### Errors

In the event that an error is encountered during processing the returned
JSON string will include an 'error' property with a string value containing
the error message. For example,
```
{
  error: 'option parameter is null, undefined, or not an object'
}
```

### Example
The following program requests information about a repo and a user (not necessarily
related to one another) in a single get request,
```
const gitaclue = require('gitaclue');

gitaclue.get([
  { context: 'repo', contextOwner: 'ShowMeCoders', contextName: 'showmecoders', 
    segments: ['contributors'] },
  { context: 'user', contextOwner: '', contextName: 'jdmedlock' },
])
.then((response) => {
  console.log(`\nResponse from GitAClue.get(): ${response}`);
  const ghInfoObject = JSON.parse(response);
  console.log(`\nRepo name:${ghInfoObject.repo.name}`);
})
.catch((error) => {
  console.log(error);
});
```
which generates the output:
```
Response from GitAClue.get(): {
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
    "updated_at": "2018-03-13T21:26:25Z",
    "pushed_at": "2018-03-13T21:26:24Z",
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
        "updated_at": "2018-03-07T01:27:01Z"
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
        "following": 8,
        "created_at": "2018-01-20T03:52:14Z",
        "updated_at": "2018-01-20T03:59:04Z"
      },
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
        "followers": 44,
        "following": 6,
        "created_at": "2011-12-27T00:14:59Z",
        "updated_at": "2018-03-13T13:19:53Z"
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
        "updated_at": "2018-03-10T22:38:48Z"
      }
    ]
  },
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
    "followers": 44,
    "following": 6,
    "created_at": "2011-12-27T00:14:59Z",
    "updated_at": "2018-03-13T13:19:53Z"
  }
}

Repo name:showmecoders
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
