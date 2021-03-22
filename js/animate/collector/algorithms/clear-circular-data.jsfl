(function() {

function clearCircularData(path) {
  this.delete('parent');
  this.delete('tempData');
}

var ClearCircularData = function(){}
ClearCircularData.default = clearCircularData;

KT.Algorithm.register('Clear Circular Data', ClearCircularData)
  
  
})();