(function(){


/**
 * 
 * @param opts Opts: item, index, timeline
 */

function addItemToTimeline(opts) {
  KT.Verbose(arguments);
  
  var item = opts.item,
      index = opts.index || 0,
      library = KT.Library(),
      symbol = item instanceof SymbolItem ? item : KT.Library.get(item),
      name = typeof item === 'string' ? item :KT.Path.split( symbol.name).name,
      timeline = KT.Document.getTimeline(opts.timeline),
      layer;
  KT.Document.editTimeline(timeline);
  // 
  timeline.setSelectedLayers(index, true);
  layer = timeline.addNewLayer(name, 'normal', true)
  timeline.setSelectedLayers(index, true);
  layer = library.addItemToDocument({x:0, y:0}, symbol.name);
  layer = timeline.layers[index];
  return layer;
};


/**Creates a new item on the library. In flash, symbols cannot have no layers, so it is created with an empty layer in it
 * @function createNewSymbol
 * @memberof KT
 * @param {String} name The name of the new symbol
 * @param {String} [type='movie clip'] The type of the item. acceptable values are: "video", "movie clip", "button", "graphic", "bitmap", "screen" y "folder" .
 * @param {String} [path] The path where the item is created. If doesn't exists, it is created
 * @returns The item if it is succesfully created
 * @example <caption> This example creates a new empty movie clip on top of the libry</caption>
 * var symbol = KT.Document.addNewItem('New Item", "movie clip" )
 * //Adds a new movie clip named 'New Item' on the top level of the library
 *  var symbol = KT.Document.addNewItem('New Item", "movie clip", "myFolder" )
 * //Adds a new movie clip named 'New Item' on 'myFolder' folder on the library
 */
function create(opts) {
  KT.Verbose(arguments);

  var library = KT.Library(),
      path = opts.path || '',
      pathExists = library.itemExists(path),
      validTypes = KT.RegExp(["video", "movie clip", "button", "graphic", "bitmap", "screen", "folder" ]),
      name = opts.name,
      type = opts.type,
      folderCreated,
      newItemPath= !path ? KT.Library.createUniqueName( name, path) : path + '/' + KT.Library.createUniqueName( name, path),
      type = type || 'movie clip',
      created,
      newItem;

  if(!pathExists && path != '') {
    folderCreated = library.addNewItem('folder', path)
  }
      

  type = type.match(validTypes)?  type :  'movie clip';
  created = library.addNewItem(type, newItemPath);
  newItem = KT.Library.get(newItemPath);
  
  KT.Verbose('New symbol', created, newItem.name, 'Type', newItem)
  return newItem
};


function createUniqueName(name, path) {
  KT.Verbose(arguments);

  var library = KT.Library(),
      index = 0,
      path = path ? path + '/' :  '',
      name = path +  name ,
      newName = name,
      exists = exists = library.itemExists(name);
      
  if(!exists) {
    KT.Verbose('Name does not exist', name)
    return KT.Path.split(name).name
  }

  name = name.replace(/\(\d+\)/gi, '')
  index++
  while(exists) {
    newName  = name + '(' + index + ')'
    exists = library.itemExists(newName)
    KT.Verbose('Exists:', newName, exists)
    index++
  }
  KT.Verbose('Unique name', newName)
  return KT.Path.split(newName).name
};


function deleteItem(symbol) {
  KT.Verbose(arguments);

  // if(!(symbol instanceof SymbolItem)) return;
  var name = _.isString(symbol) ? symbol 
            : symbol instanceof SymbolItem  ? symbol.name
            : symbol instanceof SymbolInstance ? symbol.libraryItem.name
            :'';
  
  KT.Library().deleteItem(name)
};


/**Duplicates a symbol by name and moves it to the path.
 * @function duplicateItem
 * @memberof KT.Document
 * @param {String|SymbolItem} name The name/path or the Symbol item to duplicate
 * @param {String} [path=KT_Backup] The path where to move the symbol.
 * @return The duplicated symbol
 */
function duplicate(name, path) {
  KT.Verbose(arguments);

  var library = KT.Library,
      path = path || backupFolderPath;
      pathExists = library.itemExists(path),
      symbolName =  name,
      name = name instanceof SymbolItem ? name.name : KT.Library.get(name).name,
      duplicated,
      moved,
      newName;

  if(!pathExists && path != '') {
    var folderCreated = library.addNewItem('folder', path);
  }


  library.selectNone()
  duplicated = library.duplicateItem(name);
  KT.Verbose('DUPLICATED: ' + duplicated, name);

  moved = library.moveToFolder(path);
  symbol = library.getSelectedItems()[0];
  newName = KT.Library.createUniqueName( symbolName,  path);

  symbol.name = newName;
  
  
  library.selectNone()
  KT.Verbose('Symbol: ' + symbol, 'Name: ' + symbol.name, 'Moved: ' + moved);
  return symbol
};



/**Gets a first symbol that matches the name from the library
 * @function get
 * @memberof KT.Document
 * @param {String|String[]|RexExp} name The names or names to match
 * @returns The first matching Symbol
*/
function getSymbol(name, caseInsensitive) {
  KT.Verbose(arguments);

  var library = KT.Library(),
      flags = caseInsensitive === true ? 'gi' : 'g',
      name = KT.RegExp(name, false, flags),
      items = library.items,
      selected,
      item;

  for(var i = 0; i < items.length; i++) {
    item = items[i];
    var match = name.test(item.name);
    
    if(match === true) {
      selected = item;
      break
    }
  }
  KT.Verbose('Item', selected)
  return selected
};

function getSymbolSize(symbol){
  KT.Verbose(arguments);

  var symbol = symbol instanceof SymbolItem ? symbol
              : _.isString(symbol) ? KT.Library.get(symbol)
              : -1,
      size = {width: 0, heigh: 0},
      tempSymbol = wrapSymbol({symbol: symbol}),
      element;

  if(symbol === -1 || !symbol) return size;
  
  element = tempSymbol.timeline.layers[0].frames[0].elements[0];
  size = {
    width: element.width,
    height: element.height
  }

  KT.Library.delete(tempSymbol)

  return size
};


function wrapSymbol(opts) {
  var symbol = opts.symbol instanceof SymbolItem ? opts.symbol
              : _.isString(opts.symbol) ? KT.Library.get(opts.symbol)
              : -1,
      name = symbol != -1 ? symbol.name + '_wrapper' : '',
      type = opts.type,
      wrapper;

  if(symbol === -1 || !symbol) return;
  
  type = type ||symbol.symbolType;
  wrapper = KT.Library.create({
    name: name,
    type: type
  });
  layer = KT.Library.addItemToTimeline({item: symbol, timeline: wrapper});
  return wrapper;
}

/**Iterate through the library items and performs a callback only on the symbols
 * @function walk
 * @memberof KT.Document
 * @param {Function} callback A function to perform on symbols
 * @returns An Array with the symbols
*/
function walk(type, callback) {
  KT.Verbose(arguments);

  var name = name && name != '' ? KT.RegExp(name): name;
  var items = KT.Library().items;
  var type = type || Item
  var values = [];
  var callbackIsFunction = _.isFunction(callback)
  if(items.length == 0) {
    KT.Verbose('No items in library')
    return
  }
  if(!callbackIsFunction) {
    return []
  }
  
  for(var i = 0; i < items.length; i++ ) {
    var item = items[i]
    if(item instanceof type) {
      var result = callback(item, i, items)
      values.push(result)
    }
  }
  return values
}


//=================================
//Module declaration

KT.Library = function() {
  return KT.Document().library;
}


//Module Definition
KT.Library.addItemToTimeline = addItemToTimeline;
KT.Library.create = create;
KT.Library.createUniqueName = createUniqueName;
KT.Library.delete = deleteItem;
KT.Library.duplicate = duplicate;
KT.Library.get = getSymbol;
KT.Library.getSymbolSize = getSymbolSize;
KT.Library.walk = walk;

})();