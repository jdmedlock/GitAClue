/* eslint-disable no-use-before-define */

// Define the valid combinations of contexts and their subordinate segments.
// It is valid for a context to also be a segment within another context.
const contextSegments = [
  {
    context: 'repo', contextOwner: '', contextName: '', segments: ['contributors'],
  },
  {
    context: 'user', segments: [],
  },
];

// The Operation Order array contains the contexts and segments to be
// extracted from GitHub and specifies the order of these elements in the
// JSON string returned to the caller.
let operationOrder = [];
const operationFunctions = [
  {object: 'contributors', funcName: getContributorsInfo},
  {object: 'repo', funcName: getRepoInfo},
  {object: 'user', funcName: getUserInfo},
];

const resultJSON = {};

/**
 * @description Retrieve a set of contexts and segments from the GitHub API
 * @param {Object} options an object containing context and segment names
 * in the format:
 * [
 *   {context: 'context-id', contextOwner: 'context-owner', contextName: 'context-name',
 *      segments: ['segment1', ...]},
 *   {context: 'context-id', contextOwner: 'context-owner', contextName: 'context-name',
 *      segments: ['segment1', ...]},
 *   ...
 * ]
 * @returns {String} A JSON string containing the context and segment
 * information in the same order they were specified in in the 'options'
 * parameter.
 */
function get(options) {
  operationOrder = [];
  if (validateOptions(options)) {
    console.log('\operationOrder: ', operationOrder);  
    extractInfo(options);
  }

  return resultJSON;
}

/**
 * @description Validate the options object supplied by the caller
 * @param {Object} options
 * @returns {boolean} true if no errors are found, otherwise false.
 */
function validateOptions(options) {
  if (options === null || options === undefined || typeof options !== 'object') {
    resultJSON.error = 'option parameter is null, undefined, or not an object';
    return false;
  }

  /* eslint-disable guard-for-in, no-restricted-syntax */
  for (const prop in options) {
    /* eslint-disable prefer-destructuring */
    const contextType = options[prop].context;
    const contextOwner = options[prop].contextOwner;
    const contextName = options[prop].contextName;
    const segments = options[prop].segments;

    if (contextName === null || contextName === undefined || typeof contextName !== 'string') {
      resultJSON.error = 'contextName is null, undefined, or not a string';
      return false;
    }

    if (contextOwner === null || contextOwner === undefined || typeof contextOwner !== 'string') {
      resultJSON.error = 'contextOwner is null, undefined, or not a string';
      return false;
    }

    const matchingContextEntry = isContextValid(contextType, contextOwner,
      contextName);
    if (matchingContextEntry === null) {
      return false;
    }

    const errorSegments = !isSegmentsValid(matchingContextEntry, segments);
    if (errorSegments.length > 0) {
      resultJSON.error = `Invalid segments: ${errorSegments}`;
      return false;
    }
  }
  return true;
}

/**
 * @description Validate a context type
 * @param {String} contextType The context to validate.
 * @param {String} contextOwner the owner of the context object
 * @param {String} contextName the name of the context object
 * @returns {boolean} The matching contextSegments entry if found, otherwise
 * null.
 */
function isContextValid(contextType, contextOwner, contextName) {
  if (contextType === null || contextType === undefined || typeof contextType !== 'string') {
    resultJSON.error = 'context is null, undefined, or not a string';
    return null;
  }
  for (let i = 0; i < contextSegments.length; i += 1) {
    if (contextSegments[i].context === contextType) {
      operationOrder.push({
        type: 'context',
        name: `${contextType}`,
        contextOwner: `${contextOwner}`,
        contextName: `${contextName}`,
      });
      return contextSegments[i];
    }
  }
  resultJSON.error = 'unknown context specified';
  return null;
}

/**
 * @description Validate an array of segment names
 * @param {String} matchingContextEntry The context type that owns the segment
 * @param {[String]} optSegments The segment names to validate.
 * @returns {Object} If no errors were found a null object or if errors were
 * encountered one containing the offending segment names.
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
  for (let i = 0; i < optSegments.length; i += 1) {
    if (optSegments[i] === '' || optSegments[i] === null) {
      /* eslint-disable no-continue */
      continue;
    }
    if (matchingContextSegments.indexOf(optSegments[i]) > -1) {
      operationOrder.push({
        type: 'segment',
        name: `${optSegments[i]}`,
      });
    } else {
      errorSegments.push(optSegments[i]);
    }
  }
  if (errorSegments.length > 0) {
    resultJSON.error = 'segments contains one or more invalid entries';
  }
  return errorSegments;
}

/**
 * @description Extract information from GitHub and build the response JSON
 * @param {any} options User options object
 * @returns {Object} JSON response object containing the extracted information
 */
function extractInfo(options) {
  operationOrder.forEach((operation) => {
    operationFunctions.forEach((extractFunction) => {
      console.log(`Compare object: ${extractFunction.object} name: ${operation.name}`);
      if (extractFunction.object === operation.name) {
        switch (operation.type) {
          case 'context':
            console.log(`..Processing context: ${operation.name}`);
            extractFunction.funcName();
            break;
          case 'segment':
            console.log(`..Processing segment: ${operation.name}`);
            extractFunction.funcName();
          break;
          default:
            throw new Error(`Invalid operation.type: ${operation.type}`);
        }
      }
    });
  });

  return true;
}

function getContributorsInfo() {
  console.log('Entered getContributorsInfo');
}

function getRepoInfo() {
  console.log('Entered getRepoInfo');
}

function getUserInfo() {
  console.log('Entered getUserInfo');
}

export default { get, validateOptions };
