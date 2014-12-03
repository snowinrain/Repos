/*
 * EContainer2Tree
 */
webApp.service('ContainerTwoBranchService', function(UtilsFactory, ConfValue, MapValue, ContainerService) {
  var E = ContainerService.initialized(),
      EContainer = E.EContainer,
      EGroup = E.EGroup,
      ENode = E.ENode,
      EMarker = E.EMarker,
      EMarkerItem = E.EMarkerItem;
  function EContainer2Tree(qservice)  {
    EContainer.call(this, qservice);
  }
  EContainer2Tree.prototype = Object.create( EContainer.prototype);
  EContainer2Tree.prototype.__getENodeRoot = function()  {
    return new ENode2TreeRoot(this.model, null, this);
  };

  /*
   * ENode2Tree
   */
  function ENode2Tree(model, parent, eContainer)  {

    //model.isRight = undefined;
    ENode.call(this, model, parent, eContainer);

    //this.isRight = model.isRight;

  }
  ENode2Tree.prototype = Object.create(ENode.prototype);

  //BEGIN abstract methods
  ENode2Tree.prototype.__createNewChild = function(eModel) {
    return new ENode2Tree(eModel, this, this.eContainer);
  };
  ENode2Tree.prototype.__createEGroup = function()  {
    return new EGroup2Tree(this);
  };
  ENode2Tree.prototype.__createEMarker = function() {
    return new EMarker(this);
  };
  ENode2Tree.prototype.__createEMarker = function() {
    return new EMarkerTwoBranches(this);
  };
  ENode2Tree.prototype.move = function(dx, dy)  {

    if (this.checkIsRoot())  {
      MapValue.gContainer.panZoom.rootMoving(dx, dy);
    }  else  {
      var xCenterRoot = this.getRootNode().x
      if (this.x >= xCenterRoot)
      {
        var checkIsRight = this.checkIsRight();
        if (this.isRight == false)
        {
          this.isRight = true;
          FlipAllChild(this);
          console.log("1. movv : isRight = false: " + checkIsRight + " - " + this.level);
        }
        else
        {
          console.log("1. movv : isRight = true: " + checkIsRight + " - " + this.level);
        }
      }
      else
      {
        var checkIsRight = this.checkIsRight();
        if (this.isRight == true)
        {
          this.isRight = false;
          FlipAllChild(this);
          console.log("2. movv : isRight = true: " + checkIsRight + " - " + this.level);
        }
        else
        {
          console.log("2. movv : isRight = false: " + checkIsRight + " - " + this.level);
        }
      }
      //---------QNha - 2013-12-19-----

      // Don't move this code to upper, because it can create bug
      this.x += dx * MapValue.gContainer.panZoom.getZoomRatio();
      this.y += dy * MapValue.gContainer.panZoom.getZoomRatio();


      this.moveElements();

      //move childs
      if (this.eChildren)  {
        this.eChildren.forEach(function(eChild)  {
          eChild.move(dx, dy);
        });
      }
    }

    // QNha 2013-12-26
    function FlipAllChild(eNode)
    {
      console.log("movv : FlipAllChild");
      var xCenterENode = eNode.x + UtilsFactory.getWidth(eNode.level)/2;

      if (eNode.isRight)
      {
        //FlipToRight(eNode, xCenterRoot);
        console.log("movv : FlipToRight");
        if (eNode.eChildren)  {
          eNode.eChildren.forEach(function(eChild)  {
            if (eChild.isRight == false)
            {
              eChild.isRight = true;
              FlipNode(eChild, xCenterENode);
            }
          });
        }
      }
      else
      {
        //FlipToLeft(eNode, xCenterRoot);
        console.log("movv : FlipToLeft");
        if (eNode.eChildren)
        {
          eNode.eChildren.forEach(function(eChild)  {
            if (eChild.isRight == true)
            {
              eChild.isRight = false;
              FlipNode(eChild, xCenterENode);
            }
          });
        }
      }
    }

    function FlipNode(eNode, xCenterRoot)
    {
      eNode.x = xCenterRoot + (xCenterRoot - eNode.x) - UtilsFactory.getWidth(eNode.level);

      //Flip childs
      if (eNode.eChildren)  {
        eNode.eChildren.forEach(function(eChild)  {
          if (eChild.isRight !== eNode.isRight)
          {
            eChild.isRight = eNode.isRight;
            FlipNode(eChild, xCenterRoot);
          }
        });
      }
    }

  };
  ENode2Tree.prototype.getPointLine1 = function()  {
    var point = {x: this.x, y: this.y};
    if(this.isLeftNode()){
      point.x = this.x + this.getWidth()/2;
    }
    if(this.isRightNode()){
      point.x = this.x - this.getWidth()/2;
    }
    return point;
  };
  ENode2Tree.prototype.checkIsRight = function()  {
    if(this.x > this.getRootNode().x) return true;
    return false;
  };
  ENode2Tree.prototype.isLeftNode = function() {
    if(this.x < this.getRootNode().x) return true;
    return false;
  }
  ENode2Tree.prototype.isRightNode = function() {
    if(this.x > this.getRootNode().x) return true;
    return false;
  }
  ENode2Tree.prototype.isRootNode = function() {
    if(this.x === this.getRootNode().x) return true;
    return false;
  }
  ENode2Tree.prototype.getPointLine2 = function()  {
    var point = {x: this.x, y: this.y};
    if(this.isLeftNode()){
      point.x = this.x - this.getWidth()/2;
    }
    if(this.isRightNode()) {
      point.x = this.x + this.getWidth()/2;
    }
    return point;
  };

  /**
   *
   * @param eNode
   * @returns {EGroup2Tree}
   */
  function EGroup2Tree(eNode)  {
    EGroup.call(this, eNode);

    //this.isRight = true;
  }
  EGroup2Tree.prototype = Object.create(EGroup.prototype);

  //BEGIN abstract methods
  EGroup2Tree.prototype.moveElements = function()  {
    var centerY = this.eNode.y - this.eNode.getHeight()/2;
    var centerX = this.eNode.x - this.eNode.getWidth()/2;
    if(this.eNode.isRight == undefined) {
      if(this.eNode.x > this.eNode.getRootNode().x) {
        this.eNode.isRight = true;
      } else {
        this.eNode.isRight = false;
      }
    }
    this.pGroup.transform("t" + centerX + "," + centerY);
    if (this.pGroupCircle)  {
      if(this.eNode.isRootNode()) {
        this.pGroupCircle.hide();
      }
      this.pGroupCircle.transform("t" + this.eNode.getPointLine2().x + "," + this.eNode.getPointLine2().y);
    }
  };
  EGroup2Tree.prototype.animateCollapseToNode = function (eNode)  {
    var x = eNode.getPointLine2().x - eNode.getWidth();
    var y = eNode.getPointLine2().y - eNode.getHeight()/2;

    var newStrTrans = "t" + x + "," + y;
    var elattrs = [{transform:newStrTrans, opacity:0}];
    var now = 1;
    var self = this;
    this.pGroup.stop().animate(elattrs[+(now = !now)], ConfValue.DEFAULT_EXPAND_COLLAPSE_ANIMATE, ConfValue.DEFAULT_COLLAPSE_ANIMATE_TYPE, function()  {
      self.pGroup.hide();
    });

    if (this.pGroupCircle)  {
      console.log(this.pGroupCircle);
      var n2 = 1;
      this.pGroupCircle.stop().animate(elattrs[+(n2 = !n2)], ConfValue.DEFAULT_EXPAND_COLLAPSE_ANIMATE, ConfValue.DEFAULT_COLLAPSE_ANIMATE_TYPE, function()  {
        self.pGroupCircle.hide();
        console.log("animate stop");
      });
    }
  };
  EGroup2Tree.prototype.animateExpandFromNode = function (eNode)  {
    var newStrTrans = helper_fn_getTranslateStr(this.eNode.x - this.eNode.getWidth()/2, this.eNode.y - this.eNode.getHeight()/2);
    //console.log("newStrTrans: " + newStrTrans);
    var elattrs = [{transform:newStrTrans, opacity:1 }];
    var now = 1;
    this.pGroup.show();
    this.pInformation.hide();
    this.pGroup.stop().animate(elattrs[+(now = !now)], ConfValue.DEFAULT_EXPAND_COLLAPSE_ANIMATE, ConfValue.DEFAULT_EXPAND_ANIMATE_TYPE, function()  {
      // Expand Animation Complete
      //use for blocking drag while expanding
      if (MapValue.IS_NODE_EXPAND)
      {
        MapValue.IS_NODE_EXPAND = false;
        //alert("Static.isNodeExpanding = " + Static.isNodeExpanding);
      }
    });

    var elattrs = [{transform:helper_fn_getTranslateStr(this.eNode.getPointLine2().x, this.eNode.getPointLine2().y), opacity:1 }];
    if (this.pGroupCircle)  {
      this.pGroupCircle.show();
      var n2 = 1;
      this.pGroupCircle.stop().animate(elattrs[+(n2 = !n2)], ConfValue.DEFAULT_EXPAND_COLLAPSE_ANIMATE, ConfValue.DEFAULT_EXPAND_ANIMATE_TYPE);
    }
  };
  //END abstract methods
  function EMarkerTwoBranches(eNode){
    this.eNode = eNode;
    this.pBug = new EMarkerItemTwoBranches(this, 1);
    this.pSuggestion = new EMarkerItemTwoBranches(this, 2);
    this.pNote = new EMarkerItemTwoBranches(this, 3);
    this.pQuestion = new EMarkerItemTwoBranches(this, 4);
  }
  EMarkerTwoBranches.prototype = Object.create(EMarker.prototype);

  function EMarkerItemTwoBranches(eMarker, type) {
    EMarkerItem.call(this, eMarker, type);
  }
  EMarkerItemTwoBranches.prototype = Object.create(EMarkerItem.prototype);

  EMarkerItemTwoBranches.prototype.moveElements = function() {
    var tranX = this.eMarker.eNode.x - this.eMarker.eNode.getWidth() / 2;
    var tranY = this.eMarker.eNode.y - this.eMarker.eNode.getHeight() / 2;
    this.pGroup.transform("t" + tranX + "," + tranY);
  };

  /*
   * ENode2TreeRoot
   * TODO: Unused: groupCircle expand/collapse
   */
  function ENode2TreeRoot(model, parent, eContainer)  {
    ENode2Tree.call(this, model, parent, eContainer);
  };
  ENode2TreeRoot.prototype = Object.create(ENode2Tree.prototype);
  function helper_fn_getTranslateStr(x, y)  {
    return "t" + x + "," + y;
  };
  this.initialized = function() {
    return {
      EContainer2Tree: EContainer2Tree
    }
  }
})

