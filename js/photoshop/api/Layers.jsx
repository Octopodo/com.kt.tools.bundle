(function(){
function getLayers(params) {
  var names = _.isString(params) ? params : params.name || params.names,
      names = _.toRegExp(names),
      document = KT.Document(),
      params = params || {},
      source = _.isDocument(params.source) || _.isFolder(params.source) ? params.source :  document, 
      callback = _.toCallback(params.$do),
      condition = _.toCondition(params.check),
      layerCheckers = KT.TypeChecker(LayerCheckers).filter(params),
      pass = true,
      selectedLayers = [],
      checker;

  traverseLayers(source, function(layer, i) {
    pass = layerCheckers.check(layer);
    pass = !_.isNull(names) ? !_.isNull(layer.name.match(names)) : pass;
    pass = pass && condition(layer, i);
    if(pass === true) {
      callback(layer, i);
      selectedLayers.push(layer)
    }
  })  
  
  return selectedLayers
}


function traverseLayers(parent, callback) {
  var parent = parent || KT.Document(),
      sets = parent.layerSets,
      layers = parent.artLayers;
  
  _.each(layers, function(layer, i) {
    callback(layer, i)
  });
  _.each(sets, function(set, i) {
    callback(set, i);
    traverseLayers(set, callback)
  })
}


function addParent(parent) {
  var layers = _.flatten(Array.prototype.slice.call(arguments, 1));
}


function rotateLayer(layer, angle, pivot){
  if(angle == 0) { return }
  rotateLayerAction(layer, angle, pivot);
}

function setPosition(position, origin) {
  var layers = _.flatten(Array.prototype.slice.call(arguments, 2)),
      position = position || {x: 0, y:0},
      origin = origin || {x: 0, y: 0},
      x, y,
      bounds,
      document;


  _.each(layers, function(layer) {
    var bounds = getBounds(layer),
        x = position.x || bounds.x,
        y = position.y || bounds.y;

    x = position.x - bounds.x + origin.x;
    y = position.y - bounds.y + origin.y;
    
    translateLayerAction(layer, {x: x, y: y})
  })
  return layers
}

/**
* @todo - Deal with the case if the parent is a child of the layer
*/
function setParent(parent) {
  var parent,
      document = KT.Document()
  if(_.isString(parent)) {
    var parentName = parent;
    
    parent = KT.Layers({name: parentName, folders: true});
    parent = parent.length > 0 ? parent[0] : document.layerSets.add();
    parent.name = parentName;

  } else {
    parent = _.isDocument(parent) || _.isFolder(parent) ?  parent : document;
  }

  if(parent.typename != 'LayerSet' && !_.isString(parent)) return;
  var layers = _.flatten(Array.prototype.slice.call(arguments, 1));

  _.each(layers, function(layer) {
      moveLayerInside(parent, layer)

    
  })
}


function getLayerDocument(layer) {
  if(!_.isLayer(layer) && !_.isFolder(layer)) {return ''}
  var document = traverseToRoot(layer);
  return document
}



function getLayerPath(layer) {
  if(!_.isLayer(layer) && !_.isFolder(layer)) {return ''}
  var path = [layer.name];

  traverseToRoot(layer, function(parent) {
    path.unshift(parent.name)
  })

  path = path.join(KT.Defaults.path.SEPARATOR);
  return path
}


function getBounds (layer) {
  if(!_.isLayer(layer) && !_.isFolder(layer)) {return ''}
  var bounds = layer.bounds,
      data = {
        left: bounds[0].value,
        top: bounds[1].value,
        right: bounds[2].value,
        bottom: bounds[3].value,
      };
  
  data.width = data.right - data.left;
  data.height = data.bottom - data.top;
  data.x = Math.round(data.left + data.width / 2);
  data.y = Math.round(data.top + data.height / 2);
  return data;
}


function traverseToRoot(layer, callback) {
  if(!_.isLayer(layer) && !_.isFolder(layer)) return; 
  var parent = layer.parent,
      callback = _.toCallback(callback);

  while(!_.isDocument(parent)) {
    callback(parent);
    parent = parent.parent
  }
  return parent
} 


function closeFolderAction(folder) {
  if(!_.isFolder(folder)) return;
  
}

function translateLayerAction(layer, position) {
  if(_.isEmptyLayer(layer)) return;
  var x = _.isNumber(position.x) ? position.x : 0,
      y = _.isNumber(position.y) ? position.y : 0;
    KT.Document().activeLayer = layer;

    var idmove = charIDToTypeID( "move" );
    var desc105 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref75 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref75.putEnumerated( idLyr, idOrdn, idTrgt );
    desc105.putReference( idnull, ref75 );
    var idT = charIDToTypeID( "T   " );
        var desc106 = new ActionDescriptor();
        var idHrzn = charIDToTypeID( "Hrzn" );
        var idPxl = charIDToTypeID( "#Pxl" );
        desc106.putUnitDouble( idHrzn, idPxl, x );
        var idVrtc = charIDToTypeID( "Vrtc" );
        var idPxl = charIDToTypeID( "#Pxl" );
        desc106.putUnitDouble( idVrtc, idPxl, y );
    var idOfst = charIDToTypeID( "Ofst" );
    desc105.putObject( idT, idOfst, desc106 );
  executeAction( idmove, desc105, DialogModes.NO );
}

function rotateLayerAction(layer, angle, pivot) {
  if(_.isEmptyLayer(layer)) return;
  if(angle === 0) return;
  var angle = angle,
      pivot = pivot || {x: 0, y: 0},
      rad = angle * (Math.PI/180),
      c = Math.cos(rad),
      s = Math.sin(rad),
      offset = {
        x: (pivot.x * c - pivot.y * s) - pivot.x,
        y: (pivot.x * s + pivot.y * c) - pivot.y
      };

    KT.Document().activeLayer = layer;
  var idTrnf = charIDToTypeID( "Trnf" );
    var desc124 = new ActionDescriptor();
    var idFTcs = charIDToTypeID( "FTcs" );
    var idQCSt = charIDToTypeID( "QCSt" );
    var idQcsa = charIDToTypeID( "Qcsa" );
    desc124.putEnumerated( idFTcs, idQCSt, idQcsa );
    var idOfst = charIDToTypeID( "Ofst" );
        var desc125 = new ActionDescriptor();
        var idHrzn = charIDToTypeID( "Hrzn" );
        var idPxl = charIDToTypeID( "#Pxl" );
        desc125.putUnitDouble( idHrzn, idPxl, offset.x);
        var idVrtc = charIDToTypeID( "Vrtc" );
        var idPxl = charIDToTypeID( "#Pxl" );
        desc125.putUnitDouble( idVrtc, idPxl, offset.y);
    var idOfst = charIDToTypeID( "Ofst" );
    desc124.putObject( idOfst, idOfst, desc125 );
    var idAngl = charIDToTypeID( "Angl" );
    var idAng = charIDToTypeID( "#Ang" );
    desc124.putUnitDouble( idAngl, idAng, angle );
  executeAction( idTrnf, desc124, DialogModes.NO );
}

function resizeLayerAction(layer, size) {
  if(_.isEmptyLayer(layer)) return;
  var width = _.isNumber(size.width) ? size.width : 0,
      height = _.isNumber(size.height) ? size.height : 0;

  KT.Document().activeLayer = layer;
  var idTrnf = charIDToTypeID( "Trnf" );
    var desc361 = new ActionDescriptor();
    var idFTcs = charIDToTypeID( "FTcs" );
    var idQCSt = charIDToTypeID( "QCSt" );
    var idQcsa = charIDToTypeID( "Qcsa" );
    desc361.putEnumerated( idFTcs, idQCSt, idQcsa );
    var idOfst = charIDToTypeID( "Ofst" );
        var desc362 = new ActionDescriptor();
        var idHrzn = charIDToTypeID( "Hrzn" );
        var idPxl = charIDToTypeID( "#Pxl" );
        desc362.putUnitDouble( idHrzn, idPxl, 0 );
        var idVrtc = charIDToTypeID( "Vrtc" );
        var idPxl = charIDToTypeID( "#Pxl" );
        desc362.putUnitDouble( idVrtc, idPxl, 0);
    var idOfst = charIDToTypeID( "Ofst" );
    desc361.putObject( idOfst, idOfst, desc362 );
    var idWdth = charIDToTypeID( "Wdth" );
    var idPrc = charIDToTypeID( "#Prc" );
    desc361.putUnitDouble( idWdth, idPrc, width );
    var idHght = charIDToTypeID( "Hght" );
    var idPrc = charIDToTypeID( "#Prc" );
    desc361.putUnitDouble( idHght, idPrc, height );
  executeAction( idTrnf, desc361, DialogModes.NO );
}

function moveLayerInside(parent, layer) {
  if(!layer || !parent || !_.isFolder(parent)|| parent === layer) return;
  var parentIndex = parent.itemIndex - 1,
      layerID = layer.id;
  var idmove = charIDToTypeID( "move" );
    var desc4 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref4 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref4.putEnumerated( idLyr, idOrdn, idTrgt );
    desc4.putReference( idnull, ref4 );
    var idT = charIDToTypeID( "T   " );
        var ref5 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        ref5.putIndex( idLyr, parentIndex ); //// Parent Layer
    desc4.putReference( idT, ref5 );
    var idAdjs = charIDToTypeID( "Adjs" );
    desc4.putBoolean( idAdjs, false );
    var idVrsn = charIDToTypeID( "Vrsn" );
    desc4.putInteger( idVrsn, 5 );
    var idLyrI = charIDToTypeID( "LyrI" );
        var list2 = new ActionList();
        list2.putInteger( layerID );
    desc4.putList( idLyrI, list2 );
  executeAction( idmove, desc4, DialogModes.NO );
}

function rasterizeLayerAction(layer) {
    if(!_.isLayer(layer)) return;
    selectLayer(layer);

  var idrasterizeLayer = stringIDToTypeID( "rasterizeLayer" );
      var desc15 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref1 = new ActionReference();
          var idLyr = charIDToTypeID( "Lyr " );
          var idOrdn = charIDToTypeID( "Ordn" );
          var idTrgt = charIDToTypeID( "Trgt" );
          ref1.putEnumerated( idLyr, idOrdn, idTrgt );
      desc15.putReference( idnull, ref1 );
  executeAction( idrasterizeLayer, desc15, DialogModes.NO );
  var stop = 0
}


function selectLayer(layer) {
  if(!_.isLayer(layer) && !_.isFolder(layer)) return;
  var layerID = layer.id,
      layerName = layer.name;
// =======================================================
var idslct = charIDToTypeID( "slct" );
    var desc24 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref7 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        ref7.putName( idLyr, layerName );
    desc24.putReference( idnull, ref7 );
    var idMkVs = charIDToTypeID( "MkVs" );
    desc24.putBoolean( idMkVs, false );
    var idLyrI = charIDToTypeID( "LyrI" );
        var list3 = new ActionList();
        list3.putInteger( layerID );
    desc24.putList( idLyrI, list3 );
executeAction( idslct, desc24, DialogModes.NO );
}

var LayerCheckers = {
  folders: _.isFolder,
  layers: _.isLayer
}

function Layers() {

}



Layers.prototype = {
  init: function(params){
    return getLayers(params)
  },
  setParent: function(parent) {
    return setParent(parent, this)
  },
  setPosition: function(position) {
    return setPosition(position, this)
  }
}

KT.Layers = KT.ExtendArray(Layers);

KT.Layers.traverse = traverseLayers;
KT.Layers.traverseToRoot = traverseToRoot;
KT.Layers.getBounds = getBounds;
KT.Layers.getDocument = getLayerDocument;
KT.Layers.getPath = getLayerPath;
KT.Layers.setParent = setParent;
KT.Layers.setPosition = setPosition;
KT.Layers.select = selectLayer;
KT.Layers.rasterize = rasterizeLayerAction;
KT.Layers.resize = resizeLayerAction;
// KT.Layers.rotate = rotateLayer;
// KT.Layers.moveLayerInside = moveLayerInside;
// KT.Layers.moveLayerAction = moveLayerAction;
KT.Layers.rotate = rotateLayerAction;

})();





// var idmove = charIDToTypeID( "move" );
//     var desc105 = new ActionDescriptor();
//     var idnull = charIDToTypeID( "null" );
//         var ref75 = new ActionReference();
//         var idLyr = charIDToTypeID( "Lyr " );
//         var idOrdn = charIDToTypeID( "Ordn" );
//         var idTrgt = charIDToTypeID( "Trgt" );
//         ref75.putEnumerated( idLyr, idOrdn, idTrgt );
//     desc105.putReference( idnull, ref75 );
//     var idT = charIDToTypeID( "T   " );
//         var desc106 = new ActionDescriptor();
//         var idHrzn = charIDToTypeID( "Hrzn" );
//         var idPxl = charIDToTypeID( "#Pxl" );
//         desc106.putUnitDouble( idHrzn, idPxl, 780.000000 );
//         var idVrtc = charIDToTypeID( "Vrtc" );
//         var idPxl = charIDToTypeID( "#Pxl" );
//         desc106.putUnitDouble( idVrtc, idPxl, 524.000000 );
//     var idOfst = charIDToTypeID( "Ofst" );
//     desc105.putObject( idT, idOfst, desc106 );
// executeAction( idmove, desc105, DialogModes.NO );


// =======================================================
