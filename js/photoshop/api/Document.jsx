(function() {


function createDocument(params) {
  var params = params || {},
      name = _.isString(params.name) ? params.name : KT.Defaults.document.NAME,
      document;
  try{
    document = app.documents.getByName(name);

  } catch(e1) {
    var width = _.isInt(params.width) ? params.width : KT.Defaults.document.WIDTH,
        height = _.isInt(params.height) ? params.height : KT.Defaults.document.HEIGHT,
        resolution = _.isInRange(params.resolution, 4, 300) ? params.resolution : KT.Defaults.document.RESOLUTION,
        mode = params.mode || KT.Defaults.document.MODE,
        initialFill = params.initialFill,
        pixelAspectRatio = params.par || params.pixelAspect,
        bitsPerChanel = params.bitsPerChanel || params.bpc,
        colorProfileName = params.colorProfileName || params.colorProfile || params.cpn;

    try{
      document = app.documents.add(
        width, 
        height,
        resolution,
        name,
        mode,
        initialFill,
        pixelAspectRatio,
        bitsPerChanel,
        colorProfileName
      );
    } catch(e2) {
      var err = e2;
      $.bp()
    }
  }
  
  return document
}


function fitDocumentToLayers(document) {
  var document = KT.Document(document),
      layers = Array.prototype.slice.call(arguments, 1),
      bounds;
}


function importImageJs (path, document) {
  try{
    var file = path instanceof File ? path : new File(path);
        document = _.isDocument(document) ? document : KT.Document(),
        image = open(file);
        layer = image.artLayers[0].duplicate(document)
        image.close();
        return layer
  } catch (err) {}
}
function importImageAction(path) {
  var file = new File(path);
  if(!file) return
  var idPlc = charIDToTypeID( "Plc " );
  var desc24 = new ActionDescriptor();
  var idIdnt = charIDToTypeID( "Idnt" );
  desc24.putInteger( idIdnt, 4 );
  var idnull = charIDToTypeID( "null" );
  desc24.putPath( idnull, new File( path ) );
  var idFTcs = charIDToTypeID( "FTcs" );
  var idQCSt = charIDToTypeID( "QCSt" );
  var idQcsa = charIDToTypeID( "Qcsa" );
  desc24.putEnumerated( idFTcs, idQCSt, idQcsa );
  var idOfst = charIDToTypeID( "Ofst" );
  var desc25 = new ActionDescriptor();
  var idHrzn = charIDToTypeID( "Hrzn" );
  var idPxl = charIDToTypeID( "#Pxl" );
  desc25.putUnitDouble( idHrzn, idPxl, 0.000000 );
  var idVrtc = charIDToTypeID( "Vrtc" );
  var idPxl = charIDToTypeID( "#Pxl" );
  desc25.putUnitDouble( idVrtc, idPxl, 0.000000 );
  var idOfst = charIDToTypeID( "Ofst" );
  desc24.putObject( idOfst, idOfst, desc25 );
  executeAction( idPlc, desc24, DialogModes.NO );
  var layer = KT.Document().activeLayer;
  return layer
}

function Document() {
  var document = arguments[0];
  if (!document) {
    try {
      document = app.activeDocument;
      return document
    } catch (e) {
      return createDocument()
    }
  } else if(_.isString(document)) {
    try{
      document  = app.documents.getByName(document);
      return document;
    }catch (e) {
      // return createDocument({name: document});
    }
  }
  else if(document.typename === 'Document') {
    return document
  } else {
    return createDocument.apply(this, arguments)
  }
}

KT.Document = Document;

KT.Document.import = importImageAction;

})();
