(function(){
  var debug = KT.System.Options.debug.components;

  var Component = function(params) {
    var id = params.id,
        source = params.source,
        instance = params.instance || source,
        timeline = params.timeline,
        type = params.type || 'Component';
    this.id = id;
    this.type = type;
    this.data = {
      position: [],
      anchor: [],
      rotation: [],
      size: [],
      scale: []
    };
    
    
    this.components = [];
    
    this.getId =  function() { return id };
    this.getSource = function() { return source };
    this.getTimeline = function() { return timeline };
    this.getInstance = function() { return instance};
    this.getChildrenLength = function() {return 0}
    this.setSource = function(newSource) { source = newSource };
    this.setInstance = function(newInstance) { instance = newInstance};
  };

  function inspect( exportAsset) {
    KT.Interface.implements(this, KT.Interfaces.Component, KT.Interfaces.Exportable)
    this.getData();
    this.addChildren();
    if(exportAsset) {
      this.export()
    }
    for (var i = 0, len = components.length; i < len; i++) {
      this.components[i].inspect(exportAsset);
    }   
  };


  function exportAsset() {
   
  }

  function algorithm() {
    var algorithmID = arguments[0],
        alg = KT.Algorithm(algorithmID),
        deep = typeof arguments[1] === 'boolean' ? arguments[1] : true,
        rest = Array.prototype.slice.call(arguments, 2),
        child;
    if(deep === true) {
      for(var i = 0, len = this.components.length; i < len; i++) {
        child = this.components[i];
        child.algorithm.apply(child, arguments);
      }
    }
    
    if(_.isFunction(alg)) {
      
      if(_.isFunction(alg[this.type])){
        alg[this.type].apply(this, rest)
      } else {
        alg.default.apply(this, rest);
      }
    }

  }


  function isLeaf(source) {
    var isLeaf = KT.Tags.check('leafs', source);
    return isLeaf;
  }


  Component.prototype = {
    inspect: function(exportAsset) {
      inspect.call(this, exportAsset);
    },
    addChild: function(child) {
      if(!child) return
      if(debug.strict === true) {
        KT.Interface.implements(child, KT.Interfaces.Component, KT.Interfaces.Exportable);
      }
      this.components.push(child);
    },
    export: function() {
      exportAsset.call(this)
    },
    isLeaf: function(source) {
      return isLeaf(source)
    },
    algorithm: function() {
 
      algorithm.apply(this, arguments)
    },

    hasSymbols: function() {
      var i = 0,
          len = this.components.length,
          hasSymbols = false;
  
      for(; i < len; i++) {
        
        if(hasSymbols === true) break;
        hasSymbols = this.components[i].type === 'Symbol';
      }
     
      return hasSymbols
    },
    removeChildren: function() {
      this.components = []
    },
    printData: function(store){
      var store = store || {},
          i = 0,
          len = this.components.length;
      store.type = this.type;
      store.id = this.getId();
      store.isDataLayer = this.isDataLayer || false;
      store.data = this.data;
      if(this.isMask) {store.isMask = true}
      if(this.isGuide) {store.isGuide = true}
      if(this.isFolder) {store.isFolder = true}
      store.components = [];
      
      // KT.Debug(this.getId() + ': ' + len)
      for(; i < len; i++){
       
        store.components.push(this.components[i].printData());
      }
      return store
    }
 
  }

  KT.Components.Component = Component;


})();