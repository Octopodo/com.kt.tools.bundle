(function(){
  function isInt(number) {
    return _.isNumber(number) && number === parseInt(number, 10);
  }
  
  function isInRange(number, min, max) {
    if(!number || !_.isNumber(number) || !max || !_.isNumber(min) || !min || !_.isNumber(max)) return false
    return number >= min && number <= max
  }
  
  
  function stringToArray (str) {
    var arr = ternary(
      _.isArray(str)  , str,
      _.isString(str) , [str],
      []
    );
    return arr
  }
  
  
  function ternary() {
    if(arguments.length < 4) return;
    var i = 0,
        len = arguments.length;
  
    for (;i < len; i += 2) {
      if(arguments[i] === undefined) break;
      if(arguments[i] === true) return arguments[i + 1];
    }
    return arguments[len - 1]
  }
  
  
  function toCallback(callback) {
    var callback = _.isFunction(callback) ? callback :  function(item) {return item};
    return callback
  }
  
  
  function toCondition(condition, defaultValue) {
    var defaultValue = _.isBoolean(defaultValue) ? defaultValue : true,
        condition = _.isFunction(condition) ? condition:  function() {return defaultValue};
    return condition
  }
  
  function toRegExp(source, flags) {
    var source = stringToArray(source),
        source = source.length >= 1 ? KT.RegExp(source, true, flags) : null;
  
    return source
  }
  
  function formatNumber(number, radix) {
    if(!_.isNumber(number)) { return number}
    var radix = radix || 2,
        number = number.toString(),
        i = 0;
    if(number.length < radix) {
      for(;i < radix; i++) {
        number = '0' + number
      }
    }
    return number
  }

  _.mixin({
    isInt: isInt,
    isInRange: isInRange,
    stringToArray: stringToArray,
    ternary: ternary,
    toCallback: toCallback,
    toCondition: toCondition,
    toRegExp: toRegExp,
    formatNumber: formatNumber
  });
  
  })();