(function(){

function DataNode (name){
  this.children= []
  this.id = "",
  this.name = name || ""
  this.data =  {
    isLeaf: false,
    // symbols: [],
    anchor: [],
    position: [],
    rotation: [],
    timing: [],
  }
}


/** An static object containing diferent funtions to collect and export a character rig
 * @namespace Collector
 * @memberof KT
 * @static
 * @todo - Move utility functions to their own utils library
 */

KT.Collector = {

  collecte: function(timeline, storage) {
    var timeline = timeline || KT.Document.getTimeline();
    var storage = storage || {}
    storage.timing = {}

    this.getLabels(timeline, function(data) {
      storage.timing[data.name] = data.frames
    })

    _.each(timeline.layers, function(layer) {

      var isEmpty = KT.Layer.isEmptyLayer(layer, timeline)
      if(isEmpty){return }
      var data = storage[layer.name] = {}
      data.isLeaf = KT.Collector.isLeaf(layer)
      data.timing = new KT.Frames(layer).getFrames(['elements', 'isKey', 'index'], function(frame) {
        return frame.isKey
      })
      data.symbols = [],
      data.children = []
      _.each(data.timing, function(frame, i) {
        var element = frame.elements[0];
        if(element instanceof Instance) {
          KT.Debug('Symbol', element.libraryItemv )
          data.symbols.push(element.libraryItem)
        }
        if(!data.isLeaf) {
          var child = {}
          child.name = layer.name + '/' + i
          data.children.push(child)
          KT.Collector.collect(frame.elements[0].libraryItem.timeline, child)
        }
      })
      
    })
  },


  collect: function(timeline, root) {
    var timeline = timeline || KT.Document.getTimeline();
    var root = root instanceof DataNode ? root : new DataNode('');

    root.id = timeline.lybraryItem ? timeline.libraryItem.name : 0;

    _.each(timeline.layers, function(layer) {
      var isEmpty = KT.Layer.isEmptyLayer(layer, timeline);
      if(isEmpty) {return}
      var node = new DataNode(layer.name);
      var data = node.data;
      root.children.push(node)
      data.isLeaf = KT.Collector.isLeaf(layer);
      data.timing = new KT.Frames(layer).getFrames(['isKey', 'index', 'elements'], function(frame) { return frame.isKey });
      data.symbols = _.chain(data.timing)
        .filter( function(frame) { return frame.elements[0] != null})
        .map(function(el) {
          var item = el.elements[0].libraryItem
          if(!item) {
            var wasLocked = layer.locked
            layer.locked = false;
            _.each(el.elements, function(element) {element.selected = true})
            // item = KT.document().convertToSymbol('graphic', '', 'center')
            // _.each(el.elements, function(element) {element.selected = false})
            // layer.locked = wasLocked
          }
          return item
        })

      KT.Debug(layer.name, data.symbols)
      // _.each(data.symbols, function(s) {
      //   KT.Debug('Symbol', s)
      // })
      return
      if(data.symbols)
      data.position = _.map(data.symbols, function(symbol) {return KT.Element.getPosition(symbol)})
      data.rotation = _.map(data.symbols, function(symbol) {return KT.Element.getRotation(symbol)})
      data.anchor = _.map(data.symbols, function(symbol) {return KT.Element.getAnchorPoint(symbol)})
      
      _.each(data.symbols, function(symbol) {
        var name = symbol.libraryItem ? symbol.libraryItem.name : ''
        var child = new DataNode(name);
        if(name != '') {
          KT.Collector.collect(symbol.libraryItem.timeline, child)
        }
      })

    })
    return root
  },

  getLabels: function(layerOrSymbol, callback){
    var callback = KT.isFunction(callback) ? callback : function(){ return }
    var layers = layerOrSymbol instanceof Layer ? [layerOrTimeline] : layerOrSymbol
    layers = layers instanceof Instance ? layers.libraryItem.timeline.layers : layers;
    layers = layers instanceof SymbolItem ? layers.timeline.layers : layers;
    layers = layers instanceof Timeline ? layers.layers : layers
    _.each(layers, function(layer,i) {
      
      var isDataLayer = layer.name.match(KT.Options.dataLayers);

      if(isDataLayer) {
        var data = {
          name: layer.name,
          frames: new KT.Frames(layer).getFrames(['isKey', 'name', 'index'], function(frame) {return frame.isKey})
        }
        callback(data)
      }
    })

  },

  getTransformData: function(frame) {
    var frame = typeof frame === 'number' ? frames[frame] : frame
    
    var elements = frame.elements;
    var x = [];
    var y = [];
    var width, height, xmin, xmax, ymin, ymax = 0;
    _.each(elements, function(item) {
      var bottom = item.top + item.height
      var right = item.left + item.width

      x.push(item.left); x.push(right)
      y.push(item.top); y.push(bottom)
    })

    xmin = Math.min.apply(this,x)
    xmax = Math.max.apply(this,x)
    ymin = Math.min.apply(this,y)
    ymax = Math.max.apply(this,y)
    x = (xmin + xmax) / 2
    y= (ymin + ymax) / 2
    width =  xmax - xmin;
    height = ymax - ymin;    
    return {
      x: x,
      y: y,
      width: width,
      height: height
    }
  },


  isLeaf: function(layer) {
    var isLeaf = true;

    _.each(layer.frames, function(frame){
      isLeaf = !KT.Options.leafs.test(frame.name) || frame.elements.length < 1
      if (!isLeaf) {return}
      _.each(frame.elements, function(element) {
        isLeaf = !(element.libraryItem instanceof SymbolItem)
        if(!isLeaf) {return}
      })
    })
    return isLeaf
    
  }




}

})()






