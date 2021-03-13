(function() {
  var AssetData = (function() {

    /**Retrive the data
     * @function get
     * @memberof KT.Components.AssetData
     * @static
     * @param {undefined=} -If no param, retrieve all the data.
     * @param {String=} -The name or names, coma separated, of the properties to retrieve.
     */
    function get() {
      var data = new KT.Components.AssetData(arguments[0]).__getDirect__(), //Create a new copy of the data
          output = {},
          i = 1,
          len = arguments.length,
          member;
      if(len === 0) return;
      if(len === 1) {                                                 //if no args, retrieve all the data.
        output =  data;
      }
      if(arguments.length === 2 && typeof arguments[0] === 'string') {//If string args, retrieve the props
        member = arguments[1];
        output = data[member]
      } else {
        for(; i < len; i++) {
          member = arguments[i];
          if(!(typeof member === 'string')
              || data[member] === undefined 
              || data[member] === null){
            continue;
          }
          output[member] = data[member]
        }
      }
      return output;
    };

    /**Set data
     * @function set
     * @static
     * @memberof KT.Components.AssetData
     * @param {Object=} -A plain object with the new valies.
     * @param {String|Value} -The name and the value to set, as diferent arguments
     */
    function set() {
      var self = arguments[0],
          i = 1,
          args = Array.prototype.slice.call(arguments, 1),
          len = args.length,
          value, 
          call,
          member;
      if(len === 0 ) {
        return
      } else if(len === 1) {
        value = args[0];
        for(member in value) {
          call = 'set' + member.charAt(0).toUpperCase() + member.slice(1);
          _.isFunction(self[call]) && self[call](value[member]);
        }
      } else {
        member = args[0];
        value = args[1];
        call = 'set' + member.charAt(0).toUpperCase() + member.slice(1);
        _.isFunction(self[call]) && self[call](value);
      } 
      return self
    }

    /**Sets plain object values with matching props. I the props of the pased
     * value don't match the value to set, them are skiped. For intrnal use, can't be
     * invoked outside.
     * @function setValue
     * @memberof KT.Components.Data
     * @param {Object|Array} value - The new value in object or array format.
     * @param {Object} model - The value to set
     * @returns - The seted value
     * @todo - Accept arrays as values and map them to an object
     */
    function setValue (value, model) {
      var isValid = true,
          isArray = _.isArray(value),
          i = 0,
          prop;
      if(isArray && model !== undefined) {
        len = value.length;
        for(var prop in model) {
          if(i >= len) break;
          model[prop] = value[i];
          i++
        }
      }else if (isArray){
        return value
      } else {
        for(var prop in model) {
          isValid = _.has(value, prop);
          if(isValid){
            model[prop] = value[prop]
          }
        }
      }
      
      return model
    }

    function clone(data) {
      var newData = {
        position: _.clone(data.position),
        anchor: _.clone(data.anchor),
        rotation: data.rotation,
      }
    }

    function cloneTiming(timing) {
      var clon = {};

      for (var i in timing) {
        clon[i] = _.clone(timing[i]);
      }

      return clon
    }
   
    //Return the CONSTRUCTOR
    /**
     * @classdesc A component to wrap asset data consistently.
     * @class
     * @name AssetData
     * @param {Object} [data] - A plain object with the data to store.
     * @param {Object} [data.position] - {x, y}
     * @param {Object} [data.anchor] - {x, y}
     * @param {Number} [data.rotation] 
     * @param {Object} [data.size] - {with, heigth}
     * @param {SymbolItem} [data.symbol]
     * @param {String} [data.path] - c|///Users/Documents/....
     */
    return function(data) {
      var data = !data ? {} : data;
      this.data = {
          position: setValue(data.position, {x: 0, y:0}),
          anchor: setValue(data.anchor, {x: 0, y: 0}),
          rotation: _.isNumber(data.rotation) ? data.rotation : 0,
          size: setValue(data.size, {width: 1, height: 1}),
          timing: setValue(data.timing),
          symbol: data.symbol instanceof SymbolItem ? data.symbol : 0,
          path: typeof data.path === 'string' ? data.path : '',
          duration: _.isNumber(data.duration) ? data.duration : 1
        }

      //Don't use this outside, is intended for internal use
      this.__getDirect__ = function() {
        return this.data
      }
      this.get = function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(this.data)
        return get.apply(this, args);
      },
      //Wrapper function to set
      this.set = function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(this); //Add this object to arguments to access privileged methods
        return set.apply(this, args);
      },
      this.setPosition = function(value) {
        data.position = setValue(value, this.data.position);
      },
      this.setAnchor = function(value) {
        data.anchor = setValue(value, this.data.anchor);
      },
      this.setSize = function(value) {
        data.size = setValue(value, this.data.size);
      },
      this.setRotation = function(value) {
        _.isNumber(value) ? value : this.data.rotation;
      },
      this.setSymbol = function(value) {
        value instanceof SymbolItem ? value : this.data.symbol;
      }
      this.setPath = function(value) {
        typeof value === 'string' ? value : this.data.path;
      }
      this.setTiming = function(timing) {
        data.timing = timing
      }
      this.cloneTiming = function() {
        cloneTiming(this.data.timing)
      }
    }
  })();
  KT.Components.Data = AssetData
})();