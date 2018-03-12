import contributors from './Contributors.js';
import repo from './Repo.js';
import User from './User.js';

// Define the valid combinations of contexts and their subordinate segments.
// It is valid for a context to also be a segment within another context.
const contextSegments = [
  {context: 'repo', segments: ['contributors']},
  {context: 'user', segments: []}
];

let resultJSON = {};

/**
 * @description Retrieve a set of contexts and segments from the GitHub API
 * @param {Object} options an object containing context and segment names
 * in the format:
 * [
 *   {context: 'context-id', contextName: 'context-name', segments: ['segment1', ...]},
 *   {context: 'context-id', contextName: 'context-name', segments: ['segment1', ...]},
 *   ...
 * ]
 * @returns {String} A JSON string containing the context and segment 
 * information in the same order they were specified in in the 'options'
 * parameter.
 */
function get(options) {
  validateOptions(options);
  return resultJSON;
}

/**
 * @description Validate the options object supplied by the caller
 * @param {Object} options 
 * @returns {boolean} true if no errors are found, otherwise false.
 */
function validateOptions(options) {
  if (options === null || options === undefined || typeof options != 'object') {
    resultJSON.error = 'option parameter is null, undefined, or not an object';
    return false;
  }

  for (const prop in options) {
    const contextType = options[prop].context;
    const contextName = options[prop].contextName;
    if (contextName === null || contextName === undefined || typeof contextName !== 'string') {
      resultJSON.error = 'contextName is null, undefined, or not a string';
      return false;
    }

    const matchingContextEntry = isContextValid(contextType);
    if (matchingContextEntry === null) {
      return false;
    }

    const segments = options[prop].segments;
    const errorSegments = !isSegmentsValid(matchingContextEntry, segments)
    if (errorSegments.length > 0) {
      resultJSON.error = 'Invalid segments: ' + errorSegments;
      return false;
    }
  }
  return true;
}

/**
 * @description Validate a context type
 * @param {String} contextType The context to validate.
 * @returns {boolean} The matching contextSegments entry if found, otherwise
 * null.
 */
function isContextValid(contextType) {
  if (contextType === null || contextType === undefined || typeof contextType !== 'string') {
    resultJSON.error = 'context is null, undefined, or not a string';
    return null;
  }
  for (let i = 0; i < contextSegments.length; i++) {
    if (contextSegments[i].context === contextType) {
      return contextSegments[i];
    }
  }
  resultJSON.error = 'unknown context specified';
return null;
}

/**
 * @description Validate an array of segment names
 * @param {String} contextType The context type that owns the segment
 * @param {[String]} segments The segment names to validate.
 * @returns {boolean} true if the contextType is valid, otherwise false.
 */
function isSegmentsValid(matchingContextEntry, optSegments) {
  const errorSegments = [];
  if (optSegments === undefined || optSegments === null || optSegments === '') {
    return errorSegments;
  }
  if (typeof optSegments !== 'object') {
    resultJSON.error = 'segments is not an array';
    return errorSegments.push('Not an object');
  }

  const matchingContextSegments = matchingContextEntry.segments;
  for (let i = 0; i < optSegments.length; i++) {
    if (optSegments[i] === '' || optSegments[i] === null ) {
      continue;
    }
    if (matchingContextSegments.indexOf(optSegments[i]) === -1) {
      errorSegments.push(optSegments[i]);
    }
  }
  if (errorSegments.length > 0) {
    resultJSON.error = 'segments contains one or more invalid entries';
  }
  return errorSegments;
}

export default { get, validateOptions }
