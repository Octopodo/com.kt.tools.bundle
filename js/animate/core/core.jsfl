(function(){


KT.addMethod = function(object, method, name) {

}

KT.getFullType = function(obj) {
  return Object.prototype.toString.call(obj)
}

KT.getType = function(obj) {
  return this.getFullType(obj).replace(/\[object| |]/g, '')
}


KT.Options = {
  leafs: KT.RegExp(['leaf', 'stop', 'end']),
  dataLayers: KT.RegExp(['timing', 'poses', 'emotions'])
}





})()