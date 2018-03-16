/* eslint-disable no-use-before-define */
const Contributors = require('./src/Contributors');
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
    context: 'repo', contextOwner: '*', contextName: '*', segments: ['contributors'],
  },
  {
    context: 'user', contextName: '*',
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

let contextJSON = {};
let resultJSON = {};

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
  const finalResult = JSON.stringify(resultJSON, null, 2);
  return finalResult;
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

  // Validate each entry in the options object against the rules specified
  // in the matching entry in the optionsSyntax array
  const compareAgainsOptionsSyntax = (element, i) => {
    return function(element) {
      return element.context === options[i].context;
    };
  };

  for (let i = 0; i < options.length; i +=1) {

    if (options[i].context === null || options[i].context === undefined ||
        typeof options[i].context !== 'string') {
      resultJSON.error = 'context is null, undefined, or not a string';
      return false;
    }

    // Locate the matching entry for the specified context in the
    // optionsSyntax array
    const syntaxIndex = optionsSyntax.findIndex(compareAgainsOptionsSyntax,i);

    if (syntaxIndex === -1) {
      resultJSON.error = 'unknown context specified';
      return false;
    }

    // Validate the contextOwner specification. 
    if (optionsSyntax[syntaxIndex].contextOwner !== undefined) {
      if (options[i].contextName === null || options[i].contextName === undefined ||
          typeof options[i].contextName !== 'string') {
        resultJSON.error = 'contextName is null, undefined, or not a string';
        return false;
      }
    }

    // Validate the contextName specification
    if (optionsSyntax[syntaxIndex].contextName !== undefined) {
      if (options[i].contextName === null || options[i].contextName === undefined ||
          typeof options[i].contextName !== 'string') {
        resultJSON.error = 'contextName is null, undefined, or not a string';
        return false;
      }
    }

    operationOrder.push({
      type: 'context',
      context: `${options[i].context}`,
      name: `${options[i].contextType}`,
      contextOwner: `${options[i].contextOwner}`,
      contextName: `${options[i].contextName}`,
    });

    const errorSegments = !isSegmentsValid(options[i], optionsSyntax[syntaxIndex]);
    if (errorSegments.length > 0) {
      resultJSON.error = `Invalid segments: ${errorSegments}`;
      return false;
    }
  }

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
    resultJSON.error = 'segments is not an array';
    return errorSegments.push('Not an object');
  }
  
  // Validate the values in the user supplied segment property 
  // against the optionsSyntax array
  for (let i = 0; i < optionEntry.segments.length; i += 1) {
    if (optionEntry.segments[i] === '' || optionEntry.segments[i] === null) {
      continue; /* eslint-disable no-continue */
    }
    if (syntaxEntry.segments.indexOf(optionEntry.segments[i]) > -1) {
      operationOrder.push({
        type: 'segment',
        context: `${syntaxEntry.context}`,
        name: `${optionEntry.segments[i]}`,
        contextOwner: `${syntaxEntry.contextOwner}`,
        contextName: `${syntaxEntry.contextName}`,
      });
    } else {
      errorSegments.push(optionEntry.segments[i]);
    }
  }
  if (errorSegments.length > 0) {
    resultJSON.error = 'segments contains one or more invalid entries';
  }
  return errorSegments;
}

/* Old options validation logic

**
 * @description Validate the options object supplied by the caller
 * @param {Object} options
 * @returns {boolean} true if no errors are found, otherwise false.
 *
function validateOptions(options) {
  if (options === null || options === undefined || typeof options !== 'object') {
    resultJSON.error = 'option parameter is null, undefined, or not an object';
    return false;
  }

  * eslint-disable guard-for-in, no-restricted-syntax *
  for (const prop in options) {
    * eslint-disable prefer-destructuring *
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

    const errorSegments = !isSegmentsValid(matchingContextEntry, contextOwner,
      contextName, segments);
    if (errorSegments.length > 0) {
      resultJSON.error = `Invalid segments: ${errorSegments}`;
      return false;
    }
  }
  return true;
}

**
 * @description Validate a context type
 * @param {String} contextType The context to validate.
 * @param {String} contextOwner the owner of the context object
 * @param {String} contextName the name of the context object
 * @returns {boolean} The matching optionsSyntax entry if found, otherwise
 * null.
 *
function isContextValid(contextType, contextOwner, contextName) {
  if (contextType === null || contextType === undefined || typeof contextType !== 'string') {
    resultJSON.error = 'context is null, undefined, or not a string';
    return null;
  }
  for (let i = 0; i < optionsSyntax.length; i += 1) {
    if (optionsSyntax[i].context === contextType) {
      operationOrder.push({
        type: 'context',
        context: `${contextType}`,
        name: `${contextType}`,
        contextOwner: `${contextOwner}`,
        contextName: `${contextName}`,
      });
      return optionsSyntax[i];
    }
  }
  resultJSON.error = 'unknown context specified';
  return null;
}

**
 * @description Validate an array of segment names
 * @param {String} matchingContextEntry The context type that owns the segment
 * @param {[String]} optSegments The segment names to validate.
 * @returns {Object} If no errors were found a null object or if errors were
 * encountered one containing the offending segment names.
 *
function isSegmentsValid(matchingContextEntry, contextOwner, contextName,
                         optSegments) {
  const errorSegments = [];
  if (optSegments === undefined || optSegments === null || optSegments === '') {
    return errorSegments;
  }
  if (typeof optSegments !== 'object') {
    resultJSON.error = 'segments is not an array';
    return errorSegments.push('Not an object');
  }

  const matchingoptionsSyntax = matchingContextEntry.segments;
  for (let i = 0; i < optSegments.length; i += 1) {
    if (optSegments[i] === '' || optSegments[i] === null) {
      /* eslint-disable no-continue *
      continue;
    }
    if (matchingoptionsSyntax.indexOf(optSegments[i]) > -1) {

      operationOrder.push({
        type: 'segment',
        context: `${matchingContextEntry.context}`,
        name: `${optSegments[i]}`,
        contextOwner: `${contextOwner}`,
        contextName: `${contextName}`,
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

End of old options validation logic */

/**
 * @description Extract information from GitHub and build the response JSON
 * @param {any} options User options object
 */
async function extractInfo(options) {
  for (let i = 0; i < operationOrder.length; i +=1) {
    const operation = operationOrder[i];
    for (let j = 0; j < operationFunctions.length; j +=1) {
      const extractFunction = operationFunctions[j];
      if (extractFunction.object === operation.name) {
        if (operation.type === 'context' && contextJSON !== null) {
          Object.assign(resultJSON, resultJSON, contextJSON);
          contextJSON = {};
        }
        await extractFunction.funcName(operation);
      }
    }
    if (i === operationOrder.length-1) {
      Object.assign(resultJSON, resultJSON, contextJSON);
    }
  }
  return true;
}

/**
 * @description Retrieve the contributors information from GitHub. When used as a context
 * the it is added as a new property at the root of the target object.
 * However, when used as a segment it is adding as a new property into its context in
 * the target object.
 * @param {Object} operation The matching entry from the operationOrder array for this object
 */
async function getContributorsInfo(operation) {
  const contributorsObject = new Contributors(operation.contextOwner, operation.contextName);
  await contributorsObject.fetchAllInfo();
  contextJSON[operation.context].contributors = contributorsObject.contributors;
}

/**
 * @description Retrieve the repo information from GitHub
 * @param {Object} operation The matching entry from the operationOrder array for this object
 */
async function getRepoInfo(operation) {
  const repoObject = new Repo(operation.contextOwner, operation.contextName);
  await repoObject.fetchInfo();
  if (operation.type === 'context') {
    contextJSON.repo = repoObject;
  } else {
    contextJSON[operation.context].repo = repoObject;
  }
}

/**
 * @description Retrieve the user information from GitHub
 * @param {Object} operation The matching entry from the operationOrder array for this object
 */
async function getUserInfo(operation) {
  const userObject = new User(operation.contextName);
  await userObject.fetchInfo();
  if (operation.type === 'context') {
    contextJSON.user = userObject;
  } else {
    contextJSON[operation.context].user = userObject;
  }
}

module.exports = {
  get: get,
  validateOptions: validateOptions
};
