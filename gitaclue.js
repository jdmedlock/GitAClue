/* eslint-disable no-use-before-define */
const Contributors = require('./src/Contributors');
const Events = require('./src/Events');
const Rate = require('./src/Rate');
const Repo = require('./src/Repo');
const User = require('./src/User');

// Define the valid combinations of properties and values in the 'options'
// passed to the get() function. Entries in this table are interpreted as
// follows:
// - Entries in the options parameter supplied by the user are matched to
//   entries in this array based on the context value.
// - Properties are required if they are present. Any properties specified
//   in the options object specified by the user that aren't in the
//   corresponding entry in this array will be ignored.
// - Property values of '*' are interpreted as any value is allowed. Any
//   other value must exactly match the value provided by the user
// - It is valid for a context to also be a segment within another context.
const optionsSyntax = [
  {
    context: 'repo',
    contextOwner: '*',
    contextName: '*',
    segments: [
      'contributors',
      'events'
    ],
  },
  {
    context: 'ratelimit',
  },
  {
    context: 'user',
    contextName: '*',
  },
];

// The Operation Order array contains the contexts and segments to be
// extracted from GitHub and specifies the order of these elements in the
// JSON string returned to the caller.
let operationOrder = [];
const operationFunctions = [
  {object: 'contributors', funcName: getContributorsInfo},
  {object: 'events', funcName: getEventsInfo},
  {object: 'ratelimit', funcName: getRateInfo},
  {object: 'repo', funcName: getRepoInfo},
  {object: 'user', funcName: getUserInfo},
];

let resultObject = {};

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
async function get(options) {
  operationOrder = [];
  if (validateOptions(options)) {
    await extractInfo(options);
  }
  const finalResult = JSON.stringify(resultObject, null, 2);
  return finalResult;
}

/**
 * @description Validate the options object supplied by the caller
 * @param {Object} options
 * @returns {boolean} true if no errors are found, otherwise false.
 */
function validateOptions(options) {

  if (options === null || options === undefined || typeof options !== 'object') {
    resultObject.error = 'option parameter is null, undefined, or not an object';
    return false;
  }

  // Validate each entry in the options object against the rules specified
  // in the matching entry in the optionsSyntax array
  const findOptionsSyntax = (i) => {
    return optionsSyntax.findIndex(element => {
      return element.context === options[i].context;
    });
  };

  for (let i = 0; i < options.length; i +=1) {

    if (options[i].context === null || options[i].context === undefined ||
        typeof options[i].context !== 'string') {
      resultObject.error = 'context is null, undefined, or not a string';
      return false;
    }

    // Locate the matching entry for the specified context in the
    // optionsSyntax array
    const syntaxIndex = findOptionsSyntax(i);
    if (syntaxIndex === -1) {
      resultObject.error = 'unknown context specified';
      return false;
    }

    // Validate the contextOwner specification.
    if (optionsSyntax[syntaxIndex].contextOwner !== undefined) {
      if (options[i].contextOwner === null || options[i].contextOwner === undefined ||
          typeof options[i].contextOwner !== 'string') {
        resultObject.error = 'contextOwner is null, undefined, or not a string';
        return false;
      }
    }

    // Validate the contextName specification
    if (optionsSyntax[syntaxIndex].contextName !== undefined) {
      if (options[i].contextName === null || options[i].contextName === undefined ||
          typeof options[i].contextName !== 'string') {
        resultObject.error = 'contextName is null, undefined, or not a string';
        return false;
      }
    }

    operationOrder.push({
      type: 'context',
      context: `${options[i].context}`,
      name: `${options[i].context}`,
      contextOwner: `${options[i].contextOwner}`,
      contextName: `${options[i].contextName}`,
    });

    const errorSegments = isSegmentsValid(options[i], optionsSyntax[syntaxIndex]);
    if (errorSegments.length > 0) {
      resultObject.error = `Invalid segments: ${errorSegments}`;
      return false;
    }
  }
  return true;
}

/**
 * @description Validate an array of segment names
 * @param {Object} optionEntry User-specified options for the current context
 * @param {Object} syntaxEntry Entry from the optionsSyntax array for the
 * current context
 * @returns {Object} If no errors were found a null object or if errors were
 * encountered one containing the offending segment names.
 */
function isSegmentsValid(optionEntry, syntaxEntry) {
  const errorSegments = [];

  // Validate the presence and data type of the user supplied segment property
  if (optionEntry.segments === undefined || optionEntry.segments === null ||
      optionEntry.segments === '') {
    return errorSegments;
  }
  if (typeof optionEntry.segments !== 'object') {
    resultObject.error = 'segments is not an array';
    return errorSegments.push('Not an object');
  }

  // Validate the values in the user supplied segment property
  // against the optionsSyntax array
  for (let i = 0; i < optionEntry.segments.length; i += 1) {
    if (optionEntry.segments[i] === '' || optionEntry.segments[i] === null) {
      continue; /* eslint-disable no-continue */
    }
    if (syntaxEntry.segments !== undefined &&
        syntaxEntry.segments.indexOf(optionEntry.segments[i]) > -1) {
      operationOrder.push({
        type: 'segment',
        context: `${syntaxEntry.context}`,
        name: `${optionEntry.segments[i]}`,
        contextOwner: `${optionEntry.contextOwner}`,
        contextName: `${optionEntry.contextName}`,
      });
    } else {
      errorSegments.push(optionEntry.segments[i]);
    }
  }
  if (errorSegments.length > 0) {
    resultObject.error = 'segments contains one or more invalid entries';
  }
  return errorSegments;
}

/**
 * @description Extract information from GitHub and build the response object
 * @param {any} options User options object
 */
async function extractInfo() {
  let contextObject = {};
  let operation = null;
  let contextNo = 0;
  for (let i = 0; i < operationOrder.length; i +=1) {
    operation = operationOrder[i];
    for (let j = 0; j < operationFunctions.length; j +=1) {
      const extractFunction = operationFunctions[j];
      if (extractFunction.object === operation.name) {
        // If the operation to be executed is for a new context then start
        // this operation with an empty context object
        if (operation.type === 'context' && contextObject !== null) {
          contextObject = {};
        }
        await extractFunction.funcName(contextObject, operation);
        if (operation.type === 'context') {
          // Add the context or segment to the current context object
          resultObject = {...resultObject, [contextNo]: contextObject};
          contextNo += 1;
        }
      }
    }
  }
}

/**
 * @description Retrieve the contributors information from GitHub.
 * @param {Object} contextObject The current context this information is
 * related to and therefore should be added to
 * @param {Object} operation The matching entry from the operationOrder array
 * for this object
 */
async function getContributorsInfo(contextObject, operation) {
  const contributorsObject =
    new Contributors(operation.contextOwner, operation.contextName);
  await contributorsObject.fetchAllInfo();
  contextObject[operation.context].contributors = contributorsObject.contributors;
}

/**
 * @description Retrieve the events information from GitHub.
 * @param {Object} contextObject The current context this information is
 * related to and therefore should be added to
 * @param {Object} operation The matching entry from the operationOrder array
 * for this object
 */
async function getEventsInfo(contextObject, operation) {
  const eventsObject =
    new Events(operation.context, operation.contextOwner, operation.contextName);
  await eventsObject.fetchAllInfo();
  contextObject[operation.context].events = eventsObject.events;
}

/**
 * @description Retrieve the rate limit information from GitHub
 * @param {Object} contextObject The current context this information is
 * related to and therefore should be added to
 * @param {Object} operation The matching entry from the operationOrder array
 * for this object
 */
async function getRateInfo(contextObject, operation) {
  const rateObject = new Rate();
  await rateObject.fetchInfo();
  contextObject.rate = rateObject;
}

/**
 * @description Retrieve the repo information from GitHub
 * @param {Object} contextObject The current context this information is
 * related to and therefore should be added to
 * @param {Object} operation The matching entry from the operationOrder array
 * for this object
 */
async function getRepoInfo(contextObject, operation) {
  const repoObject = new Repo(operation.contextOwner, operation.contextName);
  await repoObject.fetchInfo();
  if (operation.type === 'context') {
    contextObject.repo = repoObject;
  } else {
    contextObject[operation.context].repo = repoObject;
  }
}

/**
 * @description Retrieve the user information from GitHub
 * @param {Object} contextObject The current context this information is
 * related to and therefore should be added to
 * @param {Object} operation The matching entry from the operationOrder array
 * for this object
 */
async function getUserInfo(contextObject, operation) {
  const userObject = new User(operation.contextName);
  await userObject.fetchInfo();
  if (operation.type === 'context') {
    contextObject.user = userObject;
  } else {
    contextObject[operation.context].user = userObject;
  }
}

module.exports = {
  get: get,
  validateOptions: validateOptions
};
