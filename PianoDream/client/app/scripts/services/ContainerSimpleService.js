/*
 * EContainerSimple
 */
webApp.service('ContainerSimpleService', function(ContainerService, UtilsFactory, ConfValue, MapValue) {
  var E = ContainerService.initialized(),
      EContainer = E.EContainer,
      EGroup = E.EGroup,
      ENode = E.ENode,
      EMarker = E.EMarker;
  function EContainerSimple(qservice) {
    // make this class (EContainerSimple) become EContainer class with input QService data
    EContainer.call(this, qservice);
  }

  // Copy all prototype of EContainer class to EContainerSimple class
  EContainerSimple.prototype = Object.create(EContainer.prototype);

  EContainerSimple.prototype.__getENodeRoot = function()  {
    return new ENodeSimpleRoot(this.model, null, this);
  };

  /*
   * ENodeCircle
   */
  function ENodeSimple(model, parent, eContainer)  {

//    if (MapValue.cMap.firstTime)
//    {
//      model.x = model.x + UtilsFactory.getWidthExpandedByLevel(model.level);
//      model.y = model.y - UtilsFactory.getHeightExpandedByLevel(model.level);
//    }

    ENode.call(this, model, parent, eContainer);
  }
  ENodeSimple.prototype = Object.create(ENode.prototype);

  //BEGIN abstract methods
  ENodeSimple.prototype.__createNewChild = function(eModel) {
    return new ENodeSimple(eModel, this, this.eContainer);
  };
  ENodeSimple.prototype.__createEGroup = function()  {
    return new EGroupSimple(this);
  };
  ENodeSimple.prototype.__createEMarker = function() {
    return new EMarker(this);
  }
  ENodeSimple.prototype.move = function (dx, dy) {

    if (this.checkIsRoot())  {
      g_container.panZoom.rootMoving(dx, dy);
    }  else  {
      this.x += dx * g_container.panZoom.getZoomRatio();
      this.y += dy * g_container.panZoom.getZoomRatio();

      this.moveElements();

      //move childs
      if (this.eChildren)  {
        this.eChildren.forEach(function(eChild)  {
          eChild.move(dx, dy);
        });
      }

    }

  };

  ENodeSimple.prototype.getPointLine1 = function()  {
    //return this.eGroup.pRect.matrix.e;
    //return {x: this.x, y:this.y + node_h / 2};
    return {x: this.x, y:this.y + this.getHeight() / 2};
  };
  ENodeSimple.prototype.getPointLine2 = function()  {
    //return {x: this.getPointLine1().x + node_w, y: this.getPointLine1().y};
    return {
      x: this.getPointLine1().x + this.getWidth(),
      y: this.getPointLine1().y};
  };
  //END abstract methods



  /**
   *
   * @param eNode
   * @returns {EGroupSimple}
   */
  function EGroupSimple(eNode)  {
    EGroup.call(this, eNode);
  }
  EGroupSimple.prototype = Object.create(EGroup.prototype);

  //BEGIN abstract methods
  EGroupSimple.prototype.moveElements = function()  {
    //this.pGroup.translate(this.eNode.x, this.eNode.y);
    this.pGroup.transform("t" + this.eNode.x + "," + this.eNode.y);
    if (this.pGroupCircle)  {
      this.pGroupCircle.transform("t" + this.eNode.getPointLine2().x + "," + this.eNode.getPointLine2().y);
    }
  };


  /*
   * Animating this node: collapse this eNode to input ENode
   *
   * eNode: node will be the root for collapsing to
   */
  //TODO: read carefully
  EGroupSimple.prototype.animateCollapseToNode = function (eNode)  {
    var x = eNode.getPointLine2().x;
    //var y = eNode.getPointLine2().y - node_h/2;
    var y = eNode.getPointLine2().y - eNode.getHeight()/2;
    var newStrTrans = "t" + x + "," + y;
    var elattrs = [{transform:newStrTrans, opacity:0}];
    var now = 1;
    var self = this;
    this.pGroup.stop().animate(elattrs[+(now = !now)], ConfValue.DEFAULT_EXPAND_COLLAPSE_ANIMATE, ConfValue.DEFAULT_COLLAPSE_ANIMATE_TYPE,   function()  {
      self.pGroup.hide();
      // Collaspe Animation Complete
    });

    if (this.pGroupCircle)  {
      var n2 = 1;
      this.pGroupCircle.stop().animate(elattrs[+(n2 = !n2)], ConfValue.DEFAULT_EXPAND_COLLAPSE_ANIMATE, ConfValue.DEFAULT_COLLAPSE_ANIMATE_TYPE, function()  {
        self.pGroupCircle.hide();
      });
    }
  };
  /*
   * Animating this node: expand this eNode to position stored in this node data. (this.node.x, this.node.y)
   *
   * eNode: // TODO: Unused
   */
  // TODO: read carefully
  EGroupSimple.prototype.animateExpandFromNode = function (eNode)  {

    var newStrTrans = helper_fn_getTranslateStr(this.eNode.x, this.eNode.y);
    //console.log("newStrTrans: " + newStrTrans);
    var elattrs = [{transform:newStrTrans, opacity:1 }];
    var now = 1;
    this.pGroup.show();
    this.pInformation.hide();
    this.pGroup.stop().animate(elattrs[+(now = !now)], ConfValue.DEFAULT_EXPAND_COLLAPSE_ANIMATE, ConfValue.DEFAULT_EXPAND_ANIMATE_TYPE, function()  {
      // Expand Animation Complete

      //use for blocking drag while expanding
      if (MapValue.IS_NODE_EXPAND) {
        MapValue.IS_NODE_EXPAND = false;
      }
    });

    var elattrs = [{transform:helper_fn_getTranslateStr(this.eNode.getPointLine2().x, this.eNode.getPointLine2().y), opacity:1 }];
    if (this.pGroupCircle)  {
      this.pGroupCircle.show();
      var n2 = 1;
      this.pGroupCircle.stop().animate(elattrs[+(n2 = !n2)], MapValue.DEFAULT_EXPAND_COLLAPSE_ANIMATE, MapValue.DEFAULT_EXPAND_ANIMATE_TYPE);
    }
  };
  //END abstract methods

  /*
   * ENode2TreeRoot
   * TODO: Unused: groupCircle expand/collapse
   */
  function ENodeSimpleRoot(model, parent, eContainer)  {
    ENodeSimple.call(this, model, parent, eContainer);
  };

  function helper_fn_getTranslateStr(x, y)  {
    return "t" + x + "," + y;
  };
  ENodeSimpleRoot.prototype = Object.create(ENodeSimple.prototype);

  this.initialized = function() {
    return {
      EContainerSimple: EContainerSimple
    }
  }
})


