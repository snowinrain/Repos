webApp.factory('InitMapFactory', function($rootScope, MapService, MapValue, UtilsFactory, ConfValue, ContainerSimpleService, QSessionService, SessionProvider, ContainerTwoBranchService, ContainerHorizontalService, QService, UpdateUIFactory, FitMapService, DrillDownService){
  // support function
  var factory = {},
      EContainerSimple = ContainerSimpleService.initialized().EContainerSimple,
      EContainer2Tree = ContainerTwoBranchService.initialized().EContainer2Tree,
      EContainerHorizontal = ContainerHorizontalService.initialized().EContainerHorizontal;
  function getPageSetting(pageId, pMap) {
    var result = null;
    if (pMap) {
      pMap.forEach(function(pageSetting) {
        if (pageSetting.pageId == pageId) {
          result = pageSetting;
          return;
        }
      });
    }
    return result;
  }
  //
  factory.initialize = function() {
    console.log('----------> init map');
    var svgElement = $('#div-svgid');
    return {
      canvasW: svgElement.width(),
      canvasH: svgElement.height()
    }
  }
  //
  factory.loadConfig = function () {
    console.log('----------> load jsconf');
    return MapService.getJsConfig().then(function(js){
      return js;
    });
  }
  //
  factory.loadParentChildMap = function() {
    console.log('----------> load meta map');
    return MapService.getParentChildMap().then(function(parentChild){
      return parentChild;
    })
  }
  //
  factory.loadMapSetting = function(mapType, token) {
    console.log('----------> load map\' descript');
    var arguments = {
      mapType : mapType,
      token : token,
      userId: MapValue.userSettings.userId
    };
    return MapService.getMapSetting(arguments).then(function(desMap) {
      return desMap;
    })
   }
  //
  factory.mergeWithPage = function(mMap, pMap) {
    console.log('----------> merge map');
    if (mMap) {
      var pageSetting = getPageSetting(mMap.id, pMap);

      if (pageSetting != null) {
        mMap.x = pageSetting.x;
        mMap.y = pageSetting.y;
        mMap.expand = pageSetting.expand;

        if (mMap.id == MapValue.mMap.id) {
          MapValue.rootNodeTemporary = mMap;
          MapValue.xRootCenterTemporary = pageSetting.x + UtilsFactory.getWidth(ConfValue.MIN_LEVEL_NODE) / 2;
        }
      }

      if (mMap.children) {
        mMap.children.forEach(function(dataChild) {
          factory.mergeWithPage(dataChild, pMap);
        });
      }
    }
   }
  //
  factory.drawMap = function(mMap) {
    console.log('----------> draw map');
    var container = null;
    switch (MapValue.cMap.mapType) {
      case ConfValue.CIRCLE:
        //container = new EContainerCircle(mMap);
        break;
      case ConfValue.SIMPLE:
        container = new EContainerSimple(mMap);
        break;
      case ConfValue.BRANCH:
        container = new EContainer2Tree(mMap);
        break;
      case ConfValue.HORIZONTAL:
        container = new EContainerHorizontal(mMap);
        break;
      default:
        break;
    }
    MapValue.container = container;
    MapValue.listTitles = [];
    MapValue.container.draw();
//      ClientUIControls.zoomSlider.slider("value", ClientFunction.map_setting.levelZoom);
    //MapValue.cMap.firstTime = false;
    MapValue.container.panZoom.rootMoving(MapValue.cMap.mapX, MapValue.cMap.mapY);
    if (MapValue.IS_FIRST_FILL_SESSION) {
      MapValue.container.maxVisitCount = MapValue.maxVisitCount;
      MapValue.IS_FIRST_FILL_SESSION = false;
    }
    applySession();
  }
  //
  factory.genFirstTime = function(cb) {
    if (0 == MapValue.mMap.level) {
      var treeRoot = QService.initialized().generateMap(MapValue.mMap, MapValue.CUR_MAP_TYPE);
      // save page
      factory.saveMap(treeRoot);
      factory.drawMap(treeRoot);
      MapValue.isInitialized = true;
      factory.updateMapAndZoom(-MapValue.gContainer.panZoom.curPos.x/ MapValue.gContainer.panZoom.getZoomRatio(),-MapValue.gContainer.panZoom.curPos.y/MapValue.gContainer.panZoom.getZoomRatio(), MapValue.gContainer.panZoom.zoomLevelCurent);
      MapValue.cMap.firstTime = false;
      cb();
      } else {
      // restore data to the first node
      var currentDrilldownedPageId = MapValue.mMap.id;
      MapService.getParentChildMap().then(function(data){
        MapValue.mMap = data;
        var treeRoot = QService.initialized().generateMap(MapValue.mMap, MapValue.CUR_MAP_TYPE);
        factory.saveMap(treeRoot);
        //TODO
        var selectedPageData = '';
        selectedPageData = DrillDownService.browseGettingData(treeRoot, selectedPageData, currentDrilldownedPageId);
        MapValue.mMap = selectedPageData;
        factory.drawMap(selectedPageData);
        MapValue.isInitialized = true;
        factory.updateMapAndZoom(-MapValue.gContainer.panZoom.curPos.x/ MapValue.gContainer.panZoom.getZoomRatio(),-  MapValue.gContainer.panZoom.curPos.y/MapValue.gContainer.panZoom.getZoomRatio(), MapValue.gContainer.panZoom.zoomLevelCurent);
        MapValue.cMap.firstTime = false;
        cb();
      })
      }
  }
  factory.reloadMap = function() {
    MapValue.gContainer.resetAllMarkers();
    factory.loadMapSetting(MapValue.CUR_MAP_TYPE, MapValue.jsconf.defToken).then(function(settings) {
      MapValue.cMap = settings;
      MapValue.pMap = settings.pageInfos;
      //render map
      factory.mergeWithPage(MapValue.mMap, MapValue.pMap);
      factory.drawMap(MapValue.mMap);
      ui = FitMapService.fitScreen().ui;
      maxVisit = MapValue.maxVisitCount;
      UpdateUIFactory.updateUI($rootScope, 'EVT_ZOOM', ui.z);
      UpdateUIFactory.updateUI($rootScope, 'EVT_MAX_VISIT', maxVisit);
    })
  }
  MapValue.cache = factory.reloadMap;
  //
  factory.saveMap = function(model){
    // TODO: can we make it call to server by once time, not use manny request as
    // current solution
    var data = {
      mapId : MapValue.cMap.id,
      pageId : model.id,
      x : model.x,
      y : model.y,
      expand : true
    };
    MapService.saveMap(data).then(function(){
      console.log('save page-id: '+model.id+' Map-id: '+ data.mapId);
      if(model.children) {
        model.children.forEach(function(childModel) {
          factory.saveMap(childModel);
        });
      }
    })
  }
  //
  factory.updateMapAndZoom = function(valX, valY, levelZoom) {
    if (!MapValue.isInitialized) {
      return false;
    }
    MapValue.cMap.mapX = valX;
    MapValue.cMap.mapY = valY;
    MapValue.cMap.levelZoom = levelZoom;
    var data = {
      x : valX,
      y : valY,
      levelZoom : levelZoom,
      mapId : MapValue.cMap.id,
      token : MapValue.jsconf.defToken
    };
    MapService.updateMapAndZoom(data);
  }
  //
  factory.run = function(mapType) {
      console.log('----------> run data');
  }
  //
  function applySession() {
      if(Object.getOwnPropertyNames(SessionProvider.sessionData).length != 0) {
        MapValue.container.applySession(QSessionService.initialized(SessionProvider.sessionData));
        MapValue.isInitialized = true;
        console.log('apply session');
      } else {
        setTimeout(applySession, 50);
      }
  }
  return factory;
})
