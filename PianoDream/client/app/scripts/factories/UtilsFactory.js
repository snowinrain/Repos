webApp.factory('UtilsFactory', function(ConfValue, MapValue){
  var minSize = 10,
      width = 0,
      factory = {};
    factory.getWidth = function(level) {
      if (level > ConfValue.MAX_LEVEL_HAVE_DIFFERENT_SIZE) {
        return ConfValue.NODE_W;
      }
      return ConfValue.NODE_W * (1 + 1/(1 + level));
    };
    factory.getHeight = function(level) {
      if (level > ConfValue.MAX_LEVEL_HAVE_DIFFERENT_SIZE)
        return ConfValue.NODE_H
      return ConfValue.NODE_H * (1 + 1/(1 + level));
    };
    factory.minFontSize = minSize,
    factory.getFontSize = function(level) {
      if (level > ConfValue.MAX_LEVEL_HAVE_DIFFERENT_SIZE) {
        width = ConfValue.NODE_W
      }else{
        width = ConfValue.NODE_W * (1 + 1/(1 + level));
      }
      return (minSize + (width - ConfValue.NODE_W)*10/ ConfValue.NODE_W);
    };
    factory.mixColor = function (r1, g1, b1, a1, r2, g2, b2, a2){
      var result = {
          r: 0,
          g: 0,
          b: 0,
          a: 0
      };
      result.a = 1 - (1 - a1) * (1 - a2);
      result.r = Math.floor(r1 * a1 / result.a + r2 * a2 * (1 - a1) / result.a);
      result.g = Math.floor(g1 * a1 / result.a + g2 * a2 * (1 - a1) / result.a);
      result.b = Math.floor(b1 * a1 / result.a + b2 * a2 * (1 - a1) / result.a);
      return result;
    }
    factory.getWidthExpandedByLevel = function(level) {
      var totalExpandedWidthValue = 0,
          i = 0;
      if (level == 0) { // not accept root
        return 0;
      }
      for (; i < Math.min(ConfValue.MAX_LEVEL_HAVE_DIFFERENT_SIZE+ 1, level); i++) {
        totalExpandedWidthValue += (factory.getWidth(i) - ConfValue.NODE_W > 0 ? factory.getWidth(i) - ConfValue.NODE_W: 0);
      };
      if (0 > totalExpandedWidthValue){
        return 0;
      }
      return totalExpandedWidthValue;
    };
    factory.getHeightExpandedByLevel = function(level) {
      var totalExpandedHeightValue = (factory.getHeight(level) - ConfValue.NODE_H)/2;
      if (level > ConfValue.MAX_LEVEL_HAVE_DIFFERENT_SIZE) { // not accept root
        return 0;
      }
      // TODO: check for relative position to RootNode
      return totalExpandedHeightValue;
    };
    factory.isCallFitToScreen = false;
        // this function is the same as PanZoom.getZoomRatio();
    factory.getZoomRatio = function(levelZoomDefault, levelZoomTo) {
      if (ConfValue.ZOOM_LEVEL_DEFAULT< levelZoomTo) {
        return (levelZoomDefault - levelZoomTo) * ConfValue.ZOOM_SCALE_RATIO_BELOW_ORIGINAL_SIZE + 1;
      } else {
        return (levelZoomDefault - levelZoomTo) * ConfValue.ZOOM_SCALE_RATIO_ABOVE_ORIGINAL_SIZE + 1;
      }
    }
    // is new node in map
    factory.hasNewNode = function() {
      var descriptionMap = MapValue.mMap;
      var pageMap = MapValue.pMap;
      var numOfNodes = factory.numOfNode(descriptionMap) + 1;
      var numOfPages = MapValue.pMap.length;
      return numOfPages === numOfNodes;
    }
    //
    factory.numOfNode = function(descriptionMap){
      var num = 0;
      if(descriptionMap.children.length === 0) return 0;
      for(var i = 0; i < descriptionMap.children.length; i++) {
        num =  num + 1 + factory.numOfNode(descriptionMap.children[i]);
      }
      return num;
    }
  return factory;
})
