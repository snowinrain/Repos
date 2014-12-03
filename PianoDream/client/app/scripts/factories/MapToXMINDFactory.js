webApp.factory('MapToXMINDFactory', function(){
  var styles = [];
  var styleNodeHash = {};
  var fileEntries = [];
  //
  function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxxxxyxxxyxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
  }
  //// remove special character
  function htmlSpecialChars(unsafe) {
    return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  }
  /////
  function genFileEntry(qmap) {
    var entry = {
      _name: 'file-entry',
      _attrs: {
        'full-path': 'attachments/' + qmap.id + '.png',
        'media-type': 'image/png'
      },
      _content: {}
    }
    fileEntries.push(entry);
    for(var i = 0; i < qmap.children.length; i++) {
      genFileEntry(qmap.children[i]);
    }
  }
  //////
  return {
    mapToXML: function(qmap, nodeNoImage){
      var midResult = {};
      var isRoot = true;
      //// function to convert from qmap to xmind
      function qmapToXMIND(result){
        return toXML({
          _name: 'xmap-content',
          _attrs: {
            xmlns: 'urn:xmind:xmap:xmlns:content:2.0',
            'xmlns:fo':'http://www.w3.org/1999/XSL/Format',
            'xmlns:svg':'http://www.w3.org/2000/svg',
            'xmlns:xhtml':'http://www.w3.org/1999/xhtml',
            'xmlns:xlink': 'http://www.w3.org/1999/xlink',
            timestamp: Date.now(),
            'version': '2.0'
          },
          _content:{
            _name: 'sheet',
            _content: [{
              _name: 'title',
              _content: 'qmap-export'
            }, result],
            _attrs: {
              id: generateUUID(),
              timestamp: Date.now()
            }
          }
        }, {header: false, indent: '  '})
      }
      //// function traversal map
      function traversalMap(qmap, result) {
        var attrs = {};
        if (!nodeNoImage[qmap.id]) {
          attrs = {
            'xhtml:src': 'xap:attachments/' + qmap.id + '.png'
          }
        }
        result._name =  'topic';
        result._content = [{
          _name: 'title',
          _content: htmlSpecialChars(qmap.title)
        }, {
          _name: 'xhtml:img',
          _attrs: attrs,
          _content: {}
        }];
        //
        if(isRoot) {
          result._attrs = {
            'structure-class': 'org.xmind.ui.map.clockwise',
            timestamp: Date.now(),
            id: generateUUID(),
            'style-id': styleNodeHash[qmap.id]
          }
          isRoot = false;
        } else {
          result._attrs = {
            timestamp: Date.now(),
            id: generateUUID(),
            'style-id': styleNodeHash[qmap.id]
          }
        }
        //
        if(qmap.children.length > 0) {
          result._content.push({
            _name: 'children',
            _content: {
              _name: 'topics',
              _content: [],
              _attrs: {
                type: 'attached'
              }
            }
          });
        }
        //
        for(var i = 0; i< qmap.children.length; i++) {
          var index = result._content.length - 1;
          result._content[2]._content._content[i] = {};
          traversalMap(qmap.children[i], result._content[2]._content._content[i]);
        }
      }
      //
      traversalMap(qmap, midResult);
      return qmapToXMIND(midResult);
    },
  pushNodeHash: function(id, styleId) {
    styleNodeHash[id] = styleId;
  },
  pushStyle: function(color) {
    var styleId = generateUUID();
    var style = {
      _name: 'style',
      _attrs: {
        id: styleId,
        type: "topic"
      },
      _content: {
        _name: 'topic-properties',
        _attrs: {
          'shape-class': 'org.xmind.topicShape.roundedRect',
          'svg:fill': color
        }
      }
    }
    styles.push(style);
    return styleId;
  },
  exportManifest: function(qmap) {
    fileEntries = [{
      _name: 'file-entry',
      _attrs: {
        'full-path': 'attachments/',
        'media-type': ''
      }
    }];
    genFileEntry(qmap);
    return '<?xml version="1.0" encoding="UTF-8"?>' + toXML({
      _name: 'manifest',
      _attrs: {
        xmlns: 'urn:xmind:xmap:xmlns:manifest:1.0'
      },
      _content: fileEntries
    })
  },
  styleToXML: function() {
    return toXML({
      _name: 'xmap-styles',
      _attrs: {
        xmlns: 'urn:xmind:xmap:xmlns:style:2.0',
        'xmlns:fo': 'http://www.w3.org/1999/XSL/Format',
        'xmlns:svg': 'http://www.w3.org/2000/svg',
        version: '2.0'
      },
      _content: {
        _name: 'styles',
        _content: styles
      }
    }, {header: false, indent: '  '});
  }
  }
})
