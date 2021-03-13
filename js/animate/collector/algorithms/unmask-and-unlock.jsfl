(function() {

/*If a symbol contains masks and shape layers, Animate gets the transform data
* acording to the masking shape, not the real data. So in order to fix this, 
* unmask is required. 
* This algorithm unmasks and stores temporary the child layers of the mask.
*/


function UnmaskChildren() {
  if(!this.isMask && !this.isGuide) return;
  var source = this.getSource(),
      timeline = this.getTimeline();

  this.tempData = this.tempData || {};
  this.tempData.childLayers = KT.Layers.getChildren(source, timeline)

  source.layerType = 'normal'
}

function RemaskChildren() {
  if((!this.isMask && !this.isGuide)|| !this.tempData) return
  var source = this.getSource();
  source.layerType = 'mask';
  _.each(this.tempData.childLayers, function(layer){
    layer.parentLayer = source;
  })

}

var Unmask = function(){}
var Remask = function(){}
Unmask.Group = UnmaskChildren;
Remask.Group = RemaskChildren;
KT.Algorithm.register('Unmask', Unmask)
KT.Algorithm.register('Remask', Remask)


})();