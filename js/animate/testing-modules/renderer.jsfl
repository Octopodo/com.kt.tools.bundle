/**
 * Object to render the assets inside aflash document
 * @namespace
 * @memberof KT
 * @instance
 */

KT.Renderer = new function(){
  var exportFootage = false;
  var exportPath = undefined;

  this.getExportFootage = function() {
    return exportFootage
  }

  this.getExportPath = function() {
    return exportPath
  }
  /** Sets if the collector has to export the footage
 * @function setExportFootage
 * @memberof KT.Collector
 * @param {Boolean} value 
 */
  this.setExportFootage = function(value) {
    if(value == undefined) { return }
    exportFootage = value;
    KT.Debug('Export Value: ', exportFootage)
  },

  /** Opens a folder dialiog and sets the collector export path. 
 * @function setExportPath
 * @memberof KT.Collector
 * @returns The selected folder URI in system format
 */
  this.setExportPath = function() {
    var path = an.browseForFolderURL('Select the export folder');
    exportPath = (path) ? path + '/' : exportPath
    KT.Debug('Export Path',FLfile.uriToPlatformPath(String(exportPath)))
    return FLfile.uriToPlatformPath(String(exportPath))
  }
    
}