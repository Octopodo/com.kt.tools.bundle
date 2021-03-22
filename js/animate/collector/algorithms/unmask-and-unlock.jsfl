(function() {

/*If a symbol contains masks and shape layers, Animate gets the transform data
* acording to the masking shape, not the real data. So in order to fix this, 
* unmask is required. 
* This algorithm unmasks and stores temporary the child layers of the mask.
*/


function UnmaskChildren() {
  var source = this.get('source'),
      timeline = this.get('timeline'),
      type = this.get('type'),
      tempData;
  this.set('tempData', this.tempData || {});
  tempData = this.get('tempData')
  tempData.isVisible = type === 'Layer' || type === 'Group' ? source.visible : null;
  source.visible = true;

  if(!this.get('isMask') && !this.get('isGuide')) return;
  
  tempData.childLayers = KT.Layers.getChildren(source, timeline)
  source.layerType = 'normal'
  
}

function RemaskChildren() {
  var source = this.get('source'),
      tempData = this.get('tempData'),
      isMask = this.get('isMask'),
      isGuide = this.get('isGuide');
  if(!tempData) return;
  if(_.isBoolean(tempData.isVisible)){
    source.visible = tempData.isVisible;
  }
  if( !isMask && !isGuide )  return
  
  source.layerType = 'mask';
  _.each(tempData.childLayers, function(layer){
    layer.parentLayer = source;
  })
}

var Unmask = function(){}
var Remask = function(){}
Unmask.Group = UnmaskChildren;
Unmask.Layer = UnmaskChildren;
Remask.Layer = RemaskChildren;
Remask.Group = RemaskChildren;

KT.Algorithm.register('Unmask', Unmask)
KT.Algorithm.register('Remask', Remask)


})();