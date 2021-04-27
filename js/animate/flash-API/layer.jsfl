/** A layer interface to make easier to work with layers
 * @namespace
 * @static
 * @name Layer
 * @memberof KT
 */

(function(){
function getLayerIndex(layer, timeline) {
  var index,
      i = 0,
      len = timeline.layers.length;
  for(; i < len; i++) {
    if(timeline.layers[i] === layer) {
      index = i;
      break;
    }
  }
  return index;
}

/**Copy to the clipboard the layers that match the names on the timeline
 * @function copy
 * @memberof KT.Layer
 * @param {Any} timeline @see KT.Document.getTimeline
 * @param {String|String[]} [layers=/./gi] The name of the layers to copy. If not passed, all layers on the current timeline are copied
  */
  function copyOrCut (layers, cut ,timeline) {
    KT.Verbose(arguments);
    var timeline = KT.Document.getTimeline(timeline),
      firstSelection = true,
      action = cut === true ? 'cutLayers' : 'copyLayers',
      index;

    if(layers instanceof Layer || layers[0] instanceof Layer ) { //If layers are Layers
      var layers = _.isArray(layers) ? layers : [layers],
          i = 0,
          len = layers.length,
          firstSelection = true;
      for(; i < len; i ++) {
        index = _.isNumber(layers[i].index) ? layers[i].index : getLayerIndex(layers[i], timeline)
        if(!_.isNumber(index)) continue
        
        timeline.setSelectedLayers(index , firstSelection);
        if(firstSelection) {
          firstSelection = false;
        }
      }
    } else { //If layers are names
      var layersName = !layers ? /./gi : KT.RegExp(layers);
          layers = walk(timeline, function(layer, i, timeline){
            var match = layer.name.match(layersName);
            KT.Verbose('Current Layer', layer, layers);
            if(match){
              timeline.setSelectedLayers(i, firstSelection);
              if(firstSelection) {
                firstSelection = false;
              }
              return layer;
            }
          });
    }
  timeline[action]();
  return layers;
};

function cutLayers(layers, timeline) {
  copyOrCut(layers, true, timeline);
}

function copyLayers(layers, timeline) {
  copyOrCut(layers, false, timeline);
}

/**Paste the current clipboard layers */
function pasteLayers(timeline) {
  KT.Verbose(arguments);
  try {
    var timeline = KT.Document.getTimeline(timeline)
    timeline.pasteLayers();
  } catch (e) {
    KT.Verbose('No items to paste')
  }
  
};


function getBounds(layers, timeline, condition) {
  var frames = [],
      layer,
      bounds,
      layers = KT.Layers({
        layers: layers,
        timeline: timeline
      }),
      i = 0,
      len = layers.length;
  for(; i < len; i++) {
    layer = layers[i];
    frames = _.union(frames, KT.Frames({
      source: layer,
      check: condition
    }));
  }
  
  bounds = KT.Frames.getBounds(frames);

  return bounds
}



function getEmptyLayers (opts) {
  var opts = opts || {},
      layers = opts.layers;

  opts.timeline = KT.Document.getTimeline(opts.timeline);
  layers = KT.Layers({
    layers: layers,
    timeline: opts.timeline,
    strict: opts.strict ,
    condition: function(layer) {
      opts.layer = layer;
      return isEmpty(opts)
    }
  });
  
  return layers
}

/**
 * 
 * @param opts - timeline, label, actions 
 */
function deleteEmpty(opts) {
  KT.Verbose(arguments);
  var timeline = opts instanceof SymbolItem || opts instanceof SymbolInstance ? 
                KT.Document.getTimeline(opts) : KT.Document.getTimeline(opts.timeline),
      label = opts.label,
      actions = opts.actions,
      self = this,
      removedLayers = walk(timeline, function(layer, i, timeline){
        var isEmpty = self.isEmpty({layer: layer, timeline: timeline, label: label, actions: actions})
        KT.Verbose('Layer', layer.name, 'Is empty: ' + isEmpty)
        if(isEmpty) {
          var name = layer.name;
          timeline.deleteLayer(i)
          return name
        }
      }, true)
  return removedLayers
};

function deleteLayer(layer, timeline) {
  var tLayer = timeline.layers[layer.index];
  if(tLayer === layer) {
    timeline.deleteLayer(layer.index);
  }
}


function getElements(layers) {
  var elements = [],
      i = 0,
      len = layers.length;
  for(; i < len; i++){
    KT.Frames({
      source: layers[i],
      check: function(f) { return f.isKey },
      do: function(frame) {
        elements = _.union(elements, frame.elements);
      }
    });
  }
  elements = _.uniq(elements);
  return elements
}

/**Get the matching layers from a timeline
 * @function get
 * @memberof KT.Layer
 * @param {Object} opts
 * @param {String|String[]|Timeline} [opts.timeline] The timeline, the name or names of the timelines
 * @param {String|String[]} [opts.layers] The name or names of the layers
 * @param {Function} [opts.condition] A condition based on the layer properties
 * @returns An Array with the selected layers
*/
function getLayers(opts) {
  KT.Verbose(arguments);
  //Initialize
  var opts = opts || {},
      timeline = KT.Document.getTimeline(opts.timeline),
      condition = opts.condition || opts.check || function(){ return true },
      callback = opts.callback || opts.do || function() {},
      useGlobalOpts = typeof opts.useGlobalOpts === 'boolean'? opts.useGlobalOpts : true,
      forceArrayReturn = opts.forceArrayReturn === true ? true : false, //Force the array return if only one layer is selected
      layerNames = [],
      layers = [], 
      inputLayers =  //Check the type of the layer inputs and ensure an Array value
          _.isString(opts) || opts instanceof Layer ? [opts]                    
        : _.isString(opts.layers) || opts.layers instanceof Layer? [opts.layers]
        : _.isArray(opts) ? opts
        : _.isArray(opts.layers) ? opts.layers
        : [],
      i = 0,
      len = inputLayers.length,
      strict = typeof opts.strict === 'boolean' ? opts.strict : false,
      selectedLayers = [],
      noLayerNames,
      pass,
      layer,
      userCondition,
      match,
      get;
  //If true, return a new condition function tu use the global condition
  if(useGlobalOpts === true) {
    userCondition = condition;
    condition = function(layer, i, layers) {
      get = userCondition(layer, i, layers) && setGetterOptions()(layer)
      return get
    }
  }

  //Pull apart layer objects from layer names and unvalid arguments
  for(; i < len; i++) {
    layer = inputLayers[i];
    if(_.isString(layer)) layerNames.push(layer);
    if(layer instanceof Layer && condition(layer, i) === true) {
      callback(layer)
      layers.push(layer)
    };
  }
  //If no valuer, return
  // if(layers.length === 0 && layerNames.length === 0) return;

  //Check if no names are passed
  noLayerNames = strict === false ? layerNames.length === 0 && layers.length > 0 
                : layerNames.length === 0 && layers.length === 0 ;

  //Create the matcher expression from names
  layerNames = layerNames.length === 0 ? /./gi : KT.RegExp(layerNames, true);
  
  //If there are layer names, get those layers if them oas the condition
  //Else, return an empty array
  selectedLayers = noLayerNames === true ? []
    : walk(timeline, function(layer, i, layers){
      match = layer.name.match(layerNames) !== null;
      pass = condition(layer, i, layers) === true;
      if(match && pass) {
        callback(layer, i, layers);
        return layer
      }
    });

  //Merge the selectedLayers with the passed layers
  layers = _.union(layers, selectedLayers)

  //I there is only one layer, return it, else return an array
  return layers
};



function getChildren(folder, timeline, callback) {
  KT.Verbose(arguments)
  var folder = KT.Layers(folder)[0],
      match = _.isGroupLayer(folder) ||  null,
      timeline = KT.Document.getTimeline(timeline),
      callback = _.isFunction(callback) ? callback : function(){},
      layers = [];

  if(match !== null) {
    layers = KT.Layers({
      timeline: timeline,
      do: callback,
      check: function(layer) {
        return layer.parentLayer !== null ? layer.parentLayer === folder : false
      },
    })
  }

  return layers
}


/** Determine if a layer is empty. Empty means: no elements, no tags or no actionScript.
 * Tags and actionScript can be ommited by parameter. Folders and guide layers are considered
 * empty only if them don't have ani nested layer
 * 
 * @param {Layer} layer - the layer to inspect 
 * @param {Timeline} timeline - The timeline of the layer(in case it is a folder)
 * @param label
 * @param actions 
 */
function isEmpty(opts) {

  KT.Verbose(arguments);
  var layer = opts.layer,
      timeline = KT.Document.getTimeline(opts.timeline),
      labels = typeof opts.labels === 'boolean' ? opts.labels : true,
      actions = typeof opts.actions === 'boolean' ? opts.actions : true,
      props = ['name','elements', 'actionScript'],
      noItems,
      noFlags,
      noActions,
      frames = [];

  if(!layer) return true


  isEmptyL = layer.layerType === 'folder' ? getChildren(layer, timeline).length <= 0 : true;
  if(!isEmptyL) {
    return isEmptyL
  }

  frames = KT.Frames({
    source: layer,
    props: props,
    check: function(frame){
      noItems = frame.source.elements.length <= 0;
      noFlags = labels === true ? frame.name === '' : noItems;
      noActions = actions === true ? frame.actionScript === '' : noItems ;
      return noItems && noFlags && noActions
    }
  });

  noItems = frames.length > 0

  return noItems
};

function getDataLayers(opts) {
  var layers = opts.layers,
      timeline = opts.layers,
      layers = getEmptyLayers({
        layers: layers,
        timeline: timeline,
        strict: opts.strict,
        labels: false,
        actions: false
      }),
      noFlags;

  layers = KT.Layers({
    layers: layers,
    timeline: timeline,
    strict: opts.strict,
    check: function(layer) {
      noFlags = isEmpty({
        layer: layer,
        timeline: timeline
      })
      return !noFlags
    }
  })
  return layers
}

function getElementTypes(layers, timeline){
  var timeline = KT.Document.getTimeline(timeline),
      types = {
        symbols: false,
        elements: false,
      },
      
      i = 0,
      len = layers.length,
      element;
  
  for(; i < len; i++) {
    KT.Frames({
      source: layers[i],
      keys: true,
      do: function(frame) {
        for(var e = 0, length = frame.elements.length; e < length; e++){
          element = frame.elements[e];
          types.symbols = types.symbols === true ? true : element instanceof SymbolInstance;
          types.elements = types.elements === true ? true : !(element instanceof SymbolInstance);
        }
      }
    })
  }
  
  return types
}

function getGroupLayers(layers, type) {
  var type = !type || !_.isString(type)? /folder|mask|guide/g : new RegExp(type, 'g'),
      timeline = KT.Document.getTimeline(layers.timeline),
      groupLayers = KT.Layers({
        layers: layers,
        timeline: timeline,
        check: function(layer) {
          return layer.layerType.match(type) !== null
        }
      })
      
  return groupLayers
}


/**Gets the keyframes of a layer
 * @function getKeyFrames 
 * @memberof KT.Layer
 * @param {String|String[]|Timeline|Layer} timeline The timeline, the name or names of the timelines. It can be the layer itself
 * @param {Layer|String} [layer] The layer itself or the name of the layer
 * @param {String[]} [props=['isKey', 'index', 'source']] An array with the props to retrieve
 * @returns An array of objects with the passed propertie
 * 
*/
function getLayerKeys(layers) {
  var keys = [],
        i = 0,
        len = layers.length,
        frames;
        
    for(; i < len; i++) {
      frames = KT.Frames(layers[i]).keys();
      keys = _.union(keys, frames);
    }
    keys = KT.Frames(keys);
    return keys
};


/**Gets the selected layers from a timeline 
* @param {String|String[]|Timeline|Layer} timeline The timeline, the name or names of the timelines. It can be the layer itself
* @returns An array containing the selected layers
*/

function getSelected(timeline) {
  KT.Verbose(arguments);
  var timeline = KT.Document.getTimeline(timeline),
      selectedLayers = timeline.getSelectedLayers(),
      layers = [],
      layer;

  for (var i = 0; i < selectedLayers.length; i ++) {
    layer = timeline.layers[selectedLayers[i]];
    layer.index = selectedLayers[i];
    layers.push(layer)
  }
  return layers
};






function offsetLayers(layers, offset) {
  KT.Verbose(arguments)
  var layers = _.isArray(layers) ? layers : [layers],
      offset = offset,
      i = 0,
      len = layers.length,
      layer;
  
  for(; i < len; i++) {
    layer = layers[i];
    KT.Frames({source: layer}).offsetPosition(offset)
  }

}

function resetIndices(layers, timeline) {
  var len = layers.len,
      i;
  walk(timeline, function(layer, index) {
    for(i = 0; i < len; i++) {
      if(layers[i] === layer) {
        layers[i].index = index;
        break;
      }
    }
  })
}

function setGetterOptions() {
  KT.Verbose(arguments);
  var options = KT.System.Options.layers;
  return function(layer) {
    var get = true;
    if(options.onlyVisible 
      && options.masksAreInvisible === false
      && layer.layerType === 'mask') {
    get = true
    }
    if(options.onlyVisible === true) {
      get = get && layer.visible
    }
    return get
  }
}


/**Iterate through the layers of a symbol or timeline and perform a callback function
* @function walk
* @memberof KT.Layer
* @param {Timeline|SymbolItem} timelineOrSymbol 
* @returns An Arraywith the callback results
*/
function walk(timelineOrSymbol, callback, reverse) {
  KT.Verbose(arguments);
  var callback = !callback || !KT.isFunction(callback) ? function(layer) {return layer } : callback,
      options = options || {},
      timeline = KT.Document.getTimeline(timelineOrSymbol),
      layers = timeline.layers,
      values = [],
      i,
      layer,
      result;

  for(i = reverse ? layers.length -1 : 0;
          reverse ? i>=0 : i < layers.length; 
          reverse ? i-- : i++) {

    layer = layers[i];
    layer.index = i;
    result = callback(layer, i, timeline);
    if(!result) {
      continue
    }
    values.push(result)
  }

  return values
};


//Main constructor
function initLayers(opts) {
  this.timeline = KT.Document.getTimeline(opts.timeline);
  return getLayers(opts)
}
//Define the module.
function Layers(opts){
  // if (!(this instanceof arguments.callee)) {
  //   return new Layers(opts);
  // }
  
};



Layers.prototype = {
  configure: function(opts) {
    var opts = opts || {}
    this.timeline = KT.Document.getTimeline(opts.timeline)
  },
  byName: function() {
    var args = _.flatten(Array.prototype.slice.call(arguments)),
        i = 0,
        len = this.length,
        self = this;
    return KT.Layers({
      layers: args,
      timeline: this.timeline,
      check: function(layer) {
        for(; i < len; i++) {
          if(layer === self[i]) return true
        }
      }
    })
  },

  init: function(opts) {
    var opts = opts || {};
    return initLayers.call(this, opts);
  },

  copy: function() {
    copyLayers(this, this.timeline);
    return this
  },

  cut: function (){
    cutLayers(this, this.timeline);
    return this
  },

  delete: function(layers) {
    var layers = _.flatten(Array.prototype.slice.call(arguments)),
        len = this.length,
        self = this,
        i = 0,
        layers = KT.Layers({
          layers: layers,
          timeline: self.timeline,
          check: function(layer) {
            for(i = 0; i < len; i++) {
              if(layer === self[i]) return true;
            }
          },
        }),
        layer,
        children,
        index;
    
    
    for(i =  layers.length - 1, len =0; i >= len; i--) {
      layer = layers[i];
      if(layer.layerType === 'folder') {
        children = KT.Layers.getChildren(layer);
        this.delete(children)
      }
      index = layer.index;
      this.timeline.deleteLayer(index)
      this.splice(index, 1)
    }
    resetIndices(this, this.timeline);
    this.print()
    return this
  },
  
  deleteEmpty: function(opts) {
    var opts = opts || {},
        i = this.length - 1;
        
    opts.timeline = this.timeline;

    for(; i >= 0; i--) {
      opts.layer = this[i];
      if(isEmpty(opts)) {
        deleteLayer(this[i], this.timeline);
        this.splice(i, 1)
      }    
    }
    
    resetIndices(this, this.timeline)
    return this
  },

  first: function() {
    this[0];
  },

  getBounds: function(frameCondition) {
    return getBounds(this, this.timeline, frameCondition);
  },

  getChildren: function() {
    var types = Array.prototype.slice.call(arguments),
        types = _.filter(types, function(item) {return _.isString(item)}),
        types = types.length === 0 ? null : types.join('|'),
        folders = this.getGroups(types),
        len = folders.length,
        i = 0,
        layers = KT.Layers({
          timeline: this.timeline,
          check: function(layer){
            for(i = 0; i < len; i++) {
              
              if(folders[i] === layer.parentLayer) return true
            }
          }
        });
    return layers
  },

  getElements: function() {
    return getElements(this)
  },

  getElementTypes: function() {
    return getElementTypes(this, this.timeline)
  },

  getGroups: function(types) {
    var groups = getGroupLayers(this, types);
    return groups
  },

  getDataLayers: function(opts) {
    opts = opts || {}
    opts.layers = this;
    opts.timeline = this.timeline;
    opts.strict = true;
    return getDataLayers.call(this, opts)
  },
  getFolders: function() {
    return getGroupLayers(this, 'folder')
  },
  getMasks: function() {
    return getGroupLayers(this, 'mask')
  },
  getGuides: function() {
    return getGroupLayers(this, 'guide')
  },

  getEmpty: function(opts) {
    opts.layers = this;
    opts.timeline = this.timeline;
    opts.strict = true;
    return getEmptyLayers()
  },

  keys: function() {
    return getLayerKeys(this)
  },

  last: function() {
    return this[this.length - 1]
  },


  offsetPosition: function(offset) {
    offsetLayers(this, offset);
    return this
  },

  paste: function(timeline) {
    var timeline = !timeline ? this.timeline : KT.Document.getTimeline(timeline);
    pasteLayers(timeline);
    return this
  },

  print: function() {
    var names = []
    for(var i = 0, len = this.length; i < len; i++) {
      names.push(this[i].index + '->'+this[i].name );
    }
    // KT.Log(names)
  }
}

KT.Layers = KT.ExtendArray(Layers);

//Asign module methods
KT.Layers.copy = copyLayers;
KT.Layers.cut = cutLayers;
KT.Layers.get = getLayers;
KT.Layers.deleteEmpty = deleteEmpty;
KT.Layers.getChildren = getChildren;
KT.Layers.getBounds = getBounds;
KT.Layers.getKeyFrames = getLayerKeys;
KT.Layers.getSelected = getSelected;
KT.Layers.isEmpty = isEmpty;
KT.Layers.offsetPosition = offsetLayers;
KT.Layers.paste = pasteLayers;
KT.Layers.walk = walk;
})();