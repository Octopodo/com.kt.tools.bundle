(function(){
  /**Converts a string or array into RegExp
 * @function RegExp
 * @memberof KT
 * @param {String|String[]} filter A string or array of strings co conver in regexp
 * @param {String} [flags]
 * @returns The created Regexp or an empty one
 */
KT.RegExp = function(filter, strict, flags) {
  var flags = typeof flags === 'string'? flags : 'gi',
      all = !filter,
      expression = all? ['.'] : KT.RegExp.escape(filter);

  expression = strict && !all ? '^' + expression.join('$|^') + '$' : expression.join('|');
 
  expression = new RegExp(expression, flags)

  if(!(expression instanceof RegExp)) {
    return new RegExp('')
  }
  return expression
}

KT.RegExp.escape = function(str) {
  var res = _.isArray(str) ? str : [str],
      out = [],
      i = 0, 
      len = res.length,
      replace;
      
  for(; i < len; i++) {
    try{
      replace = res[i].replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
      
      out.push(replace)
    } catch(e) {
      an.trace('Regexp error: ' + JSON.stringify(res[i]))
    }
    
    
  }
  
  return out
}

})();