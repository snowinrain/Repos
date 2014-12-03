webApp.service('ContainerHorizontalService', function(UtilsFactory, MapValue, ConfValue, ContainerService) {
  var E = ContainerService.initialized(),
      EContainer = E.EContainer,
      EGroup = E.EGroup,
      ENode = E.ENode,
      EMarker = E.EMarker,
      EMarkerItem = E.EMarkerItem;
  function EContainerHorizontal(qservice) {
    EContainer.call(this, qservice);
  }
  EContainerHorizontal.prototype = Object.create(EContainer.prototype);
  EContainerHorizontal.prototype.getLinkStype = function() {
    return 'straight';
  }
  EContainerHorizontal.prototype.__getENodeRoot = function() {
    return new ENodeHorizontalRoot(this.model, null, this);
  };

  function ENodeHorizontal(model, parent, eContainer) {

    if (MapValue.cMap.firstTime) {
      // model.x = model.x + ;
  //    model.y = model.y + 50 * model.level;
    }

    ENode.call(this, model, parent, eContainer);
  }
  ENodeHorizontal.prototype = Object.create(ENode.prototype);

  // BEGIN abstract methods
  ENodeHorizontal.prototype.__createNewChild = function(eModel) {
    return new ENodeHorizontal(eModel, this, this.eContainer);
  };
  ENodeHorizontal.prototype.__createEGroup = function() {
    return new EGroupHorizontal(this);
  };
  ENodeHorizontal.prototype.__createEMarker = function() {
    return new EMarkerHorizontal(this);
  };

  ENodeHorizontal.prototype.move = function(dx, dy) {

    if (this.checkIsRoot()) {
      console.log("rootMoving: " + dx + " _ " + dy);
      MapValue.gContainer.panZoom.rootMoving(dx, dy);
    } else {
      this.x += dx * MapValue.gContainer.panZoom.getZoomRatio();
      this.y += dy * MapValue.gContainer.panZoom.getZoomRatio();

      this.moveElements();

      // move childs
      if (this.eChildren) {
        this.eChildren.forEach(function(eChild) {
          eChild.move(dx, dy);
        });
      }

    }

  };

  ENodeHorizontal.prototype.getPointLine1 = function() {
    return {
      x : this.x,
      y : this.y - this.getHeight() / 2
    };
  };
  ENodeHorizontal.prototype.getPointLine2 = function() {
    // return {x: this.getPointLine1().x + node_w, y: this.getPointLine1().y};
    return {
      x : this.x,
      y : this.y + this.getHeight() / 2
    };
  };

  function EGroupHorizontal(eNode) {
    EGroup.call(this, eNode);
  }
  EGroupHorizontal.prototype = Object.create(EGroup.prototype);

  // BEGIN abstract methods
  EGroupHorizontal.prototype.moveElements = function() {
    var width = this.eNode.getWidth();
    var height = this.eNode.getHeight();
    var tranX = this.eNode.x - width / 2;
    var tranY = this.eNode.y - height / 2;
    this.pGroup.transform("t" + tranX + "," + tranY);
    if (this.pGroupCircle) {
      this.pGroupCircle.transform("t" + this.eNode.getPointLine2().x + ","
          + this.eNode.getPointLine2().y);
    }
  };

  /*
   * Animating this node: collapse this eNode to input ENode
   *
   * eNode: node will be the root for collapsing to
   */
  // TODO: read carefully
  EGroupHorizontal.prototype.animateCollapseToNode = function(eNode) {
    var x = eNode.getPointLine2().x;
    // var y = eNode.getPointLine2().y - node_h/2;
    var y = eNode.getPointLine2().y;
    var newStrTrans = "t" + (x - eNode.getWidth() / 2) + "," + y;
    var elattrs = [ {
      transform : newStrTrans,
      opacity : 0
    } ];
    var now = 1;
    var self = this;
    this.pGroup.stop().animate(elattrs[+(now = !now)],
        ConfValue.DEFAULT_EXPAND_COLLAPSE_ANIMATE, ConfValue.DEFAULT_COLLAPSE_ANIMATE_TYPE,
        function() {
          self.pGroup.hide();
          // Collaspe Animation Complete
        });

    if (this.pGroupCircle) {
      console.log(this.pGroupCircle);
      var n2 = 1;
      this.pGroupCircle.stop().animate(elattrs[+(n2 = !n2)],
          ConfValue.DEFAULT_EXPAND_COLLAPSE_ANIMATE, ConfValue.DEFAULT_COLLAPSE_ANIMATE_TYPE,
          function() {
            self.pGroupCircle.hide();
            console.log("animate stop");
          });
    }
  };
  /*
   * Animating this node: expand this eNode to position stored in this node data.
   * (this.node.x, this.node.y)
   *
   * eNode: // TODO: Unused
   */
  // TODO: read carefully
  EGroupHorizontal.prototype.animateExpandFromNode = function(eNode) {
    var width = this.eNode.getWidth();
    var height = this.eNode.getHeight();
    var tranX = this.eNode.x - width / 2;
    var tranY = this.eNode.y - height / 2;
    var newStrTrans = helper_fn_getTranslateStr(tranX, tranY);
    // console.log("newStrTrans: " + newStrTrans);
    var elattrs = [ {
      transform : newStrTrans,
      opacity : 1
    } ];
    var now = 1;
    this.pGroup.show();
    this.pInformation.hide();
    this.pGroup.stop().animate(elattrs[+(now = !now)],
        ConfValue.DEFAULT_EXPAND_COLLAPSE_ANIMATE, ConfValue.DEFAULT_EXPAND_ANIMATE_TYPE, function() {
          // Expand Animation Complete

          // use for blocking drag while expanding
          if (MapValue.IS_NODE_EXPAND) {
            MapValue.IS_NODE_EXPAND = false;
            // alert("Static.isNodeExpanding = " + Static.isNodeExpanding);
          }
        });

    var elattrs = [ {
      transform : helper_fn_getTranslateStr(this.eNode.getPointLine2().x,
          this.eNode.getPointLine2().y),
      opacity : 1
    } ];
    if (this.pGroupCircle) {
      this.pGroupCircle.show();
      var n2 = 1;
      this.pGroupCircle.stop().animate(elattrs[+(n2 = !n2)],
          ConfValue.DEFAULT_EXPAND_COLLAPSE_ANIMATE, ConfValue.DEFAULT_EXPAND_ANIMATE_TYPE);
    }
  };
  // END abstract methods
  // implement Emarker horizontal
  function EMarkerHorizontal(eNode){
    this.eNode = eNode;
    this.pBug = new EMarkerItemHorizontal(this, 1);
    this.pSuggestion = new EMarkerItemHorizontal(this, 2);
    this.pNote = new EMarkerItemHorizontal(this, 3);
    this.pQuestion = new EMarkerItemHorizontal(this, 4);
  }
  EMarkerHorizontal.prototype = Object.create(EMarker.prototype);

  function EMarkerItemHorizontal(eMarker, type) {
    EMarkerItem.call(this, eMarker, type);
  }
  EMarkerItemHorizontal.prototype = Object.create(EMarkerItem.prototype);

  EMarkerItemHorizontal.prototype.moveElements = function() {
    var tranX = this.eMarker.eNode.x - this.eMarker.eNode.getWidth() / 2;
    var tranY = this.eMarker.eNode.y - this.eMarker.eNode.getHeight() / 2;
    this.pGroup.transform("t" + tranX + "," + tranY);
  };
  /*
   * ENode2TreeRoot TODO: Unused: groupCircle expand/collapse
   */
  function ENodeHorizontalRoot(model, parent, eContainer) {
    ENodeHorizontal.call(this, model, parent, eContainer);
  };
  ENodeHorizontalRoot.prototype = Object.create(ENodeHorizontal.prototype);
  function helper_fn_getTranslateStr(x, y)  {
    return "t" + x + "," + y;
  };
  this.initialized = function() {
    return {
      EContainerHorizontal: EContainerHorizontal
    }
  }
})
