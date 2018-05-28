# Change Log

### 1.2.0 - 05/28/2018
- Add a new context `organization` to retrieve information about an Organization.
- Add a new segment `repolist` to list repo owners and names within an
Organization

### 1.1.0 - 04/18/2018
- Resolve issue [#35](https://github.com/jdmedlock/GitAClue/issues/35)
- Add a new context `ratelimit` to retrieve the current GitHub API V3 rate limit
cap and number of remaining requests

### 1.0.0 - 04/15/2018
- Resolve issue [#31](https://github.com/jdmedlock/GitAClue/issues/31). Note
that this changes the format of the result JSON returned to callers of the
`get` function. Consult the projects
[README](https://github.com/jdmedlock/GitAClue) for details.

### 0.3.0 - 03/28/2018
- Added support for the new `events` segment to the `repo` context

### 0.1.2 - 03/14/2018
- Update change log format

### 0.1.1 - 03/14/2018

- Renamed GitAClue.js to gitaclue.js and moved to the root of the package to eliminate need to specify import/require path to `gitaclue/src/GitAClue`
- Replaced 'Release Notes' section in readme with 'Change Log'

### 0.1.0 - 03/14/2018

- Initial release
  - Added support for contexts: `repo` & `user`
  - Added support for segments: `contributors`