(function(){


function unify(components) {
  
  var unified = _.groupBy(components, 'id'),
      i, j, jLen,
      component,
      item,
      uniq = [];

  KT.Debug('UNIFIED', unified)
  for(i in unified) {
    component = unified[i][0];
    
    for(j = 1, jLen = unified[i].length; j < jLen; j++) {
      item = unified[i][j];
      component.data.position.push(item.data.position);
      component.data.anchor.push(item.data.anchor);
      component.data.rotation.push(item.data.rotation);
      component.data.size.push(item.data.size);
      component.data.path = item.data.path
    }

    uniq.push(component)
  }
  return uniq
}

function SimplifyLayer(opts) {
  if(this.components.length === 0) return
  var opts = opts || {},
      source = this.getSource(),
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
      types.symbols = types.symbols === true ? true : child.type === 'Symbol';
      types.elements = types.elements === true ? true : child.type !== 'Symbol';
    }
  }

  //IF clean simplify, only one item per layer is allowed.
  //If only are elements, simplify the layer.
  if(clean === true && (
       (types.symbols === true && types.elements === true)
    || (types.symbols === false && types.elements === true)
  )){
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
      timeline = this.getSource().timeline || this.timeline,
      isSequence,
      child,
      layer,
      hasSymbols =  false,
      hasDataLayers = false,
      hasSequences = false,
      isEmpty;

  for( i = len - 1; i >= 0; i--){
    isEmpty = false;
    child = this.components[i];
    isSequence = child.data.timing && child.data.timing.frames.length > 1;
    hasDataLayers = hasDataLayers || child.isDataLayer;
    hasSequences = hasSequences || isSequence
    isEmpty = KT.Layers.isEmpty({
      layer: child.getSource(),
      timeline: timeline
    })
    
    if(isEmpty === true) {
      this.components.splice(i, 1)
      continue
    }
    if((clean === true && hasSymbols === false) ) {
      hasSymbols = child.hasSymbols();
    }
    if( child.type === 'Layer' && child.components.length === 1 && !child.isDataLayer) {
      
      if( KT.Frames({source: child.getSource(), keys: true}).length > 1 ) {
        child.components[0].data = child.data;
      }
      this.components.splice(i, 1, child.components[0]);
      continue;
    }

    if(child.type === 'Group' && child.getSource()){
      
      hasSymbols = true;
      layer = child.getSource();
      isEmpty = child.components.length < 1;
      if(isEmpty === true && layer.layerType === 'folder'){
        this.components.splice(i, 1);
        continue;
      }
    }
    
  }

  if(this.type !== 'Group' && clean  && !hasSymbols && !hasSequences && cleanSymbols) {
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