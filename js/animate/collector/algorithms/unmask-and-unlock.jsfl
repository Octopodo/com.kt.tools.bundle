(function() {

/*If a symbol contains masks and shape layers, Animate gets the transform data
* acording to the masking shape, not the real data. So in order to fix this, 
* unmask is required. 
* This algorithm unmasks and stores temporary the child layers of the mask.
*/


function UnmaskChildren() {
  var source = this.getSource(),
      timeline = this.getTimeline();
  this.tempData = this.tempData || {};
  this.tempData.isVisible = this.type === 'Layer' || this.type === 'Group' ? source.visible : null;
  source.visible = true;

  if(!this.isMask && !this.isGuide) return;
  
  this.tempData.childLayers = KT.Layers.getChildren(source, timeline)
  source.layerType = 'normal'
  
}

function RemaskChildren() {
  var source = this.getSource();
  if(_.isBoolean(this.tempData.isVisible)){
    source.visible = this.tempData.isVisible;

  }
  if((!this.isMask && !this.isGuide)|| !this.tempData) return
  
  source.layerType = 'mask';
  _.each(this.tempData.childLayers, function(layer){
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