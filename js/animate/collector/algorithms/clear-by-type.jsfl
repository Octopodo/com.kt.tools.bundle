(function() {

  function clearByType() {
    var types = Array.prototype.slice.call(arguments);
    this.components = _.filter(this.components, function (child){
      var preserve = _.find(types, function(type){
        return type !== child.type
      })
      return preserve !== undefined
    })
  }

  function clearByName() {
    var names = Array.prototype.slice.call(arguments);
    this.components = _.filter(this.components, function (child){
      var preserve = _.find(names, function(name){
        return name !== child.getId()
      })
      return preserve !== undefined
    })
  }
  
  
  
  var ClearByType = function(){}
  ClearByType.default = clearByType;
  KT.Algorithm.register('Clear By Type', ClearByType);

  var ClearByName = function(){}
  ClearByName.default = clearByName;
  KT.Algorithm.register('Clear By Name', ClearByName)
  
  
  })();