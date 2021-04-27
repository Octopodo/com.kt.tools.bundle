(function() {

/** Creates Function from the passed layers
 * @function createSymbolFromLayers
 * @memberof KT.Document
 * @param {Object} [opts] - An options Object.
 * @param {String} [opts.layers] - The names of the layers to symbolize.
 * @param {Timeline} [opts.timeline] - The timeline where the layers belong.
 * @param {String} [opts.name] - The name of the new symbol. If not passed, the first layer name will be used
 * @param {String} [opts.path] - The path on the library where to store the new symbol.
 * @param {String} [opts.type] - Tue type of the symbol.
 * @param {Boolean} [opts.replace] - Replace the layers with the new symbol.
 * @returns {Layer|SymbolIte} - If replace is true, returns the replacer layer, if not, returns the new symbol
 */

function createSymbolFromLayers(opts) {
  //Settup

  var timeline = opts.timeline, //KT.Document.getTimeline(opts.timeline),
      name = opts.name || 'Symbol_from_layers',
      path = opts.path ,
      type = opts.type || 'graphic',
      copyAction = opts.replace === true ? 'cut' : 'copy',
      maxFrames = 0,
      newSymbol = KT.Library.create({
        name: name,
        path: path,
        type: type
      }),
      defaultLayer = KT.Layers({
        layers: newSymbol.timeline.layers[0],
        timeline: newSymbol
      }),
      layers = KT.Layers({
        layers: opts.layers,
        timeline: timeline,
        do: function(layer) {
          maxFrames = Math.max(maxFrames, layer.frames.length)
        }
      }),
      bounds = layers.getBounds(function(frame) {
        return frame.isKey
      }),
      index = layers[0].index,
      replacedLayer,
      element;
    
  //Perform
  layers[copyAction]();
  layers.paste(newSymbol);
  defaultLayer.delete();
  layers = KT.Layers({
    timeline: newSymbol.timeline
  }).offsetPosition( {
    x: -bounds.x,
    y: -bounds.y
  });

  if(!opts.replace) return newSymbol;
  replacedLayer = KT.Library.addItemToTimeline({
    item: newSymbol,
    timeline: timeline,
    index: index
  });

  

  element = replacedLayer.frames[0].elements[0];
  element.x = bounds.x;
  element.y = bounds.y;
  
  if(replacedLayer.frames.length < maxFrames--) {
    timeline.insertFrames(maxFrames);
  }

  return replacedLayer
  
}


function createSymbolFromSelectedLayers( opts ) {
  KT.Verbose(arguments);

  var timeline = opts.timeline,
      name = opts.name,
      path = opts.path,
      type = opts.type,
      replace = opts.replace
      layers = KT.Layer.getSelected(timeline),
      layers = _.map(opts.layers, function(l){ return l.name});

  return this.createSymbolFromLayers({
    layerNames: layerNames, 
    path: path, 
    type: type,
    replace: replace,
    timeline: timeline,
    name: name
  })
};


function closeLibraryItem() {
  KT.Verbose(arguments);

  KT.Library().selectAll(false)
  KT.Library().editItem()
};

/**Duplicates a symbol or a scene
 * @function duplicateTimeline
 * @memberof KT.Document
 * @param {Timeline} timeline The timeline to duplicate
 * @return Symbol if is timeline symbol, Bool if its a scene
 */
function duplicateTimeline(timeline, newName){
  KT.Verbose(arguments);

  var libraryItem = timeline.libraryItem,
      document = KT.Document();
  if(!libraryItem) {
    var type = 'Scene',
        name = newName || document.timelines[document.currentTimeline].name,
        newName = newName || name + '(KT_Backup)',
        duplicated = document.duplicateScene();

    duplicated = { result: duplicated , name: newName};
    document.timelines[document.currentTimeline].name = newName
  } else {
    var type = 'Symbol',
        name = newName || libraryItem.name,
        duplicated = this.duplicateItem(libraryItem);  
  }
  KT.Verbose('Timeline duplicated: ' + (name) + ' ' + (type))
  return duplicated
};


function editTimeline(timeline) {
  KT.Verbose(arguments);

  var timeline = getTimeline(timeline),
      name = timeline.name,
      i = 0,
      len,
      scenes;
  if(timeline.libraryItem != null) {
    KT.Library().editItem(timeline.libraryItem.name)
  } else {
    scenes = KT.Document().timelines;
    len = scenes.len;
    for(; i < len; i++) {
      if(scenes[i].name === name) {
        break;
      }
    }

    KT.Document().editScene(i);
  }
};


/**Filter the symbols in the library by name and perform a callback on them
 * @function filterSymbols
 * @memberof KT.Document
 * @param {String|String[]|RegExp} name The name or names of the symbols
 * @returns An array with the filtered symbols
*/
function filterSymbols(name, callback) {
  KT.Verbose(arguments);

  var name = name && name != '' ? KT.RegExp(name): name,
      values = [],
      callbackIsFunction = _.isFunction(callback),
      match,
      result;

  if(!callbackIsFunction) {
    return values
  }
  this.walkSymbols (function(item, i, items) {
    match = item.name.match(name);
    if(match) {
      result = callback(item, i, items);
      values.push(result)
    }
  })
  return values
};


/**Gets a timeline from a name or symbol
 * @function getTimeline
 * @memberof KT.Document
 * @param {Timeline|String|String[]|Symbol|RexExp|Number} timelineOrSymbol Any of the types. If Number, gets a scene timeline.
 * @returns THe timeline. If no matches, returns the current document timeline
 */
function getTimeline(timeline) {
  KT.Verbose(arguments);

  if(timeline instanceof Timeline) return timeline
  var timeline = typeof timeline === 'number' ? document.timelines[timeline] 
    : typeof timeline === 'string' ? KT.Library.get(timelineOrSymbol)
    : timeline instanceof SymbolItem ?  timeline.timeline
    : timeline instanceof Timeline ? timeline
    : document.getTimeline();
  return timeline
};


/**Gets a timeline from a name or symbol
 * @function getTimeline
 * @memberof KT.Document
 * @param {Timeline|String|String[]|Symbol|RexExp|Number} timelineOrSymbol Any of the types. If Number, gets a scene timeline.
 * @returns THe timeline. If no matches, returns the current document timeline
 */
function getTimeline(timeline) {
  KT.Verbose(arguments);

  if(timeline instanceof Timeline) return timeline;
  var timeline = _.isNumber(timeline) ? document.timelines[timeline] 
                : _.isString(timeline) ? KT.Library.get(timeline).timeline 
                : timeline instanceof SymbolItem ?  timeline.timeline 
                : timeline instanceof SymbolInstance ? timeline.libraryItem.timeline
                : document.getTimeline();
  var timelineType = !timeline.libraryItem ? 'scene' : 'symbol';
  // KT.Verbose('Collector.walkLayers: timeline',  'Inside :' + (timeline.name) + '->' + (timelineType) )

  return timeline
};

function openLibraryItem(itemName) {
  KT.Verbose(arguments);

  var item = KT.Document.getLibraryItem(itemName)
  KT.Library().editItem(item.name)
  return item
};


/**Removes the current scene or all the escenes that contain the filter
 * @function removeScenes
 * @memberof KT.Document
 * @param {String|RegExp|} filter The filter name of the scenes to remove
*/
function removeScenes(filter) {
  KT.Verbose(arguments);

  var timelines = document.timelines,
      length = timelines.length -1,
      filter,
      removedScener,
      timeline,
      timelineName,
      remove,
      sceneDeleted,
      i;

  if(!filter) {
    document.editScene( document.currentTimeline );
    document.deleteScene()
    document.currentTimeline = document.currentTimeline == -1 ? 0: document.currentTimeline
    return
  }

  filter = KT.RegExp(filter)
  
  length = document.timelines.length - 1;
  removedScenes = 0;
  for(i = length; i >= 0; i--) {
    timeline = timelines[i];
    timelineName = timeline.name
    remove = timelineName.match(filter);
    
    if(remove) {
      document.editScene(i);
      sceneDeleted = document.deleteScene();
      removedScenes ++
      KT.Verbose('Scene: ' (timelineName),  'REMOVED: '  + sceneDeleted, 'I: ' + i);
    }
  }
  return
};


//===============================================================
//MODULE DEFINITION


/** Get the working document
 * @function Document
 * @memberof KT
 * @returns {Document} - The current Flash document.
 */
KT.Document =  function() {
  return an.getDocumentDOM()
}

/** Class to make easier to do things with document and symbols. 
 * @namespace
 * @static
 * @name Document
 * @memberof KT
 */
KT.Document.createSymbolFromLayers = createSymbolFromLayers;
KT.Document.createSymbolFromSelectedLayers = createSymbolFromSelectedLayers;
KT.Document.closeLibraryItem = closeLibraryItem;
KT.Document.duplicateTimeline = duplicateTimeline;
KT.Document.editTimeline = editTimeline;
KT.Document.filterSymbols = filterSymbols;
KT.Document.getTimeline = getTimeline;
KT.Document.openLibraryItem = openLibraryItem;
KT.Document.removeScenes = removeScenes;

})();