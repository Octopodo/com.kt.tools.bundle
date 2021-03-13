(function() {

  function clearCircularData(path) {
    if(this.parent) {
      delete this.parent
    }
    if(this.tempData) {
      delete this.tempData
    }
  }
  
  
  
  var ClearCircularData = function(){}
  ClearCircularData.default = clearCircularData;

  KT.Algorithm.register('Clear Circular Data', ClearCircularData)
  
  
  })();