/** An static object containing diferent funtions to collect and export a character rig
 * @namespace Collector
 * @memberof KT
 * @static
 * @todo - Move utility functions to their own utils library
 */


KT.Collector = new function(){
  //Initial setup
  var document = an.getDocumentDOM();
  var characterName = document.name.replace('.fla', '');
  var library = document.library;
  var savePath = document.pathURI;
  var driveUnit = savePath.split('///')[1].split('|')[0] + ':';
  var ktExtension = '.kts';
  var exportFolderName = 'PNG'
  var exportExtension = '.png'
  var exportPath = savePath.split('/');

  exportPath.pop();
  exportPath = exportPath.join('/') + '/' + exportFolderName;
  if(!FLfile.exists(exportPath)) {
    FLfile.createFolder(exportPath)
  }
  exportPath += '/';

  /** Creates a backup symbol due to Flash little imprecisions with transform numbers numbers
   * @function createBackupSymbol
   * @memberof KT.Collector
   * @param {String} - The name of the symbol to duplicate. Starts at the character name folder level.
   * @returns - The backup name of the symbol, tha is the originalName + '_backup'
   */
  this.createBackupSymbol = function(name) {
    var backupName = name + '_backup'
    var symbol = this.getSymbol(name);
    library.duplicateItem()
    library.renameItem(backupName);
    return backupName
  }

  /**Main function to collect and export all character assets. Execution order
   *    1- Create backups of the body_front and the head_front symbols.
   *    2- Create a character data object (only structure).
   *    3- Collect every part data and export single image footage parts.
   *    4- Remove head_front and body_fron backup symbols.
   *    5- Export animated sequences and collect their timing and poses layers(if exists).
   *    6- Collect and export the mouth parts.
   *    7- Save the danta into a file.
   * 
   * @function collectCharacterData
   * @memberof KT.Collector
   */
  this.collectCharacterData = function(){
    var headSymbol = this.createBackupSymbol('head_front');
    var bodySymbol = this.createBackupSymbol('body_front');
    var headLayers = this.getSymbolLayers(headSymbol);
    var bodyLayers = this.getSymbolLayers(bodySymbol);
    var mainLayers = document.timelines[0].layers;
    var characterData = {
      base: {},
      body: {},
      head: {},
    };

    //Collect Data
    this.collectSymbolData(mainLayers, characterData, false);
    this.collectSymbolData(bodyLayers, characterData.body, false, ['hand_L', 'hand_R', 'foot_L', 'foot_R']);
    this.collectSymbolData(headLayers, characterData.head, false, ['mouth', 'eye_lid_L', 'eye_lid_R']);
    this.collectMainData(characterData.base)
    an.trace(JSON.stringify(characterData, null, 2))
    characterData.head.center = characterData.head.skull.position;
    characterData.body.center = characterData.body.neck.position;

    //Remove Backups
    this.removeSymbol(headSymbol)
    this.removeSymbol(bodySymbol)
    
    //Export sequences
    this.exportAnimatedSequence('eye_lid_L', characterData.head.eye_lid_L, this.getSymbol('head/eye_lid_L'), true);
    this.exportAnimatedSequence('eye_lid_R', characterData.head.eye_lid_R, this.getSymbol('head/eye_lid_R'),true);
    this.exportAnimatedSequence('hand_L', characterData.body.hand_L, this.getSymbol('body/hand_L'),true);
    this.exportAnimatedSequence('hand_R', characterData.body.hand_R, this.getSymbol('body/hand_R'),true);
    this.exportAnimatedSequence('foot_L', characterData.body.foot_L, this.getSymbol('body/foot_L'),true);
    this.exportAnimatedSequence('foot_R', characterData.body.foot_R, this.getSymbol('body/foot_R'),true);
    
    //Export the mouth
    this.exportMouth(characterData.head);

    //Save data
    var stringData = JSON.stringify(characterData, null, 2);
    var fileName = exportPath + characterName.replace(/\s/g, '_') + '(export_data).json'
    FLfile.write(fileName, stringData);
  }

  /** Collects transform layer data: position, rotation and anchor points, and return it in an object
   * @function collectLayerData
   * @memberof KT.Collector
   * @param {Layer} layer - The layer to analyze
   * @return - An object containing position, rotation, anchorPoint and path members(path refers to the export path)
  */
  this.collectLayerData = function (layer) {
    var data = {};
    var name = layer.name;
    var frame = layer.frames[0];
    var element = frame.elements[0];

    // data.extension = exportExtension;
    data.position = [
      element.transformX,
      element.transformY];
    data.rotation = element.rotation;
    data.anchorPoint = this.getAnchorPoint(element);
    return data
  }

  this.collectMainData = function(data){
    var layers = document.timelines[0].layers;
    var headLayer = this.getByName(layers, 'head');
    var bodyLayer = this.getByName(layers, 'body');
    data.head = this.collectLayerData(headLayer);
    data.body = this.collectLayerData(bodyLayer);
  }

  /** Collects symbol part layers data end exports the footage(*optional). Skips guide, mask and folder layers.
   *  Layers must have only one element in them and that element must be a simbol instance, if not, those layers are skipped
   * @function collectSymbolData
   * @memberof KT.Collector
   * @param {Layer[]}   layers - The layers of the symbol. The layers must have only one element and it must be a symbol instance.
   * @param {Object}    data - An object to store layers data. Each layer is stored as a property with the layer name as member name.
   * @param {Boolean}   [exportSeq] - If true, the symbols are exported as footage.
   * @param {String[]}  [skips] - An array containing the names of the layers that are not going to be exported.
   * @returns - The data object.
  */
  this.collectSymbolData = function(layers, data, exportSeq, skips) {
    var layer, name, element;
    var skips = (skips)? new RegExp(skips.join('|')) : null;
    var skip = false;

    for(var i = 0, l = layers.length; i < l; i++ ) {
      if(layers[i].layerType == 'guide'
      || layers[i].layerType == 'mask'
      || layers[i].layerType == 'folder') {
        continue
      }
      layer = layers[i];
      element = layer.frames[0].elements[0];
      name = layer.name;

      if(!(element instanceof SymbolInstance)) { continue }

      data[name] = {}
      data[name].transformData = this.collectLayerData(layer);
      name.replace(skips, function(match){ skip = match == name});
      if(!skip && exportSeq) {
        data[name].path =  exportPath + name + exportExtension;
        this.exportSequence(element.libraryItem, data[name].path, 0, 0);
        data[name].assetType = 'still'
        data[name].path = data[name].path.replace(/file\:\/\/\/.*\|/, driveUnit)
      }
      skip = false
    }
    return data
  }

  /**Collects a layer keyframes and his names into an Array
   * @function collectLayerTiming
   * @memberof KT.Collector
   * @param {Layer} layer - The layer to collect
   * @returns - An Array containinig objects with frame and label properties.
   */
  this.collectLayerTiming = function(dataLayer) {
    var frame;
    var data = []
    var frames = dataLayer.frames;
    for(var i = 0, l = frames.length; i < l; i++) {
      frame = frames[i];
      if(i == frame.startFrame) {
        data.push({
          frame: i,
          label: frame.name
        })
      }
    }
    return data
  }

  /** Exports an animated symbol to sequence and gets his timing layers: data and poses. 
   * @function exportAnimatedSequence
   * @memberof KT.Collector
   * @param {String}    name - The single name of the symbol to export.
   * @param {String}    set - The set to which the symbol belongs: nody or head.
   * @param {Object}    data - An object to store the timing and path data.
   * @param {Boolean}   [cleanExport] - If true, the old folder containing the sequence is deleted from the disk, and new empty one is created.
   * @param {Boolean}   [exportName] - The name of the file to be exported. If is not provided, name param is used.
  */
  this.exportAnimatedSequence = function(name, data, symbol, cleanExport, exportName) {
    var exportName = exportName || name
    var path = exportPath + exportName + ktExtension;;
    var symbolLayers = symbol.timeline.layers;
    var dataLayer = this.getByName(symbolLayers, 'data');
    var posesLayer = this.getByName(symbolLayers, 'poses');
    data.timing = (dataLayer != null) ?  this.collectLayerTiming(dataLayer) : null;
    data.poses = (posesLayer != null) ? this.collectLayerTiming(posesLayer): null; 
    data.assetType = 'sequence';
    if(cleanExport) {
      if(FLfile.exists(path)) {
        FLfile.remove(path)
      }
    }
    if(!FLfile.exists(path)) {
      FLfile.createFolder(path);
    }
    path += '/'
    data.path = path + exportName + exportExtension;
  
    this.exportSequence(symbol, data.path);
    data.path = data.path.replace(/file\:\/\/\/.*\|/, driveUnit)
  }

  /** Because the mouth has an special construction, it must have its own export method.
   *  This method generates a backup symbol of the mouth, collects the layers data and exports the
   *  symbol several times, one per mouth part, switching on and off layers visibility.
   * @function exportMouth
   * @memberof KT.Collector
   * @param {Object} data - An objet where to store the mouth data.
   */
  this.exportMouth = function(data) {
    var backupMouth = this.createBackupSymbol('head/mouth')
    var symbol = this.getSymbol('head/' + backupMouth);
    var layers = symbol.timeline.layers;
    var _self = this;
    this.switchLayers(layers, 'visible', false);
    this.switchLayers(layers, 'outline', false);
    this.switchLayers(layers, 'locked', true);

    function exportMouthParts(part, exportName) {
      var exportName = exportName || part;
      var layer = _self.getByName(layers, part)
      an.trace(layer.name)
      an.trace('    before-->' + layer.visible);
      layer.visible = true;
      an.trace('    start-->' + layer.visible);

      // _self.switchLayersByName(layers, 'visible', true, [part]);
      data.mouth[part] = {};
      data.mouth[part].transformData = _self.collectLayerData(layer);
      _self.exportAnimatedSequence(part, data.mouth[part], symbol, true, exportName);
      // _self.switchLayersByName(layers, 'visible', false, [part]);
      layer.visible = false;
      an.trace('    after-->' + layer.visible);
    }

    this.removeSymbol('head/' + backupMouth)
    exportMouthParts('teeth_upr', 'teeth_upr');
    exportMouthParts('teeth_lwr', 'teeth_lwr');
    exportMouthParts('mt', 'mt');
    exportMouthParts('bell', 'mt_bell');
    exportMouthParts('back', 'mt_back');
  }

  /**Wrapper function to export an SWF or a PNG sequence, depending on Colector's private variable exportExtension
   * @function exportSequence
   * @memberof KT.Collector
   * @param {Item}    item - The library item to export.
   * @param {String}  path - The path where to export the sequence.
   * @param {Number}  [start] - The starting sequence frame(For .png only).
   * @param {Number}  [end] - The end sequence frame(For .png only)
   */
  this.exportSequence = function(item, path, start, end) {
    if(exportExtension == '.swf') {
      item.exportSWF(path)
    } else if (exportExtension == '.png') {
      if(!start && !end) {
        item.exportToPNGSequence(path);
      } else if(!start) {
        item.exportToPNGSequence(path, 0, end);
      } else if(!end) {
        item.exportToPNGSequence(path, start);
      } else {
        item.exportToPNGSequence(path, start, end)
      }
      
    }
  }

  /** Due to miterious flash API design, a function to get the relative transformation point of an object must be written.
   *  The element is moved to zero position and rotation, and the it gets it's transform position. Then, the element is placed
   *  back in his 'original0 transform state. (Original is quoted because the lack of precission with number dealing in flash, so 
   *  it's mandatory to duplicate the parent symbol to perform this operation).
   * @function getAnchorPoint
   * @memberof KT.Collector
   * @param {Element} element - The layer element.
   * @return - A vector containing the x and the y values.
   */
  this.getAnchorPoint = function(element) {
    var anchorPoint;
    var rotation = element.rotation;
    var x = element.transformX;
    var y = element.transformY;
    //Set element To zero position
    element.rotation -= element.rotation;
    element.x = 0;
    element.y = 0
    element.x -= element.width / 2 + element.left;
    element.y -= element.height / 2 + element.top;

    //retrieve Data
    
    anchorPoint = [element.transformX,  element.transformY]

    //Reset item transformations
    element.rotation = rotation;
    element.transformX = x;
    element.transformY = y;

    return anchorPoint
  }

  /**Gets an element from an array by its name property.
   * @function getByName
   * @memberof KT.Collector
   * @param {AnyObjectWithNameProperty[]} arr - The array to search.
   * @param {String} name - The name of the object to find.
   * @returns - The object if it's found.
   */
  this.getByName = function(arr, name) {
    for(var i = 0, l = arr.length; i < l; i++) {
      if(arr[i].name == name) {
        return arr[i]
      }
    }
  }

  /**Selects a symbol in the library and returns it 
   * @function getSymbol
   * @memberof KT.Collector
   * @param {String} path - The 'name' of the symbol.(Yes, the weird and ancient way that Adobe call the path of the symbol).
   * @return - The symbol if exists
  */
  this.getSymbol = function(path) {
    library.selectItem(characterName + '/' + path, true, true);
    var item = library.getSelectedItems()[0];
    return item
  }

  /**Selects a symbol in the library and retrieves it's layers 
   * @function getSymbolLayers
   * @memberof KT.Collector
   * @param {String} path - The 'name' of the symbol.(Yes, the weird and ancient way that Adobe call the path of the symbol).
   * @returns - The symbol layers i the symbos exists
  */
  this.getSymbolLayers = function(path) {
    library.selectItem(characterName + '/' + path, true, true);
    var item = library.getSelectedItems()[0];
  
    var layers = item.timeline.layers;
    library.selectItem(characterName + '/' + path, true, true);
    return layers
  }

  /**Selects and removes a library symbol
   * @function removeSymbol
   * @memberof KT.Collector
   * @param {String} path - The 'name' of the symbol.(Yes, the weird and ancient way that Adobe call the path of the symbol).
  */
  this.removeSymbol = function(name) {
    this.getSymbol(name);
    library.deleteItem();
  }

  /**By the moment nothing to do with this method 
   * @todo - Do something with this method
  */
  this.setFootageExportPath = function(path) {
    exportPath = browseForFolderURL();
  }

  /**Switch outline, locked or visible state of a layer in a layer set
   * @function switchLayers
   * @memberof KT.Collector
   * @param {Layer[]} layers - The array of layers to switch.
   * @param {String}  param - The param of the layer to switch. Normaly: outline, locked or visible.
   * @param {Any}     value - The switch value. Normaly a Boolean
   * @param {Boolean} skipAnormalLayers- If true, only switches normal layers.
  */
  this.switchLayers = function(layers, param, value, skipAnormalLayers) {
    an.trace(param + '-' + value + '-' )
    var skipAnormalLayers = skipAnormalLayers || false
    
    for(var i = 0, l = layers.length; i < l; i++) {
      var layer = layers[i];
      if(skipAnormalLayers &&
        (layers[i].layerType == 'guide'
        || layers[i].layerType == 'mask'
        || layers[i].layerType == 'folder')
        ) { continue }
      layer[param] = value
    }
  }

  /**Same as switchLayers but using layer name as extra filter.
   * @function switchLayers
   * @memberof KT.Collector
   * @param {Layer[]}   layers - The array of layers to switch.
   * @param {String}    param - The param of the layer to switch. Normaly: outline, locked or visible.
   * @param {Any}       value - The switch value. Normaly a Boolean.
   * @param {String[]}  names - The names of the layers to switch
   * @param {Boolean}   skipAnormalLayers- If true, only switches normal layers.
  */
  this.switchLayersByName = function(layers, param, value, names, skipAnormalLayers) {
    for(var i = 0, l = names.length; i < l; i++) {
      var layer = this.getByName(layers, names[i]);
      this.switchLayers([layer], param, value, skipAnormalLayers)
    }
  }
}