webApp.service('DrillDownService', function($rootScope, $compile, MapValue) {
  var self = this;
  this.extractMap = function(pageId) {
    // pageId = rootId -->> exit
    if (pageId == MapValue.mMap.id)
      return;
    // 1. backup data
    if (null === MapValue.mMapo)
      MapValue.mMapo = MapValue.mMap;
    // 2. prepare data;
    self.restoreOrigin();
    var data = MapValue.mMap;
    var selectedPageData = "";

    // 3. get page data -->> selectedPageData
    // browseAllNodeForGettingData(data);
    selectedPageData = browseNodes(data, selectedPageData, pageId);

    // 4. save history
    drillDownToNode(selectedPageData);

    // 5. Load map with extracted data
    MapValue.mMap = selectedPageData;
    MapValue.cache();
    show_drilldown_nav_history();
//
  }
  //
  this.restoreOrigin = function() {
    MapValue.mMap = MapValue.mMapo;
  }
  // use selected page data to show only this page and it child on screen.
    function drillDownToNode(data) {
      // historyNode is an object stand for a page in drilldownHistory. Use for
      // map navigating back by history.
      var historyNode = {
        title : data.title,
        id : data.id,
        level : data.level,
        url : data.url
      };
      var historyListNode = [];
      var existNode = null;

      if (null !== MapValue.dHistory) {
        MapValue.dHistory.forEach(function(historyChildNode) {
          if (null !== existNode)
            return;
          historyListNode.push(historyChildNode);

          if (historyChildNode.id == data.id)
            existNode = historyChildNode;
        });

        if (null !== existNode) // node existed in history
          MapValue.dHistory = historyListNode;
        else
          MapValue.dHistory.push(historyNode);

      } else {
        // first time drilldown from HOMEPAGE
        MapValue.dHistory = [];
        MapValue.dHistory.push(historyNode);
      }
  }
  //
  function browseNodes(data, selectedPageData, pageId) {
    if (selectedPageData != "")
      return null; // has data

    if (null === data || undefined === data)
      return null;

    if (data.id == pageId) {
      // selectedPageData = data;
      return data;
    }

    if (data.children) {
      // data.children.forEach(function(dataChild) {
      // pfunc_browse_all_node_for_getting_data(dataChild, selectedPageData,
      // pageId);
      // });

      var selectedData = null;
      for (var i = 0; i < data.children.length; i++) {
        selectedData = browseNodes(data.children[i],
            selectedPageData, pageId);
        if (null !== selectedData)
          return selectedData; // break;
      }
    }
    return null;
  }
  //
  function show_drilldown_nav_history() {
    if (null === MapValue.dHistory) {
      $("#bt-drilldown-home").css("display", "none");
      return;
    } else
      $("#bt-drilldown-home").css("display", "block");

    var tracer = "";
    var navClickFunc = "extractMap('{pageId}')"
    var navDrilldownTagTemplate = "<div class='nav-drilldown-item'><img src='images/transparent.png'></div>"
        + "<div class='nav-drilldown-item nav-drilldown-tag' ng-click=\""
        + navClickFunc + "\" title='{title}'>{shortTitle}</div>";
    MapValue.dHistory.forEach(function(historyChildNode) {
      var newNode = navDrilldownTagTemplate.replace("{pageId}",
          historyChildNode.id).replace(
          "{shortTitle}",
          historyChildNode.title.substring(0, 17).trim() + ".. ("
              + historyChildNode.level + ")").replace("{title}",
          historyChildNode.title);
      tracer += newNode;
    });
    if (tracer !== "") {
      $("#nav-drilldown-group-item").html(tracer);
      $("#nav-restore-map-img").attr("src","images/restore-map-invisible.png");
      $("#nav-restore-map").attr('val', 1);
      $compile($('#nav-drilldown-group-item'))($rootScope);
      //$("#zoom-fit-to-screen").click();
    }
  }
  this.browseGettingData = function(data, selectedPageData, pageId) {
    if (selectedPageData != "")
      return null; // has data

    if (null === data || undefined === data)
      return null;

    if (data.id == pageId) {
      // selectedPageData = data;
      return data;
    }

    if (data.children) {
      // data.children.forEach(function(dataChild) {
      // pfunc_browse_all_node_for_getting_data(dataChild, selectedPageData,
      // pageId);
      // });

      var selectedData = null;
      for (var i = 0; i < data.children.length; i++) {
        selectedData = self.browseGettingData(data.children[i], selectedPageData, pageId);
        if (null !== selectedData)
          return selectedData; // break;
      }
    }
    return null;
  }
})
