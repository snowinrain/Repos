webApp.service('FitMapService', function(MapValue, ConfValue, UtilsFactory, RaphaelCusService, ZoomService) {
  RaphaelCusService.initialized();
  this.fitScreen = function() {
    var currentLevelHeight = ConfValue.ZOOM_LEVEL_MAX,
        currentLevelWidth = ConfValue.ZOOM_LEVEL_MAX,
        ratio = 0,
        viewBoxWidth = 0,
        viewBoxHeight = 0,
        g_container = MapValue.gContainer,
        g_paper = MapValue.gPaper;
    var svgBoundary = g_container.panZoom._getBoundaryVisibleNode(g_container.eRoot);
    UtilsFactory.isCallFitToScreen = true;
    for (var i = ConfValue.ZOOM_LEVEL_MIN; i <= ConfValue.ZOOM_LEVEL_MAX ; i++) {
      ratio = UtilsFactory.getZoomRatio(ConfValue.ZOOM_LEVEL_DEFAULT, i);
      viewBoxWidth = g_paper.width * ratio;
      viewBoxHeight =  g_paper.height * ratio;

      if (currentLevelWidth == ConfValue.ZOOM_LEVEL_MAX && viewBoxWidth < (svgBoundary.boundaryMaxx - svgBoundary.boundaryMinx + ConfValue.SVG_PADDING * 2)) {
        currentLevelWidth = i - 1;
      }
      if (currentLevelHeight == ConfValue.ZOOM_LEVEL_MAX && viewBoxHeight < (svgBoundary.boundaryMaxy - svgBoundary.boundaryMiny
           + ConfValue.SVG_PADDING * 2 * ratio)) {
        currentLevelHeight = i - 1;
      }
      if (currentLevelWidth != ConfValue.ZOOM_LEVEL_MAX && currentLevelHeight != ConfValue.ZOOM_LEVEL_MAX) break;
    }

    var finalLevel = Math.min(currentLevelHeight, currentLevelWidth, ConfValue.ZOOM_LEVEL_DEFAULT);
    ZoomService.handleZoom(finalLevel);

    // Move Map to center
    // taif
    g_container.panZoom.autoToCenter();
    return {
      ui: {
        z: finalLevel
      }
    }
  };
  this.center = function(){
    MapValue.gContainer.panZoom.autoToCenter();
  }
})
