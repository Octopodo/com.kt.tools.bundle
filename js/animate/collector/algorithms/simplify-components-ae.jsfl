(function(){


function unify(components) {
  
  var unified = _.groupBy(components, function(child){ return child.get('source').libraryItem}),
      i, j, jLen,
      component,
      item,
      data,
      itemData,
      uniq = [];

  for(i in unified) {
    component = unified[i][0];
    data = component.get('data');
    for(j = 1, jLen = unified[i].length; j < jLen; j++) {
      item = unified[i][j];
      itemData = item.get('data');
      data.position.push(itemData.position);
      data.anchor.push(itemData.anchor);
      data.rotation.push(itemData.rotation);
      data.size.push(itemData.size);
      data.path = itemData.path
    }

    uniq.push(component)
  }
  return uniq
}

function SimplifyLayer(opts) {
  if(this.components.length === 0) return
  var opts = opts || {},
      source = this.get('source'),
      keys = KT.Frames({source: source, keys: true}),
      clean = typeof opts.clean === 'boolean' ? opts.clean : true, 
      child,
      numSymbols,
      i = 0,
      len = this.components.length,
      types = {symbols: false, elements: false};

  this.components = unify(this.components)
  for(;i < len; i++) {
    if(types.symbols === false && types.elements === false){
      child = this.components[i];
      types.symbols = types.symbols === true ? true : child.get('type') === 'Symbol';
      types.elements = types.elements === true ? true : child.get('type') !== 'Symbol';
    }
  }

  //IF clean simplify, only one item per layer is allowed.
  //If only are elements, simplify the layer.
  if(clean === true && types.elements === true){
    this.removeChildren();
    return
  }

  if(clean && numSymbols > keys.length) {
    
    this.removeChildren();
  }
}


function SimplifySymbol(opts) {
  var opts = opts || {},
      clean = typeof opts.clean === 'boolean' ? opts.clean : true,
      cleanSymbols = typeof opts.cleanSymbols === 'boolean' ? opts.cleanSymbols : true,
      i = 0,
      len = this.components.length,
      timeline = this.get('source').timeline || this.timeline,
      isSequence,
      child,
      layer,
      childData,
      childSource,
      childType,
      hasSymbols =  false,
      hasDataLayers = false,
      hasSequences = false,
      isEmpty,
      isDataLayer;

  for( i = len - 1; i >= 0; i--){
    isEmpty = false;
    child = this.components[i];
    childData = child.get('data');
    childSource = child.get('source');
    childType = child.get('type');
    isDataLayer = child.get('isDataLayer');
    isSequence = childData.timing && childData.timing.frames.length > 1;
    hasDataLayers = hasDataLayers || child.get('isDataLayer');
    hasSequences = hasSequences || isSequence
    isEmpty = KT.Layers.isEmpty({
      layer: childSource,
      timeline: timeline
    })
    
    if(isEmpty === true) {
      this.components.splice(i, 1)
      continue
    }
    if((clean === true && hasSymbols === false) ) {
      hasSymbols = child.hasSymbols();
    }
    if( childType === 'Layer' && child.components.length === 1 && !isDataLayer) {
      
      // if( KT.Frames({source: childSource, keys: true}).length > 1 ) {
      //   child.components[0].set('data', childData);
      // }
      this.components.splice(i, 1, child.components[0]);
      continue;
    }

    if(childType === 'Group' && childSource){
      
      hasSymbols = true;
      layer = childSource;
      isEmpty = child.components.length < 1;
      if(isEmpty === true && layer.layerType === 'folder'){
        this.components.splice(i, 1);
        continue;
      }
    }
    
  }

  if(this.type !== 'Group' && clean  && !hasSymbols  && !hasSequences && cleanSymbols) {  //
    this.removeChildren();
    return
  }
}


    
  
var SimplifyAE = function(){};

SimplifyAE.Layer = SimplifyLayer;
SimplifyAE.Symbol = SimplifySymbol;
SimplifyAE.Group = SimplifySymbol;
SimplifyAE.Timeline = SimplifySymbol;
  
KT.Algorithm.register('Simplify', SimplifyAE);
    
    
    
})();