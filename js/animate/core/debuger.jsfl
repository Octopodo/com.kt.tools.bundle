(function(){

//Output variables
var DEBUG_HEAD = ')',
    DEBUG_LINE = '-->',
    NEW_LINE = '\r',
    VERB_HEAD = '*************',
    VERB_LINE = '>>>';

//Constants
var DEBUG_LEVEL = 0,
    MAX_VERB_LEVEL = 3,
    TAB_SPACING = 2,
    VERB_LEVEL_LOW = 1,
    VERB_LEVEL_MID = 2,
    VERB_LEVEL_HIGH = 3;

//CONFIG CONSTANTS
var INSPECT_OBJECT_PROPS = VERB_LEVEL_MID,
    INSPECT_OBJECT_PROPS_DEEP = VERB_LEVEL_HIGH,
    INSPECT_ARRAY = VERB_LEVEL_MID,
    INSPECT_ARRAY_DEEP = VERB_LEVEL_MID;


//Config variables
var debugLog = '',
    debugMode = true,
    debugLine = 1,
    debugTime = false,
    lineStart = DEBUG_LINE,
    verboseLevel = 0,
    verboseMode = false;


/**Clear the debugger log and resets the line
 * @function clearLog
 * @memberof KT.Debugger
 */
function clearLog() {
  debugLine = 1;
  debugLog = '';
}

/**Main debug function.Converts arguments depending 
 * on the verbose level. It alwais print.
 * @function debug
 * @memberof KT.Debugger
 * @param {Any} - Any number of any type objects
 * */
function debug(){
  if(!verbLevel(DEBUG_LEVEL) || !debugMode) return
  var line = debugLine + DEBUG_HEAD,
      i = 0,
      len = arguments.length,
      argument;
  log(line);

  for(; i < len; i++) {
    argument = arguments[i];
    argument = verbLevel(VERB_LEVEL_LOW) ? inspect(argument) 
              :_.isFunction(argument) ? 'Function: ' + argument.name
              : argument;
    log(argument)
  }
  debugLine++ 
}


function verbose(){
  lineStart = VERB_LINE;
  if(!verbLevel(VERB_LEVEL_LOW) || verboseMode === false) return;
  var args = Array.prototype.slice.call(arguments),
      callee = args[0].callee,
      isArguments = callee && _.isFunction(callee),
      line,
      argsObject,
      name;
  if(isArguments) {
    name = callee.name === '' ? 'anonymous' : callee.name;
    line = VERB_HEAD 
      + KT.String.splitCamelCase(name).toUpperCase()
      + VERB_HEAD + VERB_HEAD;
    log(line);
    argsObject = Array.prototype.slice.call(args.shift());
    args.unshift(argsObject);
    args = _.flatten(args, 1);
  }
  debug.apply(this, args);
  lineStart = DEBUG_LINE;
}


/**Checks if an object is pure object: not Array, 
 * not function and not primitive.
 * @function isObject
 * @memberof KT.Debugger
 * @param {Any} obj - The object to check
 * @returns {Boolean} - Returns true if the value is and object, else false
 */
function isObject(obj){
  return !_.isFunction(obj) 
          && !_.isArray(obj)
          && _.isObject(obj)
          && obj.constructor.name === 'Object'
};


/**Wrapper function for an.trace to accept any type
 * of data and any number of arguments
 * @function log
 * @memberof KT.Debugger
 * @param {Any} args - Any type of data. Can pasa multiple values
*/
function log(){
  var i = 0,
      len = arguments.length,
      line;
  
  for(; i < len; i++) {
    line = lineStart + JSON.stringify(arguments[i], null, TAB_SPACING);
    debugLog += line + NEW_LINE;
    an.trace(line);
  }
};


/**Inspect the pased object ad retrieve the type, the value,
 * the constructor, the lenght and its members(depending on verbose level)
 * @function inspect
 * @memberof KT.Debuger
 * @param {Any} obj - The object to inspect
 * @returns {Object} An object whit the inspected properties
 */
function inspect(obj) {
  var constructor = 
      _.isUndefined(obj) ? 'undefined'
    : _.isNull(obj) ? 'Null'
    : obj.constructor.name,
      type = Object.prototype.toString.call(obj),
      value,
      length,
      item,
      data = {},
      i = 0;
  
  if(isObject(obj)) {
    value = obj;
    if(verbLevel(INSPECT_OBJECT_PROPS)) {
      value = {};
      for(var i in obj) {
        value[i] = verbLevel(INSPECT_OBJECT_PROPS_DEEP) ? inspect(obj[i]) : obj[i];
        i++
      };
      length = i + 1
    }
  } else if(_.isArray(obj)) {
    type = 'Array';
    value = [];
    length = obj.length;
    if(verbLevel(INSPECT_ARRAY)) {
      for(; i < length; i++) {
        item = verbLevel(INSPECT_ARRAY_DEEP) ? inspect(obj[i]) : obj[i];
        value.push(item);
      }
    }
  } else if (_.isUndefined(obj)) {
    value = 'undefined';
  } else if (_.isNull(obj)) {
    value = 'null'
  } else if (_.isFunction(obj)) {
    value = 'Function'
  } else if (_.isNaN(obj)) {
    value = 'NaN'
  } else {
    value = obj
  }

  data = {
    type: type,
    constructor: constructor,
    length: length,
    value: value
  }
  return data;   
}

function setDebugMode(value) {
  debugMode = value
}

/**Sets the verbose level
 * @function setVerboseLevel
 * @memberof KT.Debuger
 * @param {Int} - The new level
 */
function setVerboseLevel(level) {
  if( level === parseInt(level, 10)
      && level >= 0
      && level <= MAX_VERB_LEVEL) {

    log(level)
    verboseLevel = level;
  }
}


function setVerboseMode(value) {
  if(!_.isBoolean(value)) return
  verboseMode = value
}

/**Control method to check if the value is in the 
 * current verboseLevel. Used to control the Debugger 
 * outputs based on the level
 * 
 * @param value 
 */
function verbLevel(level) {
  var pass = true;
  if( level === parseInt(level, 10)) {
    pass = verboseLevel >= level 
    && level <= MAX_VERB_LEVEL;
  }
  return pass
}

KT.Debuger = function() {};

KT.Debuger.clearLog = clearLog;
KT.Debuger.debug = debug;
KT.Debuger.inspect = inspect;
KT.Debuger.isObject = isObject;
KT.Debuger.log = log;
KT.Debuger.setDebugMode = setDebugMode;
KT.Debuger.setVerboseLevel = setVerboseLevel;
KT.Debuger.setVerboseMode = setVerboseMode;
KT.Debuger.verbose = verbose;


KT.Debug = debug;
KT.Log = debug;
KT.Verbose = verbose;

KT.Debug.on = function() {
  setDebugMode(true)
}

KT.Debug.off = function() {
  setDebugMode(false)
}
})();