webApp.service('ContainerService', function(ConfValue, MapValue, UtilsFactory, RaphaelCusService, DrillDownService, MapToXMINDFactory, $compile, $rootScope){
  /*
   * Name convention
   * abstract function => _ab_<function-name>()
   * private method => _<function-name>()
   */

  /*
   * EContainer.js
   */
  RaphaelCusService.initialized();
  function EContainer(treeRoot) {
    this.model = treeRoot;
    g_container = this;
    MapValue.gContainer = g_container;
    var svgElement = $("#" + ConfValue.SVG_ID);
    svgElement.empty();
    // calculate drawwing size again
    canvas_w = svgElement.width();
    canvas_h = svgElement.height();
      // create a Raphael instance and
    g_paper = Raphael(ConfValue.SVG_ID, canvas_w, canvas_h);
    MapValue.gPaper = g_paper;

    this.panZoom = g_paper.panZoom();
    //this.panZoom = g_paper.panzoom({ initialZoom: 0, initialPosition: { x: 0, y: 0} });
    //this.panZoom.enable();

    // There is an inconvenient rendering bug in Safari (WebKit)
    // For more detail, See: http://raphaeljs.com/reference.html#Paper.safari
    g_paper.safari();

    //this.pGroup = g_paper.setViewBox(0, 0, canvas_w);
    //this.eRoot = new ENode(model, null, this);
    //view class
    this.eRoot = this.__getENodeRoot();
    this.collapsedNodes = {};
    //level
    this.levelMax = this._getLevelMax(this.eRoot);
    this.levelMin = 0;
    this.levelCur = this.levelMax;
//    $("#nav-level-slider").slider("option", "max", this.levelMax);
//    $("#nav-level-slider").slider("option", "min", this.levelMin);
//    $("#nav-level-slider").slider("option", "value", this.levelCur);
    $("#nav-level-slider").slider({
      min: this.levelMin,
      max: this.levelMax,
      value: this.levelCur
    })
    MapValue.CUR_LEVEL = this.levelCur;
      // Marker
    this.resetAllMarkers();

    // Init
    this.totalVisitCount = 1;
    this.maxVisitCount = 1;
    this.minVisitCount = 1;
  }

  EContainer.prototype.getLinkStype = function () {
    var init = 'oval';
    return init;
  }
  EContainer.prototype._getLevelMax = function (node) {
    //console.log(node);
    var max = node.level;
    var self = this;
    node.eChildren.forEach(function(child)  {
      max = Math.max(max, self._getLevelMax(child));
    });
    return max;
  };

  EContainer.prototype.pushCollapsedNode = function (node) {
    this.collapsedNodes[node.id] = node;
  }
  EContainer.prototype.removeCollapsedNode = function (id) {
    delete this.collapsedNodes[id];
  }

  EContainer.prototype.draw = function()  {
    this.eRoot.draw();
  };

  // zoom to level
  EContainer.prototype.zoomLevel = function(level)  {
    this.panZoom.zoom(level);
  };
  // expand all node to level
  EContainer.prototype.expandLevel = function() {
    console.log("expandLevel");
    if (this.levelCur <= this.levelMax) {

      this.handleExpandLevelNode(this.eRoot);
      //increase
      if (this.levelCur + 1 <= this.levelMax) {
        this.levelCur++;
      }
    }
  };
  // 1. collapse all node to level
  EContainer.prototype.collapseLevel = function() {
    console.log("collapseLevel");
    //reduce
    if (this.levelCur - 1 >= this.levelMin) {
      this.levelCur--;
      this.handleCollapseLevelNode(this.eRoot);
    }
  };
  // 1.1. handle event collapse of one node
  EContainer.prototype.handleCollapseLevelNode = function (eNode) {
    var container = this;
    if (this.levelCur == eNode.level) {
      eNode.collapse();
    }
    eNode.eChildren.forEach(function(eChild)  {
      container.handleCollapseLevelNode(eChild);
    });
  };
  // 1.2. handle event collapse of one node
  EContainer.prototype.handleExpandLevelNode = function (eNode) {
    var container = this;
    if ( !eNode.isVisible && eNode.level <= this.levelCur ) return;
    if (this.levelCur == eNode.level) {
      eNode.expand();
    }
    eNode.eChildren.forEach(function(eChild)  {
      container.handleExpandLevelNode(eChild);
    });
  };
  EContainer.prototype.updateTotalVisitCount = function(total) {
    this.totalVisitCount = total;
  }

  // Apply session data (visitCount, marker ..) to all node child
  EContainer.prototype.applySession = function(qSession)  {
    this.minVisitCount = 0;
    // update "min/max visit" value in UI
//    ClientUIControls.eleSizeMax.text(this.maxVisitCount);
//    ClientUIControls.eleSizeMin.text(this.minVisitCount);
    this.updateTotalVisitCount(qSession.totalVisitCount);
    this.eRoot.applySession(qSession);
    this.eRoot.aggregateSession();
    this.eRoot.postApplySession();
  };
  // change color
  EContainer.prototype.applyColor = function(color) {
    this.eRoot.applyColor(color);
  }
  //
  EContainer.prototype.applyQuality = function() {
    this.eRoot.applyQuality();
  }
  //
  EContainer.prototype.removeQuality = function() {
    this.eRoot.removeQuality();
  }
  // -- refresh marker - BEGIN -----
  EContainer.prototype.toggleShowBugs = function()  {
    this.refreshBugs(!this.isShowBugs);
  };
  EContainer.prototype.toggleShowSuggestions = function() {
    this.refreshSuggesstions(!this.isShowSuggestions);
  };
  EContainer.prototype.toggleShowNotes = function() {
    this.refreshNotes(!this.isShowNotes);
  };
  EContainer.prototype.toggleShowQuestions = function() {
    this.refreshQuestions(!this.isShowQuestions);
  };
  EContainer.prototype.refreshBugs = function(isShow) {
    this.isShowBugs = isShow;
    //update svg
    this.eRoot.refreshBug();
  };
  EContainer.prototype.refreshSuggesstions = function(isShow) {
//    var element = ClientUIControls.markerImageSuggestion;
    this.isShowSuggestions = isShow;
//  //  var imgName = "resources/css/images/blue.png";
//  //  if (this.isShowSuggestions){
//  //    imgName = "resources/css/images/blue-check.png";
//  //  }
//    var imgName = $constant.get('MarkerIcon').Suggestions;
//    if (this.isShowSuggestions){
//      imgName = $constant.get('MarkerIcon').Suggestions_Check;
//    }
//    element.attr("src", imgName);

    this.eRoot.refreshSuggesstion();
  };
  EContainer.prototype.refreshNotes = function(isShow)  {
//    var element = ClientUIControls.markerImageNote;
    this.isShowNotes = isShow;
//  //
//  //  var imgName = "resources/css/images/orange.png";
//  //  if (this.isShowNotes){
//  //    imgName = "resources/css/images/orange-check.png";
//  //  }
//
//    var imgName = $constant.get('MarkerIcon').Notes;
//    if (this.isShowNotes){
//      imgName = $constant.get('MarkerIcon').Notes_Check;
//    }
//    element.attr("src", imgName);

    this.eRoot.refreshNote();
  };
  EContainer.prototype.refreshQuestions = function(isShow)  {
//    var element = ClientUIControls.markerImageQuestion;
    this.isShowQuestions = isShow;
//
//  //  var imgName = "resources/css/images/pink.png";
//  //  if (this.isShowQuestions){
//  //    imgName = "resources/css/images/pink-check.png";
//  //  }
//    var imgName = $constant.get('MarkerIcon').Questions;
//    if (this.isShowQuestions){
//      imgName = $constant.get('MarkerIcon').Questions_Check;
//    }
//    element.attr("src", imgName);

    this.eRoot.refreshQuestion();
  };

  // reset all state of marker to default state (false?)
  EContainer.prototype.resetAllMarkers = function() {
    // markers
    var defaultSetting = ConfValue.DEFAULT;

    this.isShowBugs = defaultSetting.showBugs;
    this.isShowSuggestions = defaultSetting.showSuggestions;
    this.isShowNotes = defaultSetting.showNotes;
    this.isShowQuestions = defaultSetting.showQuestions;

    this.refreshBugs(this.isShowBugs);
    this.refreshSuggesstions(this.isShowSuggestions);
    this.refreshNotes(this.isShowNotes);
    this.refreshQuestions(this.isShowQuestions);
  };
  // -- refresh marker - END -----

  //abstract methods
  EContainer.prototype.__getENodeRoot = function()  {};

  // ----- Add 2014-06-27 -----
  EContainer.prototype.findENode = function(nodeId)  {
    return this.eRoot.findENode(nodeId);
  };
  // ----- Add 2014-06-27 -----


  /*
   * ENode.js
   *
   * TODO: class definition
   *
   * Usage: store all page data and processing method for one node
   *
   */
  function ENode(model, parent, eContainer) {

    this.eParent = parent;
    this.eContainer = eContainer;

    this.id = model.id;
    this.title = model.title;
    this.url = model.url; // added on 2014-03-13
    this.x = model.x;
    this.y = model.y;
    this.orgX = 0;
    this.orgY = 0;
    this.level = model.level;
    this.aggregationSession;
    //title
    this.title = model.title;
    this.pageSummary = {};
    var n = 16;
    var suffix = "..";
    this.isShort = this.title.length>n;
    this.shortTitle = this.isShort ? this.title.substr(0,n-1)+ suffix : this.title;

    this.eChildren = new Array();
    this.eLinks = new Array();
    this.parentLink = null;
    this.eGroup = null;

    this.expanded = true;
    this.isVisible = true;
    this.isShowInformation = false;
    // QNha 2013-12-26
    this.isRight = model.isRight;

    var self = this;
    // get children from inputModel and generate data for eChildren and eLink
    if (model.children) {
      model.children.forEach(function(eModel) {
        //child elements
        //var eChildNode = new ENode(eModel, self, self.eContainer);
        var eChildNode = self.__createNewChild(eModel);
        self.eChildren.push(eChildNode);

        //child links
        var eLink = new ELink(self, eChildNode);
        self.eLinks.push(eLink);
        eChildNode.parentLink = eLink;
      });
    }
    this._initView();
  };
  ENode.prototype._initView = function()  {
    this.eGroup = this.__createEGroup();
    //markers
  //  this.eMarker = new EMarker(this);
    this.eMarker = this.__createEMarker();
  };


  // Draw canvas element and move if necessary
  // TODO: this is not "DRAW" function, this is only "UPDATE" function.
  // "DRAW" is not a event or function of RaphaelJS canvas.
  ENode.prototype.draw = function () {
    MapValue.listTitles.push({title: this.shortTitle, fullTitle: this.title, id: this.id});
    this.eGroup.draw();
    this.moveElements();
    this.eMarker.draw();
    this.eChildren.forEach(function (eChild, index) {
      eChild.draw();
    });
  };
  // Move canvas element for people interactive (update position, scale, ..)
  ENode.prototype.moveElements = function () {
    this.eGroup.moveElements();
    this.eMarker.moveElements();
    //update parent link
    if (this.parentLink)  {
      this.parentLink.draw();
    }
  };
  ENode.prototype.drawChildLinks = function() {
    //draw childs
    this.eLinks.forEach(function (eLink, index) {
      eLink.draw();
    });
  };
  // Apply session data to this ENode
  // ENode.prototype.resetTmp = function () {
  //   this.tmp = {
  //     bugCount: 0,
  //     concernCount: 0,
  //     noteCount: 0,
  //     questionCount: 0,
  //     visitCount: 0
  //   }
  // }
  ENode.prototype.applySession = function (qSession) {

    this.pageSummary = qSession.getPageSummaryById(this.id);
    // this.resetTmp();
    this.eGroup.applySession();
    if (this.parentLink)  {
      this.parentLink.applySession();
    }

    //update marker
    this.eMarker.applySession();

    this.eChildren.forEach(function(eChild) {
      eChild.applySession(qSession);
    });
  };
  // apply color
  ENode.prototype.applyColor = function(color) {
    var red = color.red;
    var green = color.green;
    var blue = color.blue;
    this.eGroup.applySession(red, green, blue);
    this.eChildren.forEach(function(eChild) {
      var color = {
        red: red,
        green: green,
        blue: blue
      };
      eChild.applyColor(color);
    })
  }
  ENode.prototype.postApplySession = function () {
    var nodes = this.eContainer.collapsedNodes;
    for( key in nodes ){
      if( nodes.hasOwnProperty(key) ) {
        nodes[key].eMarker.restoreMarkers();
        nodes[key].refreshMarkersOfOneNode();
      }
    }
  }
  ENode.prototype.aggregateSession = function () {
    var sum = {};
    if(typeof this.eChildren == "undefined" || this.eChildren.length == 0){
      this.aggregationSession = this.cloneSession(this.pageSummary);
      return this.aggregationSession;
    }else{
      sum = this.cloneSession(this.pageSummary);
      for(var i = 0; i < this.eChildren.length; i++){
        eChild = this.eChildren[i];
        sum = this.sumSession(sum,eChild.aggregateSession());
      }
      this.aggregationSession = sum;
      return this.aggregationSession;
    }
  }
  ENode.prototype.cloneSession = function(session){
    if (typeof session == 'undefined' || session == null) {
      return {
        bugCount: 0,
        concernCount: 0,
        noteCount: 0,
        questionCount: 0,
        visitCount: 0
      }
    }
    return {
      bugCount: session.bugCount,
      concernCount: session.concernCount,
      noteCount: session.noteCount,
      questionCount: session.questionCount,
      visitCount: session.visitCount
    }
  }
  ENode.prototype.sumSession = function(sessionA,sessionB){
    return {
      bugCount: sessionA.bugCount + sessionB.bugCount,
      concernCount: sessionA.concernCount + sessionB.concernCount,
      noteCount: sessionA.noteCount + sessionB.noteCount,
      questionCount: sessionA.questionCount + sessionB.questionCount,
      visitCount: sessionA.visitCount + sessionB.visitCount
    }
  }
  ENode.prototype.checkIsRoot = function () {
    // First page in data list
    if (this.level == MapValue.mMap.level) {
      return true;
    }
    return false;
  };

  // -- Moving --
  ENode.prototype.moveEnd = function()  {

    // TODO: 2013-12-30: Move to $("#nav-save-map").click(function() {}); in "project_client.js"
    //pfunc_project_update_page_map(this.id, this.x, this.y, this.isExpand);

    this.eChildren.forEach(function (eChild, index) {
      eChild.moveEnd();
    });
  };
  ENode.prototype.moveStart = function()  {
    this.orgX = 0;
    this.orgY = 0;
    if (this.checkIsRoot()) {
      g_container.panZoom.startMoving();
    } else  {
      this.eChildren.forEach(function (eChild, index) {
        eChild.moveStart();
      });
    }
  };
  // Move node position
  ENode.prototype.moving = function (dx, dy) {

    //use for blocking drag while expanding
    if (MapValue.IS_NODE_EXPAND)
    {
      return;
    }

    var x = dx - this.orgX;
    var y = dy - this.orgY;
    this.orgX = dx;// - this.orgX;
    this.orgY = dy;// - this.orgY;
    this.move(x, y);
  };

  // expand/collapse: these method use a function that will be develop on ENode's inherited class
  // Expand/collapse children of this node

  ENode.prototype.expandCollapseChildren = function () {
    // record collapsed node
    if ( this.expanded ) {
      this.eContainer.pushCollapsedNode(this);
    } else {
      this.eContainer.removeCollapsedNode(this.id);
    }
    this.expanded = !this.expanded;

    this.eGroup.changeCircleStyle(this.expanded);

    var self = this;
    self.toggleAggregationNode();
    this.eChildren.forEach(function(eChild) {
      if (self.expanded)  {
        eChild.actionExpandFromNode(self);
      } else  {
        eChild.actionCollapseToNode(self);
      }
    });

  };
  ENode.prototype.toggleAggregationNode = function(){
    this.eMarker.toggleAggregateSession();
    this.refreshMarkersOfOneNode();
  }
  ENode.prototype.actionCollapseToNode = function(x, y) {
    this.isVisible = false;

    //use for blocking drag while expanding
    MapValue.IS_NODE_EXPAND = false;

    this._actionCollapseSingleToPoint(x, y);

    if (this.expanded)  {
      this.eChildren.forEach(function(eChild) {
        eChild.actionCollapseToNode(x, y);
      });
    }
  };
  ENode.prototype.actionExpandFromNode = function(eNode)  {
    this.isVisible = true;

    //use for blocking drag while expanding
    MapValue.IS_NODE_EXPAND = true;

    this._actionExpandSingleFromNode(eNode);
    if (this.expanded)  {
      this.eChildren.forEach(function(eChild) {
        eChild.actionExpandFromNode(self);
      });
    }
  };
  ENode.prototype._actionCollapseSingleToPoint = function(x, y) {

    this.eGroup.animateCollapseToNode(x, y);
    if (this.parentLink)  {
      this.parentLink.animateCollapseToNode(x, y);
    }
    this.eMarker.draw();
  };
  ENode.prototype._actionExpandSingleFromNode = function(eNode) {

    this.eGroup.animateExpandFromNode(eNode);
    if (this.parentLink)  {
      this.parentLink.animateExpandFromNode(eNode);
    }
    this.eMarker.draw();
  };

  // Expand children of this node
  ENode.prototype.expand = function () {
      // TODO: duplicate code with ENode.prototype.expandCollapseChildren()
    var self = this;
    if ( self.expanded ) return;
    this.expanded = true;
    self.eContainer.removeCollapsedNode(self.id);
    self.toggleAggregationNode();
    this.eChildren.forEach(function(eChild, index)  {
      eChild.actionExpandFromNode(self);
    });

    this.eGroup.changeCircleStyle(this.expanded);
  };
  // Collapse children of this node
  ENode.prototype.collapse = function () {
      // TODO: duplicate code with ENode.prototype.expandCollapseChildren()
    var self = this;
    if ( !self.expanded ) return;
    self.expanded = false;

    self.eContainer.pushCollapsedNode(self);
    self.toggleAggregationNode();
    this.eChildren.forEach(function(eChild, index)  {
      eChild.actionCollapseToNode(self);
    });

    this.eGroup.changeCircleStyle(this.expanded);
  };

  // get root node stored in this ENode
  ENode.prototype.getRootNode = function(eModel)  {
    if (this.checkIsRoot()) {
      return this;
    }
    return this.eContainer.eRoot;
  };
  ENode.prototype._getCenterPoint = function()  {
    var point = {
        //x : this.x + node_w / 2,
        //y : this.y + node_h / 2
        x : this.x + this.getWidth() / 2,
        y : this.y + this.getHeight() / 2
    };
    return point;
  };
  ENode.prototype.getWidth = function(){
  //  if (this.level > MAX_LEVEL_HAVE_DIFFERENT_SIZE)
  //    return node_w;
  //  return node_w * (1 + 1/(1 + this.level));
    return UtilsFactory.getWidth(this.level);
  };
  ENode.prototype.getHeight = function()  {
  //  if (this.level > MAX_LEVEL_HAVE_DIFFERENT_SIZE)
  //    return node_h;
  //  return node_h * (1 + 1/(1 + this.level));
    return UtilsFactory.getHeight(this.level);
  };
  ENode.prototype.getOpacity = function() {
    //var maxVisitCount = ClientFunction.max_vist_count || this.eContainer.maxVisitCount || 1;
    var maxVisitCount = MapValue.maxVisitCount || 1;
    if (this.pageSummary) {
      var result;
      if( this.tmp ) {
        result = Math.min(this.pageSummary.visitCount, this.tmp.visitCount) / maxVisitCount;
      }else{
        result = this.pageSummary.visitCount / maxVisitCount;
      }
      return Math.min(1,result);
    } else  {
      return 0;
    }
  };
  // ENode.prototype.getCollapsedOpacity = function() {
  //   if( !this.eMarker.toggleAgg ) {
  //     var opacity = this.aggregationSession.visitCount / this.eContainer.maxVisitCount
  //     return Math.min(1,opacity);
  //   } else {
  //     return this.getOpacity();
  //   }
  // }
  // markers
  ENode.prototype.refreshMarkersOfOneNode = function(){
    var marker = this.eMarker;
    var group = this.eGroup;
    var opacity = this.getOpacity();
    if ( this.pageSummary ) {
      marker.pBug.draw();
      marker.pSuggestion.draw();
      marker.pNote.draw();
      marker.pQuestion.draw();
    }
    group.applySession();
  }
  ENode.prototype.refreshBug = function() {
    this.refreshMarkers();
  };
  ENode.prototype.refreshSuggesstion = function() {
    this.refreshMarkers();
  };
  ENode.prototype.refreshNote = function()  {
    this.refreshMarkers();
  };
  ENode.prototype.refreshQuestion = function()  {
    this.refreshMarkers();
  };
  ENode.prototype.refreshMarkers = function() {
    this.eMarker.draw();
    this.eChildren.forEach(function(eChild) {
      eChild.refreshMarkers();
    });
  };
  ENode.prototype.showInformation = function()  {
    show_node_information(this);
    showCandadateParents(this);
  };

  // ------ Abstract methods - BEGIN ------
  // Abstract methods: will be used in child class
  ENode.prototype.__createNewChild = function(eModel) {};
  ENode.prototype.__createEGroup = function() {};
  ENode.prototype.__createEMarker = function() {};
  ENode.prototype.move = function (dx, dy) { };
  // Point Line1: this is end-point of line connect from parent to this node
  ENode.prototype.getPointLine1 = function () { };
  // Point Line2: this is start-point of lines connect from this node to all children
  ENode.prototype.getPointLine2 = function()  {};
  // ------ Abstract methods - BEGIN ------

  //---- Add 2014-06-27 -----
  ENode.prototype.findENode = function(nodeId)
  {
    var self = this;
    if (self.id === nodeId)
      return self;
    var result = null;
    var isFoundNode = false;
    self.eChildren.forEach(function(eChild)  {
      if (isFoundNode)
        return;

      result = eChild.findENode(nodeId);
      if (null !== result)
        isFoundNode = true;

    });
    return result;
  };

  ENode.prototype.selectThisNode = function()
  {
    var self = this;
    //this.eGroup.pRect["0"].classList.remove("selected-node");
    self.eGroup.pRect["0"].classList.add("selected-node");
    var interval = setInterval(function()
    {
      self.eGroup.pRect["0"].classList.remove("selected-node");
      window.clearInterval(interval);
    }, 3000);
  };
  ENode.prototype.applyQuality = function() {
    this.eGroup.pRect["0"].classList.remove("quality-node");
    this.eGroup.pRect["0"].classList.add("quality-node");
    this.eChildren.forEach(function(eChild){
      eChild.applyQuality();
    })
  }
  ENode.prototype.removeQuality = function() {
    this.eGroup.pRect["0"].classList.remove("quality-node");
    this.eChildren.forEach(function(eChild){
      eChild.removeQuality();
    })
  }
  ENode.prototype.unselectThisNode = function()
  {
    var self = this;
    self.eGroup.pRect["0"].classList.remove("selected-node");
  };


  //---- Add 2014-06-27 -----

  /*
   * EGroup.js
   *
   * TODO: class definition
   *
   * Usage: show eNode data to UI by using RaphaelJS element (text, rect, tooltip, link, expand/collase circle,..)
   *
   */
  function EGroup(eNode)  {
    this.eNode = eNode;
    this.pGroup = g_paper.set(); // Create a visual group of RaphaelJS, use for people interactive on view
    this._initView();
  }
  EGroup.prototype._initView = function() {

    var isRightClick = false;
    var self = this;
    var func_node_onMove = function(dx, dy, x, y ,evt)  {
      if( isRightClick ) return;
      self.moving(dx, dy);
      evt.preventDefault();
      return false;
    };
    var func_node_onStart = function(x, y ,evt) {
      g_container.panZoom.enableDrag = false;
      g_container.panZoom.enableDblClick = false;

      console.log("func_node_onStart: " + x + " _: " + y);
      self.moveStart();
    };
    var func_node_onEnd = function(x, y ,evt) {
      console.log("func_node_onEnd");
      g_container.panZoom.enableDrag = true;
      g_container.panZoom.enableDblClick = true;
      self.moveEnd();
      isRightClick = false;
      //console.log("func_node_onEnd: " + x + " _: " + y);
    };

    // rectangle element
    this.pRect = g_paper.rect(0,0,0,0, 5);
    var isRight = this.eNode.isRight ? "nodeRight" : "nodeLeft";
    if (isRight === "right")
      console.log("IsNodeRight");
    var classNameByLevel = " node-level-" + this.eNode.level + " " + isRight;
    var rectId = "pageId-" + self.eNode.id; // id for rectangle

    this.pRect
      .attr("x", 0).attr("y", 0)
      .attr("width", this.eNode.getWidth())
      .attr("height", this.eNode.getHeight())
      .mousedown(mousedownHandler)
      .drag(func_node_onMove, func_node_onStart, func_node_onEnd)

      // QNha 2013-12-26
      .setAttr("class", "node-rect" + classNameByLevel)
      .setAttr("id", rectId);


      // text element
    this.pText = g_paper.text(0,0,"").attr("text-anchor", "middle")
      //.attr("x", node_w / 2).attr("y",  + node_h / 2)
      .attr("x", this.eNode.getWidth() / 2).attr("y",  + this.eNode.getHeight() / 2)
      .mousedown(mousedownHandler)
      .drag(func_node_onMove, func_node_onStart, func_node_onEnd)

      //QNha - Set font by level
      .attr("font", UtilsFactory.getFontSize(this.eNode.level) +'px "Arial"');

    this.pText.setAttr("class", "node-text");

    //
    function mousedownHandler(e){
      if( e.which == 3) {
        isRightClick = true;
      }
    }
    // Tooltip
    $(this.pRect.node).qtip({
      content: self.eNode.title,
        position: {
            target: "mouse",
            adjust: {
                   //mouse: false
                   x: 10,
                   y: 10
              }  // Offset it slightly from under the mouse
        }
    });
    $(this.pText.node).qtip({
      content: self.eNode.title,
        position: {
            target: "mouse",
            adjust: {
                  //mouse: false
              x: 10,
              y: 10
            } // Offset it slightly from under the mouse
        }
    });



    // circle of expand/collapse
    this.pGroupCircle = null;
    if (this.eNode.eChildren) {

      if (this.eNode.eChildren.length > 0)  {
        var func_circle_onClick = function(evt) {
//          console.log("func_circle_onClick");
          self.eNode.expandCollapseChildren();
          //console.log("func_node_onEnd: " + x + " _: " + y);
        };

        var radius = 5;
        this.pGroupCircle = g_paper.set();
        this.pCircle = g_paper.circle(0, 0, radius);
        this.pCircleText = g_paper.text(0,0, "-").attr("text-anchor", "middle");
        this.pCircle.click(func_circle_onClick);
        this.pCircleText.click(func_circle_onClick);

        this.pGroupCircle.push(this.pCircle);
        this.pGroupCircle.push(this.pCircleText);
      }

    }

      // Information icon
    this.pInformation = g_paper.image("images/info-details.png", 0, 0, 18, 18);
    this.pInformation.attr("x", 4).attr("y",  + this.eNode.getHeight() / 2 - 12);
    //this.pInformation.attr("xlink:href", "images/info-details.png"); // 2014-07-8 - for create PNG image
    this.pInformation.hide();

    // Add all visual element to this Group
    this.pGroup.push(this.pRect);
    this.pGroup.push(this.pText);
    this.pGroup.push(this.pInformation);

    // QNha 2014-01-13
    // TODO: notice that when "dblclick", "click" event will be fire.
    this.pGroup.click(function() {
          // unused
    });
    this.pGroup.dblclick(function() {
          // Call Drilldown function
      DrillDownService.extractMap(self.eNode.id);
    });

    this.pGroup.mouseover(function()  {
      self.pInformation.show();
    });

    this.pGroup.mouseout(function() {
      if(self.eNode.isShowInformation) return;
      self.pInformation.hide();
    });

    this.pInformation.click(function()  {
      console.log("pInformation.click");
      self.eNode.showInformation();
      self.eNode.isShowInformation = true;
      var x = self.eNode.eGroup.pInformation.getBBox().x;
      var y = self.eNode.eGroup.pInformation.getBBox().y;
      var width = self.eNode.eGroup.pInformation.getBBox().width;
      var height = self.eNode.eGroup.pInformation.getBBox().height;
      // Temporary call
      MapValue.container.panZoom.showNodeInformation(x, y, width, height);
      self.pInformation.show();

    });
    self.pInformation.hide();
  };
  // Apply session data to visual element
  EGroup.prototype.applySession = function(red, green, blue) {
      // TODO
      // Mix color for rectangle
    var redColor = red || MapValue.NODE_COLOR.red;
    var greenColor = green || MapValue.NODE_COLOR.green;
    var blueColor = blue || MapValue.NODE_COLOR.blue;
    var opacity = this.eNode.getOpacity();
    var resultMixColorRect = UtilsFactory.mixColor(redColor, greenColor, blueColor, opacity, 255, 255, 255, 1);
    var attrFillRect = "rgba(" + resultMixColorRect.r + ", " + resultMixColorRect.g + ", " + resultMixColorRect.b + ", " + resultMixColorRect.a + ")";

    var resultMixColorText = UtilsFactory.mixColor(255, 255, 255, opacity > 0.5 ? 1: 0 , 0, 0, 0, 1);
    var attrFillText = "rgba(" + resultMixColorText.r + ", " + resultMixColorText.g + ", " + resultMixColorText.b + ", " + resultMixColorText.a + ")";
    var styleId = MapToXMINDFactory.pushStyle('#'+toHex(resultMixColorRect.r, resultMixColorRect.g, resultMixColorRect.b));
    MapToXMINDFactory.pushNodeHash(this.eNode.id, styleId);
    this.pRect.setAttr("fill", attrFillRect);
    this.pText.setAttr("fill", attrFillText);
  };
  EGroup.prototype.draw = function()  {
    // TODO: notic this is not "DRAW". this is only set data for EGroup's child element
    var self = this;
    this.pText.attr("text", this.eNode.shortTitle);
    if (this.eNode.isShort) {
        // TODO: what will happen if title is longer than limit value (see ENode() constructor)
    }
  };
  EGroup.prototype.moveStart = function () {
    this.eNode.moveStart();
  };
  EGroup.prototype.moveEnd = function() {
    this.eNode.moveEnd();
  };

  // Move Group position
  EGroup.prototype.moving = function (dx, dy) {
    this.eNode.moving(dx, dy);
  };
  EGroup.prototype.changeCircleStyle = function(expanded) {
    //console.log("changeCircleStyle");
    if (this.pCircle) {
      var cssName = "";
      if (expanded) {
        cssName = "-";
      } else  {
        cssName = "+";
      }
      this.pCircleText.attr("text", cssName);
    }
  };

  // ------ Abstract methods - BEGIN ------
  // Abstract methods: will be used in child class
  EGroup.prototype.moveElements = function()  {};
  EGroup.prototype.animateCollapseToNode = function (eNode) {};
  EGroup.prototype.animateExpandFromNode = function (eNode) {};



  /*
   * ELink.js
   *
   * TODO: class definition
   *
   * Usage: linker of a node to another node, from parent to children
   *
   */
  function ELink(eNode, eChildNode) {
    this.eNode = eNode;
    this.eChildNode = eChildNode;
    this._initView();
  }
  // Apply session data to linker
  ELink.prototype.applySession = function () {
    var attrStroke = "#FFFFFF";
    this.pPath.setAttr("stroke", attrStroke);
  };
  ELink.prototype._initView = function()  {
    this.pPath = g_paper.path(""); // create Raphael path element, without caption
  };
  ELink.prototype.draw = function() {
    var style = this.eNode.eContainer.getLinkStype();
    var pathString = g_paper.connection(this.eNode.getPointLine2().x, this.eNode.getPointLine2().y, this.eChildNode.getPointLine1().x, this.eChildNode.getPointLine1().y)[style];
    this.pPath.attr("path", pathString);
  };
  // Animation on collpase/expand node
  ELink.prototype.animateCollapseToNode = function (eNode)  {
    var x = eNode.getPointLine2().x;
    var y = eNode.getPointLine2().y;
    var newPath = "M" + x + "," + y + "L" + x + "," + y;
    var elattrs = [{path:newPath, opacity:0}];
    var now = 1;
    var self = this;
    this.pPath.stop().animate(elattrs[+(now = !now)], ConfValue.DEFAULT_EXPAND_COLLAPSE_ANIMATE, ConfValue.DEFAULT_COLLAPSE_ANIMATE_TYPE,             function()  {
      self.pPath.hide();
    });

  };
  ELink.prototype.animateExpandFromNode = function (eNode)  {
    var style = this.eNode.eContainer.getLinkStype();
    var newPath = g_paper.connection(this.eNode.getPointLine2().x, this.eNode.getPointLine2().y, this.eChildNode.getPointLine1().x, this.eChildNode.getPointLine1().y)[style];
    var elattrs = [{path:newPath, opacity:1}];
    var now = 1;
    this.pPath.show();
    this.pPath.stop().animate(elattrs[+(now = !now)], ConfValue.DEFAULT_EXPAND_COLLAPSE_ANIMATE, ConfValue.DEFAULT_EXPAND_ANIMATE_TYPE);
  };


  /*
   * EMarker.js
   *
   * TODO: class definition
   *
   * Usage: marker visual of this node: Bug/Question/Node/Suggestion/..
   *
   */
  function EMarker(eNode) {
    //this.toggleAgg = true;
    this.eNode = eNode;
    this.pBug = new EMarkerItem(this, 1);
    this.pSuggestion = new EMarkerItem(this, 2);
    this.pNote = new EMarkerItem(this, 3);
    this.pQuestion = new EMarkerItem(this, 4);
  }
  // Notice: Please see "ENode.prototype.draw()" comment.
  // Draw visual element
  EMarker.prototype.draw = function() {
    /*console.log("draw marker"); */
    if (this.eNode.isVisible)
      this.moveElements();
    else
    {
      /*console.log("draw marker Hide");*/
      this.hide();
    }
  };
  // Notice: Please see "ENode.prototype.moveElements()" comment.
  // Move visual element
  EMarker.prototype.moveElements = function () {
    this.pBug.draw();
    this.pSuggestion.draw();
    this.pNote.draw();
    this.pQuestion.draw();
  //  this.pBug.moveElements();
  //  this.pSuggestion.moveElements();
  //  this.pNote.moveElements();
  //  this.pQuestion.moveElements();
  };
  EMarker.prototype.hide = function() {
    this.pBug.hide();
    this.pSuggestion.hide();
    this.pNote.hide();
    this.pQuestion.hide();
  };

  EMarker.prototype.applySession = function () {
    if (this.eNode.pageSummary) {
      if (this.eNode.pageSummary.bugCount != this.pBug.count) {
        this.pBug.count = this.eNode.pageSummary.bugCount;
      }
      if (this.eNode.pageSummary.concernCount != this.pSuggestion.count)  {
        this.pSuggestion.count = this.eNode.pageSummary.concernCount;
      }
      if (this.eNode.pageSummary.questionCount != this.pQuestion.count) {
        this.pQuestion.count = this.eNode.pageSummary.questionCount;
      }
      if (this.eNode.pageSummary.noteCount != this.pNote.count) {
        this.pNote.count = this.eNode.pageSummary.noteCount;
      }
      this.moveElements();
    } else {
      this.pBug.count = 0;
      this.pSuggestion.count = 0;
      this.pQuestion.count = 0;
      this.pNote.count = 0;
      this.hide();
    }

  };
  // reload marker when change time range
  EMarker.prototype.restoreMarkers = function () {
    this.eNode.tmp = this.eNode.cloneSession(this.eNode.pageSummary);
    this.eNode.pageSummary = this.eNode.aggregationSession;
    this.pBug.count = this.eNode.pageSummary.bugCount;
    this.pSuggestion.count = this.eNode.pageSummary.concernCount;
    this.pQuestion.count = this.eNode.pageSummary.questionCount;
    this.pNote.count = this.eNode.pageSummary.noteCount;
  }
  EMarker.prototype.reloadMarkers = function () {
    var pageSum = this.eNode.pageSummary;
    var session = this.eNode.aggregationSession;

    if ( !pageSum ) return;
    if ( !this.eNode.expanded ) {
      this.eNode.tmp = pageSum;
      this.eNode.pageSummary = session;
    } else {
      this.eNode.pageSummary = this.eNode.tmp;
    }
    this.pBug.count = this.eNode.pageSummary.bugCount;
    this.pSuggestion.count = this.eNode.pageSummary.concernCount;
    this.pQuestion.count = this.eNode.pageSummary.questionCount;
    this.pNote.count = this.eNode.pageSummary.noteCount;
  }
  EMarker.prototype.toggleAggregateSession = function() {
    this.reloadMarkers();
    //this.toggleAgg = !this.toggleAgg;
  }
  function EMarkerItem(eMarker, type) {
    this.eMarker = eMarker;
    this.type = type;
    this.count = 0;
    this.w = 32;
    this.h = 32;

     //1 == (BUG), 2 == SUGGESTION, 3 == NOTE, 4 == QUESTION
    //caculate image name
    this.imageName = "ic_bug.png";
    switch (this.type) {
      case 2:
        this.imageName = "ic_suggestion.png";
        break;
      case 3:
        this.imageName = "ic_note.png";
        break;
      case 4:
        this.imageName = "ic_question.png";
        break;
      default:
        break;
    }
      // TODO: in the future will use this code (after 2014-02-12)
  //  this.imageName = $constant.get('MarkerIcon').Bugs;
  //  switch (this.type) {
  //    case 2:
  //      this.imageName = $constant.get('MarkerIcon').Suggestions;
  //      break;
  //    case 3:
  //      this.imageName = $constant.get('MarkerIcon').Notes;
  //      break;
  //    case 4:
  //      this.imageName = $constant.get('MarkerIcon').Questions;
  //      break;
  //    default:
  //      break;
  //  }
  //
    //init element
    this.pGroup = g_paper.set();
    var padding = ConfValue.NODE_W / 4;
    var x = (this.type - 1) * padding;
    var y = -23;

    //image
    this.imageName = "images/" + this.imageName; // use full icon
    this.pImage = g_paper.image(this.imageName, x, y, this.w, this.h);
    //this.pImage.attr("xlink:href", this.imageName); // 2014-07-8 - for create PNG image
    //this.pCounter = g_paper.text(x + this.w / 3, this.h/ 2, "");
    this.pCounter = g_paper.text(x + this.w / 2, y + this.h / 3, "");
    //style="text-anchor: middle;"
    this.pGroup.push(this.pImage);
    this.pGroup.push(this.pCounter);
  };
  // Notice: Please see "ENode.prototype.draw()" comment.
  // Draw visual element
  EMarkerItem.prototype.draw = function() {
    //this.pGroup.transform("t" + this.eMarker.eNode.x + "," + this.eMarker.eNode.y);
    this.moveElements();
    var self = this;
    if (this.count > 0) {
      if (this.checkIsShow() == true && this.eMarker.eNode.isVisible) {
        this.pCounter.attr("text", this.count);
        this.pGroup.show();
        this.pGroup.animate({
          opacity: 1
          }, 100, function() {
            self.pGroup.show();
          });

      } else  {
        this.pCounter.attr("", this.count);
        //this.pGroup.hide();
        this.pGroup.animate({
          opacity: 0
          }, 100, function() {
            self.pGroup.hide();
          });
      }
    } else  {
      this.pCounter.attr("", this.count);
      this.pGroup.hide();
    }
  };
  // Notice: Please see "ENode.prototype.moveElements()" comment.
  // Move visual element
  EMarkerItem.prototype.moveElements = function() {
    this.pGroup.transform("t" + this.eMarker.eNode.x + "," + this.eMarker.eNode.y);
  };
  EMarkerItem.prototype.hide = function() {

    //this.pGroup.hide();
    var self = this;
    this.pGroup.animate({
      opacity: 0
      }, 100, function() {
        self.pGroup.hide();
      });
  };
  EMarkerItem.prototype.checkIsShow = function()  {
    switch (this.type) {
    case 1:
      return this.eMarker.eNode.eContainer.isShowBugs;
    case 2:
      return this.eMarker.eNode.eContainer.isShowSuggestions;
    case 3:
      return this.eMarker.eNode.eContainer.isShowNotes;
    default:
      return this.eMarker.eNode.eContainer.isShowQuestions;
    }
  };

  // helper function - for ENode's inherited class
  // get new Translate string position for translate node (moving,..)
  function helper_fn_getTranslateStr(x, y)  {
    return "t" + x + "," + y;
  };
  //
  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame || function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
  })();

  // Resize SVG when resizing windows
  window.onresize = function(event) {
    var svgElement = $("#div-svgid");
    canvas_w = svgElement.width();
    canvas_h = svgElement.height();
    g_paper.setSize(canvas_w, canvas_h);
    //g_paper.setSize(canvas_w, canvas_h);
    var viewBoxWidth = g_paper.width * g_container.panZoom.getZoomRatio();
    var viewBoxHeight =  g_paper.height * g_container.panZoom.getZoomRatio();
    g_paper.setViewBox(g_container.panZoom.curPos.x, g_container.panZoom.curPos.y, viewBoxWidth, viewBoxHeight);
    g_container.panZoom.nW = viewBoxWidth;
    g_container.panZoom.nH = viewBoxHeight;
  };

  var showCandadateParents = function(node) {
    var listNodes = [];
    var listRemoveIds = [];
    var images = '<img src="images/ic_check.png">';
    if(node.eParent) {
      $('#node-name').html(node.eParent.shortTitle);
      listRemoveIds.push(node.eParent.id);
      listNodes.push({shortTitle: node.eParent.shortTitle, id: node.eParent.id});
    } else {
      $('#node-name').html('no parent');
    }
    $('.page-parent-list').html('');
    listRemoveIds.push(node.id);
    listNodes = listNodes.concat(traversalMap(node.eContainer.eRoot, listRemoveIds));
    for(var i = 0; i < listNodes.length; i++) {
      if(i !== 0) images = '&nbsp&nbsp&nbsp&nbsp';
      $('.page-parent-list').append('<li class="node-item" ng-click="modifyParent(\''+node.id+'\',\''+listNodes[i].id+'\')"><div class="page-parent-list-item">'+images+'<span> '+listNodes[i].shortTitle+'</span></div></li>');
    }
    $compile($('.page-parent-list'))($rootScope);
  }
  var traversalMap = function(root, eliminatedIds ) {
    var list = []
        ,queue = [];
    queue.push(root);
    while(queue.length) {
      var elem = queue.shift();
      if(eliminatedIds.indexOf(elem.id) === -1) list.push({shortTitle: elem.shortTitle, id: elem.id});
      for(var i = 0; i < elem.eChildren.length; i++) {
        queue.push(elem.eChildren[i]);
      }
    }
    return list;
  }
  var show_node_information = function(node) {
    var visitCount = 0,
        bugCount = 0;
    if(node.pageSummary) {
      bugCount = node.pageSummary.bugCount;
      visitCount = node.pageSummary.visitCount;
    }
    $(".view").wrap('<div id="overlay" style="width:100%; height: 100%; z-index:20"></div>');
    $("#overlay").click(function(){
      $('.view').unwrap();
      $("#page-info-popup").hide();
      node.isShowInformation = false;
      node.eGroup.pInformation.hide();
    })
    $("body").prepend($("#page-info-popup"));
    $("#page-info-popup").show();
    $(".page-info-title").text(node.title);
    $(".page-info-url").text(node.url);
    $(".page-info-layer").text(node.level + 1);
    $(".page-info-visit").text(visitCount);
    $(".page-info-bug").text(bugCount);
  }
  this.initialized = function(){
    return{
      EContainer: EContainer,
      ELink: ELink,
      EGroup: EGroup,
      ENode: ENode,
      EMarker: EMarker,
      EMarkerItem: EMarkerItem
    }
  }

})
