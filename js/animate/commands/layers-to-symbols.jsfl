(function() {

  function selectedLayersToSymbols( replace, type, path) {
    var timeline = KT.Document.getTimeline(),
        replace = _.isBoolean(replace) ? replace : false,
        path = path || '',
        layers = KT.Layers.getSelected(timeline);
    
    if(layers.length <= 0) return;
      
    KT.Layers({
      timeline: timeline,
      layers: layers,
      do: function(layer) {
        timeline.setSelectedLayers(layer.index, true)
        KT.Document.createSymbolFromLayers( {
          timeline: timeline,
          type: type,
          layers: layer,
          replace: replace,
          name: layer.name
        })
      }
    })
  };

  KT.Commands.selectedLayersToSymbols = selectedLayersToSymbols
})();