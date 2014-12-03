webApp.controller('PersistController', function($scope, $rootScope, MapValue, InitMapFactory, MapService, FitMapService, UpdateUIFactory, MapToXMINDFactory, ImageFactory, SessionProvider) {
  $scope.saveMap = function() {
    // If map haven't drilldowned -> save map x-y and level-zoom
    angular.element(showLoading());
    if (0 == MapValue.mMap.level) {
      InitMapFactory.updateMapAndZoom(-MapValue.gContainer.panZoom.curPos.x
          / MapValue.gContainer.panZoom.getZoomRatio(), -MapValue.gContainer.panZoom.curPos.y
          / MapValue.gContainer.panZoom.getZoomRatio(), MapValue.gContainer.panZoom.zoomLevelCurent);
    } else {
      // Only node position can be saved
    }
    updateChildren(MapValue.gContainer.eRoot);
    angular.element(hideLoading());
  }
  $scope.restore = function() {
    console.log("---------++++++++++++-__________")
    angular.element(showLoading());
    var args = {
      mapId : MapValue.cMap.id,
      token : MapValue.jsconf.defToken,
      firstTime: true
    }
    clearIsRightData(MapValue.mMap);
    MapService.ChangeToFirstTime(args).then(function() {
      InitMapFactory.loadMapSetting(MapValue.CUR_MAP_TYPE, MapValue.jsconf.defToken).then(function(settings) {
        MapValue.cMap = settings;
        MapValue.pMap = settings.pageInfos;
        console.log('new Map id '+MapValue.cMap.id)
        InitMapFactory.genFirstTime(function after() {
          ui = FitMapService.fitScreen().ui;
          UpdateUIFactory.updateUI($rootScope, 'EVT_ZOOM', ui.z);
          angular.element(hideLoading());
        });

        //MapValue.cMap.firstTime = false;
      })
    })
  }
  //
  function clearIsRightData(node) {
    if (undefined !== node.isRight)
      node.isRight = undefined;
    if (node.children) {
      node.children.forEach(function(dataChild) {
        clearIsRightData(dataChild);
      });
    }
  }
  //
  function updateChildren(eNode) {
    console.log('---> save page '+eNode.id+' ::: '+ eNode.shortTitle);
    pushPages(eNode.id, eNode.x, eNode.y, eNode.expand);

    if (eNode.eChildren) {
      eNode.eChildren.forEach(function(eChild) {
        updateChildren(eChild);
      });
    }
    return true;
  }
  //
  function pushPages(pageId, x, y, expand) {
    var data = {
      token : MapValue.jsconf.defToken,
      mapId : MapValue.cMap.id,
      pageId : pageId,
      x : x,
      y : y,
      expand : true
    }
    MapService.pushPages(data);
  }



  // 2014-07-08
  $scope.exportToPNG = function() {
    var boundary = MapValue.container.panZoom._getBoundary(MapValue.container.eRoot);

    //var set = MapValue.gPaper.set();
    //MapValue.gPaper.importSVG('<svg><style type="text/css"><![CDATA[rect {cursor: pointer;left: 5px;stroke: #FFFFFF;stroke-width: 0.5;top: 5px;}.node-rect.node-level-0 {stroke-width: 4 !important;}.node-rect, .node-text {cursor: pointer;}]]></style></svg>', set);

    var svgScale = MapValue.container.panZoom.getZoomRatio();
    angular.element(exportToPNG(boundary, svgScale));
  };
  //export to xml
  $scope.exportToXMIND = function() {
    var styles = MapToXMINDFactory.styleToXML();
    var fullDate = moment().format('YYYYMMDDHHmmss');
    var sessionData = SessionProvider.sessionData.lstPageSummary;
    var manifest = MapToXMINDFactory.exportManifest(MapValue.mMap);
    ImageFactory.genAllImages(sessionData, function(isFinished){
      if(isFinished) {
        var nodeNoImage = ImageFactory.getNodeNoImage();
        var content = MapToXMINDFactory.mapToXML(MapValue.mMap, nodeNoImage);
        angular.element(createXMIND($rootScope.curProject.name +'_'+ fullDate, content, styles, ImageFactory.getImageHash(), manifest));
        ImageFactory.removeImageHash();
      }
    })
  }
  // 2014-07-11
  $scope.exportToPDF = function() {
    var boundary = MapValue.container.panZoom._getBoundary(MapValue.container.eRoot);
    var svgScale = MapValue.container.panZoom.getZoomRatio();
    angular.element(exportToPDF(boundary, svgScale));
  };
  //
})
