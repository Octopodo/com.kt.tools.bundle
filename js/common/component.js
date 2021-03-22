(function(){

function algorithm(){
  var algorithmID = arguments[0],
      alg = KT.Algorithm(algorithmID),
      fromRoot = _.isBoolean(arguments[1]) ? arguments[1] : false,
      rest = Array.prototype.slice.call(arguments, 2),
      i = fromRoot ? this.components.length - 1 : 0,
      len = fromRoot ? this.components.length  : 0,
      type;
  
  traverse(function(component) {
    type = component.get('type')
    if(_.isFunction(alg[type])){
      alg[type].apply(component, rest)
    } else {
      alg.default.apply(component, rest);
    }
  }, !fromRoot, this);
}

function traverse (predicate, fromLeafs, context) {
  var context = context ? context : this,
      predicate = _.toCallback(predicate),
      fromLeafs = _.isBoolean(fromLeafs) ? fromLeafs : false,
      components = context.components,
      i = fromLeafs ? 0 : components.length - 1,
      len = fromLeafs ?  components.length : 0,
      id = context.get('id'),
      result,
      child;
  if(components.length === 0) {
    predicate(context);
    return
  }

  !fromLeafs && predicate(context)
  
  for(; fromLeafs ? i < len : i >= len; fromLeafs ? i++ : i--) {
    child = context.components[i];
    child.traverse(predicate, fromLeafs);
  }
  fromLeafs && predicate(context);
  return result
}

function findChildren(predicate, store, context) {
  var store = _.isArray(store) ? store : [],
      predicate = _.toCondition(predicate),
      context = context ? context : this;
  
  traverse(function(child) {
    var found = predicate(child)
    if(found) {
      store.push(child)
    }
    if(child.components.length > 0) {
      child.traverse(predicate, store)
    }
  }, false, conext)
  return store
}

function findChildrenByName(){
  var names = _.isArray(arguments[0]) ? arguments[0] : _.flatten(Array.prototype.slice.call(arguments)),
      children = findChildren(function(child) {
        var found = _.find(names, function(name){
          return name === child.getId();
        })
        return found ? true : false
      })
  
  return children;
}

var Component = function(params) {
  var props = {
        id: params.id,
        source: params.source,
        type: params.type || "Component"
      }

  this.components = [];

  this.get = function(prop) { 
    if(arguments.length === 0) {
      return props
    } else {
      return props[prop];
    }
  }
  this.set = function(prop, value) { props[prop] = value }
  this.delete = function(prop) {
    if(props[prop]) {
      delete props[prop]
    }
  }
}


Component.prototype = {
  addChild: function(child) {
    if(!(child instanceof Component)) { return }
    this.components.push(child);
    return child
  },
  algorithm: function(){
    return algorithm.apply(this, arguments)
  },
  byName: function(){
    return findChildrenByName.apply(this, arguments)
  },
  find: function() {
    return findChildren.applt(this, arguments)
  },
  traverse: function(){
    return traverse.apply(this, arguments)
  }
}




KT.Components = {};
KT.Components.Component = Component;
})();