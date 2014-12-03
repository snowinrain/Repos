webApp.controller('ScreenController', function($scope, $rootScope, FitMapService, ZoomService, MapValue, MapValue, InitMapFactory, UpdateUIFactory, MapService){
  var first = true;
  var  selectedNode = null;
  $scope.zoomToFit = function() {
    var ui = FitMapService.fitScreen().ui;
    UpdateUIFactory.updateUI($rootScope, 'EVT_ZOOM', ui.z);
  };
  $scope.moveToCenter = function() {
    FitMapService.center();
  };
  $scope.handleZoom = function(level) {
    ZoomService.handleZoom(level);
  };
  $scope.handleCollapse = function(level) {
    if (!first){
      if(MapValue.CUR_LEVEL > level) {
         if (level < MapValue.gContainer.eRoot.level) return;
          MapValue.container.collapseLevel();
      }
      if(MapValue.CUR_LEVEL < level){
        MapValue.container.expandLevel();
      }
      MapValue.CUR_LEVEL = level;
      console.log(MapValue.CUR_LEVEL);
    } else {
      first = !first;
    }
  };
  $scope.choosenMap = function(mapType) {
    //if(mapType == MapValue.CUR_MAP_TYPE) return "color:greenyellow";
    if(mapType == MapValue.CUR_MAP_TYPE) return "selected-maplayout";
  }
  $scope.changeMap = function(mapType) {
    angular.element(showLoading());
    MapValue.CUR_MAP_TYPE = mapType;
    MapValue.gContainer.resetAllMarkers();
    //
    InitMapFactory.loadMapSetting(mapType, MapValue.jsconf.defToken).then(function(settings) {
      MapValue.cMap = settings;
      MapValue.pMap = settings.pageInfos;
      //render map
      if (MapValue.cMap.firstTime) {
        InitMapFactory.genFirstTime(function after() {
          ui = FitMapService.fitScreen().ui;
          maxVisit = MapValue.maxVisitCount;
          UpdateUIFactory.updateUI($rootScope, 'EVT_ZOOM', ui.z);
          UpdateUIFactory.updateUI($rootScope, 'EVT_MAX_VISIT', maxVisit);
          angular.element(hideLoading());
        });
      } else {
        InitMapFactory.mergeWithPage(MapValue.mMap, MapValue.pMap);
        InitMapFactory.drawMap(MapValue.mMap);
        ui = FitMapService.fitScreen().ui;
        maxVisit = MapValue.maxVisitCount;
        UpdateUIFactory.updateUI($rootScope, 'EVT_ZOOM', ui.z);
        UpdateUIFactory.updateUI($rootScope, 'EVT_MAX_VISIT', maxVisit);
        angular.element(hideLoading());
      }
    })
  };

  //$scope.jumpInputValue = "";// = "Ziglw4PCqjkyQnXDgsKVww==";
  $scope.listTitles = MapValue.listTitles;
  $scope.updateListTitles = function() {
    $scope.listTitles = MapValue.listTitles;
  }
  $scope.jumpToNode = function(id, title) {
    var inputValue = id;
    if( selectedNode ) selectedNode.unselectThisNode();
    var eNode = MapValue.container.findENode(inputValue);
    eNode.selectThisNode();
    $scope.jumpInputValue = title;
    selectedNode = eNode;
    var x = eNode.eGroup.pRect.getBBox().x; // Center
    var y = eNode.eGroup.pRect.getBBox().y; // Center
    var width = eNode.eGroup.pRect.getBBox().width;
    var height = eNode.eGroup.pRect.getBBox().height;
    //ZoomService.handleZoom(16);
    MapValue.container.panZoom.autoMoveNodeToCenter(x, y, width, height);
  }
  $scope.jumpToScreenKeyPress = function(isEnter) {
    if(isEnter) {
      if($scope.filteredList.length > 0) {
        $scope.jumpToNode($scope.filteredList[0].id);
        $scope.jumpInputValue = $scope.filteredList[0].fullTitle;
      }
    }
  };

})
