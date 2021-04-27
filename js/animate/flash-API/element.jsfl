(function(){

  KT.Element = (function(){
    return function(){

    }
  })();

  /** Gets the transformation point as top-left origin
  * @function getElementAnchorPoint
  * @memberof KT.Element
  * @returns - A vector containing the x and the y values.
  */
  KT.Element.getAnchorPoint = function(elements) {

    var elements = _.isArray(elements) ? elements : [elements],
        i = 1,
        len = elements.length,
        elementAnchor,
        anchorPoint;

    if(elements.length === 0) return elementAnchor
    anchorPoint = getAnchor(elements[0]);
    
    if(len <= 1) {
      return anchorPoint
    } else {
      for(; i < len; i++){
        elementAnchor = getAnchor(elements[i]);
        anchorPoint.x = anchorPoint.x  + elementAnchor.x;
        anchorPoint.y = anchorPoint.y  + elementAnchor.y;
      }
      
      anchorPoint.x = anchorPoint.x / len
      anchorPoint.y = anchorPoint.y / len
    }
    
    function getAnchor(element) {
      var anchor = {x: 0, y: 0},
          isShape = element.elementType !== 'instance',//element.elementType === 'shape'|| element.elementType ==='shapeObj' || element.isGroup,
          xProp = isShape ? 'x' : 'transformX',
          yProp = isShape ? 'y' : 'transformY',
          rotation = element.rotation,
          x = element[xProp],
          y = element[yProp]
      element.rotation -= rotation;
      if(isShape) {
        anchor.x = KT.toFixed(element.width / 2);
        anchor.y = KT.toFixed(element.height / 2);

      } else {
        element[xProp] = 0;
        element[yProp] = 0;
        anchor.x = KT.toFixed(-element.left);
        anchor.y = KT.toFixed(-element.top);
        element[xProp] = x;
        element[yProp] = y;
      }

      element.rotation = rotation;
      

      return anchor
    }
    

    return anchorPoint
  }



  KT.Element.getPosition = function(source) {
    var point = source.getTransformationPoint();
    return {
      x: KT.toFixed(point.x + source.x),
      y: KT.toFixed(point.y + source.y)
    }
  }

  KT.Element.getRotation = function(source) {
    return source.rotation
  }

  KT.Element.getSize = function(source) {
    return {
      width: KT.toFixed(source.width),
      height: KT.toFixed(source.height)
    }
  }

  KT.Element.getScale = function(source) {
    return {
      x: source.scaleX,
      y: source.scaleY
    }
  }

  KT.Element.bounds = function(element) {
    KT.Verbose(arguments);
    if(!element) {
      return {left:  0, right: 0, top: 0, bottom: 0, x: 0, y: 0}
    }
    var bounds =  {
      left: KT.toFixed(element.left),
      right: KT.toFixed(element.left + element.width),
      top: KT.toFixed(element.top),
      bottom: KT.toFixed(element.top + element.height)
    }
    bounds.x = KT.toFixed(element.width / 2 + element.left);
    bounds.y = KT.toFixed(element.height / 2 + element.top);
    bounds.width = bounds.right - bounds.left;
    bounds.height = bounds.bottom - bounds.top;
    return bounds
  }

  KT.Element.getBounds = function(source) {
    KT.Verbose(arguments);
    var elements = _.isArray(source) ? source : [source],
        bounds = this.bounds(elements[0]),
        i = 1,
        len = elements.length,
        element,
        b;
    for(; i < len; i++){
      element = elements[i];
      b = this.bounds(element)
      bounds.left = Math.min(bounds.left, b.left);
      bounds.top = Math.min(bounds.top, b.top);
      bounds.right = Math.max(bounds.right, b.right);
      bounds.bottom = Math.max(bounds.bottom, b.bottom);
      bounds.x = b.x + bounds.x;
      bounds.y = b.y + bounds.y;
    }

    bounds.x = len !== 0 ? bounds.x / len : bounds.x;
    bounds.y = len !== 0 ? bounds.y / len : bounds.y;

    return bounds;
  }

  KT.Element.averagePosition = function (elements){
    var bounds = this.getBounds(elements);
    
        var x = (bounds.left + bounds.right) / 2,
        y = (bounds.top + bounds.bottom) /2;

    return {x: x, y: y};
    
  }
  

})();