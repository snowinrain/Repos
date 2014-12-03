webApp.controller('ContentController', function($scope, $rootScope, InitMapFactory, ConfValue, MapValue, FitMapService, UpdateUIFactory, QService, DrillDownService, UtilsFactory){
  var mMap = {}, // data map with child
      pMap = {}, //page settings
      cMap = {}, //map settings
      ui = {},
      mapType = ConfValue.SIMPLE,
      maxVisit = 0,
      canvas = {};
  $rootScope.runMainFlow = function() {
    angular.element(removeDrillDown());
    canvas = InitMapFactory.initialize();
    MapValue.CANVAS_W = canvas.canvasW;
    MapValue.CANVAS_H = canvas.canvasH;
    InitMapFactory.loadConfig().then(function(conf){
      MapValue.jsconf = conf;
      // load and draw map
      InitMapFactory.loadParentChildMap().then(function(parentChild){
        mMap = parentChild; // load  map without position
        MapValue.mMap = parentChild;
        MapValue.mMapo = null;
        MapValue.dHistory = null;
        InitMapFactory.loadMapSetting(mapType, conf.defToken).then(function(settings) {
          MapValue.cMap = settings;
          MapValue.pMap = settings.pageInfos;
          MapValue.CUR_MAP_TYPE = 2;
          if(UtilsFactory.hasNewNode()){
            console.log("============================> No New Map");
          };
          //render map
          if (MapValue.cMap.firstTime) {
            InitMapFactory.genFirstTime(function after(){
              ui = FitMapService.fitScreen().ui;
              UpdateUIFactory.updateUI($rootScope, 'EVT_ZOOM', ui.z);
              angular.element(hideLoadingModal());
            });
          } else {
            InitMapFactory.mergeWithPage(MapValue.mMap, MapValue.pMap);
            InitMapFactory.drawMap(MapValue.mMap);
            ui = FitMapService.fitScreen().ui;
            maxVisit = MapValue.maxVisitCount;
            UpdateUIFactory.updateUI($rootScope, 'EVT_ZOOM', ui.z);
            UpdateUIFactory.updateUI($rootScope, 'EVT_MAX_VISIT', maxVisit);
            angular.element(hideLoadingModal());
          }
        }, function() {
      angular.element($('#alert').click());})
      })
//      // load all testers and group of testers
//      $rootScope.getTesters();
      // load and show filter
      $rootScope.getFilter();
      // load all session
      $rootScope.runSession();
    });
  }
  $rootScope.extractMap = function(pageId){
    DrillDownService.extractMap(pageId);
  }
  $rootScope.modifyParent = function(nodeId, parentId) {
    console.log(nodeId);
  }
  $scope.restoreOrigin = function() {
    // S1: delete data and reload page
    // if map is shown full page: drilldown of rootNode
    if (MapValue.mMapo.id == MapValue.mMap.id)
      return;
    DrillDownService.restoreOrigin();
    clearDrillDown();
    InitMapFactory.reloadMap();

  }
  function clearDrillDown() {
    MapValue.dHistory = null;
    MapValue.mMapo = null;
  }
})
