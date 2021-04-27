(function(){
//METHODS
function chekSourceFrames(source) {
  KT.Verbose(arguments)
  var source = _.toArray(source),
      i = 0,
      len = source.length,
      areFrames = true;

  for(; i < len; i++) {
    if(!(source[i] instanceof Frame) && source[i].isKtFrame !== true) {
      areFrames = false;
      break;
    }
  }
  return areFrames ? source : []
}

function getFrames(opts) {
  KT.Verbose(arguments);
  
  var frames = opts.frames;
  if(!frames) return false;
  var  props = new KT.RegExp(opts.props, true, 'g'),
      condition = opts.condition || function() {return true},
      callback = opts.callback || function() {},
      keys = opts.keys === true ? function(fr){return fr.isKey} : function(){return true},
      newFrames = [],
      i = 0, prop,
      len = frames.length,
      select,
      newFrame,
      frame;


  for(; i < len; i++) {
    frame = frames[i];
    newFrame = {};
    newFrame.source = frame;
    newFrame.isKey = isKey(frame, i);
    newFrame.index = i;
    newFrame.isKtFrame = true;
    
    for(prop in frame) {
      select = prop.match(props);
      if(select !== null) {
        newFrame[prop] = frame[prop]
      }
    }

    select = condition(newFrame, i, frames, this) && keys(newFrame);
    
    
    if(select === true) {
      
      callback(newFrame, i, frames, this);
      newFrames.push(newFrame)
    }
  }
  return newFrames
}


function getKeys(frames) {
  KT.Verbose(arguments);

  var i = 0,
      len = frames.length,
      newFrames = [],
      frame;

  for(; i < len; i++) {
    frame = frames[i];
    if(frame.isKey === true) {
      newFrames.push(frame);
    }
  }
  return newFrames
}

function isKey(frame, index) {
  var isKey = frame.startFrame === index ;
  return isKey
}

function averagePosition(frames){
  var bounds,
      i = 0,
      len = frames.length,
      b,
      elements = []

  for(; i < len; i++) {
    frameElements = frames[i].source.elements;
    elements.push(frameElements)
  }
  elements = _.uniq(_.flatten(elements));
  bounds = KT.Element.averagePosition(elements);
  return bounds
}

function getBounds(frames) {
  var bounds,
      i = 0,
      elements = [],
      frameElements,
      frames = _.uniq(_.flatten(frames)),
      len = frames.length,
      frame;
  
  for(; i < len; i++) {
    frame = frames[i];
    frameElements = frame.isKtFrame ? frames[i].source.elements : frame.elements;
    elements.push(frameElements)
  }
  elements = _.uniq(_.flatten(elements));
  bounds = KT.Element.getBounds(elements);
  return bounds
}

function offsetFramePosition(frame, offset) {
  KT.Verbose(arguments);

  var elements = frame.elements,
      i = 0,
      len = elements.length,
      element;
  
  //If there are doted shapes, flash moves all elements at once.
  for(; i < len; i++) {
    element = elements[i];
    if(element.elementType !== 'instance' && !element.isGroup && !element.isDrawingObject){
      len = 1;
      break;
    }
  }

  for(; i < 1; i++) {
    
    element = elements[i];
    element.x += offset.x;
    element.y += offset.y;
  }
}

function offsetFramesPosition(frames, offset) {
  var i = 0,
      offset = {
        x: _.isNumber(offset.x) ? offset.x : _.isNumber(offset[0]) ? offset[0] : 0,
        y: _.isNumber(offset.y) ? offset.y : _.isNumber(offset[1]) ? offset[1] : 0, 
      },
      
      frames = getKeys(frames),
      len = frames.length;
      
  
  for(; i < len; i++) {
    offsetFramePosition(frames[i], offset)
  }
}


//FRAMES CONSTRUCTOR
function init(opts){
  KT.Verbose(arguments);
  var opts = opts || {};
  
  opts.frames = opts instanceof Layer ? opts.frames  
          : !opts.source ? opts
          : opts.source instanceof Layer ? opts.source.frames : opts.source;

  opts.condition = opts.condition || opts.check;
  opts.callback = opts.callback || opts.do;
  opts.props = opts.props;
  opts.frames = chekSourceFrames(opts.frames);
  frames = getFrames(opts);
  return frames
}
/**
 * 
 * @param {Object} opts 
 * @param {Layer|Frame[]} opts.source - A Layer or a Frame array.
 * @param {Function} [opts.condition] - A condition function.
 * @param {Function} [opts.callback] - A callback to perform on the frames.
 * @param {Function} [opts.props] - The props to get from the frame
 */

function Frames(opts){
  if (!(this instanceof arguments.callee)) {
    return new Frames(opts);
  } 
}
Frames.prototype = {
  init: function(opts){
 
    return init.call(this, opts)
  },
  keys: function(){
    return getKeys(this)
  },
  bounds: function(){
    return getBounds(this)
  },
  averagePosition: function(){
    return averagePosition(this)
  },
  offsetPosition: function(offset){
    return offsetFramesPosition(this, offset)
  },
}

KT.Frames = KT.ExtendArray(Frames);



KT.Frames.getBounds = getBounds;



})();