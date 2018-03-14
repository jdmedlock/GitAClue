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
[Release Notes](#release-notes) | [Contributing](#contributing) | 
[Authors](#authors) |
[License](#license)

## Installation

_TBD_

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

`segments` is a list of zero or more sets of information associated with a context.
Not all segments may be used with a given context. The same segment may be
repeated in more than one context. Consult the following table for
the valid combinations of context and segment values.

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
In the event of an error a `null` string will be returned instead and an error will be thrown.

### Errors

*_TBD_*

### Example
```
const ghInfo = citaclue.get([
  { context: 'repo', contextOwner: 'jdmedlock', contextName: 'GitAClue', 
    segments: ['contributors'] },
  { context: 'user', contextName: 'jdmedlock', segments: [] },
]);
```
## Release Notes

For more information see [Release Notes](https://github.com/jdmedlock/GitAClue/blob/development/CHANGELOG.md)

## Contributing

See [Contributing](https://github.com/jdmedlock/GitAClue/blob/development/CONTRIBUTING.md)
and our [Collaborator Guide](https://github.com/jdmedlock/GitAClue/blob/development/COLLABORATOR_GUIDE.md).

## Authors

Developers on this project can be found on the [Contributors](https://github.com/jdmedlock/GitAClue/graphs/contributors) page of this repo.

## License

[MIT](https://tldrlegal.com/license/mit-license)
