# GitAClue - GitHub Information Extraction Library

GitAClue provides the Javascript developer with access to various GitHub data
and metrics. Despite the fact that GitHub's API makes it to access this
information, GitAClue makes even simpler by insulating the caller from this
API and by organizing the resulting data in the form of objects familiar to
Javascript developers.

GitAClue is opinionated in that it provides access the most frequently required
data rather than all of the data available through the GitHub API. 

[Installation](#installation) | [Usage](#usage) |[Contributing](#contributing) | [Authors](#authors) |
[License](#license)

## Installation

_TBD_

## Usage

Requests are made by calling `gitaclue.get(context, contextName, segments)`
which returns a JSON document containing the requested information. 

The `context` parameter is a string that names the starting point for the
requested GitHub information and `contextName` identifies which context to be
retrieved. For example, a context of 'repo' and a contextName of 'GitAClue'
establishes a the anchor to be the repo named 'GitAClue'.



## Contributing

### Git Branches

![GitAClue Git Workflow](https://github.com/jdmedlock/GitAClue/blob/master/docs/Git%20-%20Team%20Workflow.png)

- `master`: Only updated from PR's from the `development` branch for release. This
branch always reflects the current production release.
- `development`: Reflects the candidate code for the next release. Developers
work in working branches, which are then pulled into this branch. All code
pulled into this branch must be tested and undergo peer review as part of the
PR process.
- `working branches`: Are individual branches created by each developer when
they are working on changes and bug fixes. There are 4 basic types of branches: 
bug, feature, refactor and style, after the type comes the name, it should 
specify on top of the branch type. For example feature/course-review.

## Authors

Developers on this project can be found on the [Contributors](https://github.com/jdmedlock/GitAClue/graphs/contributors) page of this repo.

## License

[MIT](https://tldrlegal.com/license/mit-license)
