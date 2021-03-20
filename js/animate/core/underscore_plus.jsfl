(function() {
function isMaskLayer(source) {
  return source.layerType === 'mask'
}

function isGuideLayer(source) {
  return source.layerType === 'guide'
}
function isFolderLayer(source) {
  return source.layerType === 'folder'
}

function isGroupLayer(source) {
  return isFolderLayer(source) || isGuideLayer(source) || isMaskLayer(source)
}

_.mixin({
  isFolderLayer: isFolderLayer,
  isGroupLayer: isGroupLayer,
  isGuideLayer: isGuideLayer,
  isMaskLayer: isMaskLayer
})


})();