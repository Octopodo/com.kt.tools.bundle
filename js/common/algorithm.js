(function(){

var algorithms = {};

function Algorithm (id) {
  if(_.isString(id)){
    var id = id.replace(' ', '');
    return algorithms[id];
  }  
}

Algorithm.register = function(id, func) {
  if(!_.isString(id)) {
    throw new Error ("Algorithm invalid ID")
  }
  if(!_.isFunction(func)) {
    throw new Error ("Algorithm needs a function object")
  }
  if(!_.isUndefined(algorithms[id])) {
    throw new Error (id + " algorithm already exists. Try another name")
  }

  if(!_.isFunction(func.default)) {
    func.default = function(){}
  }

  var id = id.replace(' ', '');
 
  algorithms[id] = func;
}

KT.Algorithm = Algorithm;

})();