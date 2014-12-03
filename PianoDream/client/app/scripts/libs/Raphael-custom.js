/*
 * HELP FUNCTIONS
 */

// generate connection string maxtrix for Raphael path drawing
var $node = QMap.node,
    $zoom = QMap.zoom,
    $variables = QMap.variables;
Raphael.fn.connection = function(startX, startY, endX, endY) {
  var spline = {}, oval = {}, origin = {},
      dx, dy, x2, y2, x3, y3, x5, y5, x6, y6;
  origin = {
      startX: startX,
      startY: startY,
      endX: endX,
      endY: endY
  };
  $.extend(spline, origin);
  $.extend(oval, origin);
  // caculate oval line (two branches, simple tree)
  if (oval.endX < oval.startX) {
    oval.endX = oval.startX;
    oval.endY = oval.startY;
    oval.startX = origin.endX;
    oval.startY = origin.endY;
  }
  dx = Math.abs(oval.startX - oval.endX) / 2;
  x2 = oval.startX + dx;
  y2 = oval.startY;
  x3 = oval.endX - dx;
  y3 = oval.endY;
  // caculate spline (horizontal tree)
  if (spline.endY < spline.startY){
    spline.endX = spline.startX;
    spline.endY = spline.startY;
    spline.startX = origin.endX;
    spline.startY = origin.endY;
  }
  dy = Math.abs(spline.endY - spline.startY) / 2;
  x5 = spline.startX;
  y5 = spline.startY + 1.5 * dy;
  x6 = spline.endX;
  y6 = spline.endY - dy;
  return {
    oval: "M" + oval.startX + "," + oval.startY + "C" + x2 + "," + y2 + "," + x3 + "," + y3 + "," + oval.endX + "," + oval.endY,
    straight: "M" + spline.startX + "," + spline.startY + "C" + x5 + "," + y5 + "," + x6 + "," + y6 + "," + spline.endX + "," + spline.endY
  }
};
// set attribute and class for RaphaelJS element
Raphael.el.setAttr = function(name, value) {
  this.node.setAttribute(name, value);
  return this;
};
Raphael.el.setClass = function(className) {
  this.setAttr("class", className);
  return this;
};

Raphael.fn.panZoom = function() {
  return new PanZoom(this);
};

// ----------------------------------------------------------------------------------------------------------------------
// class panzoom
function PanZoom(paper) {
  /* console.log("PanZoom"); */
  this.paper = paper;
  this.container = this.paper.canvas.parentNode;
  this._initEvents();

  this.enableDrag = true;
  this.enableDblClick = true;

  // for panning
  this.curPos = {
    x : 0,
    y : 0
  };
  // record view value of viewBox
  this.viewBox = {
    x : 0,
    y : 0
  }
  // this.curPos = this._initPosition();
  this.nW = this.paper.width;
  this.nH = this.paper.height;
  this.orgX = this.curPos.x;
  this.orgY = this.curPos.y;

  // for zooming
  // this.zoomScaleRatio = ZOOM_SCALE_RATIO;//0.2;
  this.zoomLevelMax = $variables.get('ZOOM_LEVEL_MAX');
  this.zoomLevelMin = $variables.get('ZOOM_LEVEL_MIN');
  this.zoomLevelDefault = $variables.get('ZOOM_LEVEL_DEFAULT');
  this.zoomLevelCurent = 0;

  // this.zoom(ZOOM_LEVEL_BEGIN);

  this.movePos = null;
};

// init events for moving
PanZoom.prototype._initEvents = function(level) {
  var self = this;
  var svgContentBoundary = {};

  var mouseMove = function(e) {
    if (self.enableDrag) {
      var newPoint = self._getRelativePosition(e, self.container);
      var dx = newPoint.x - self.movePos.x;
      var dy = newPoint.y - self.movePos.y;

      // TODO: validate "svgContentBoundary" value here

      // $("#output1").html("svgPos: " + self.movePos.x + " - " +
      // self.movePos.y);
      var isContainerOutOfBound = IsContainerOutOfPaperBound(dx, dy,
          svgContentBoundary);

      if (!isContainerOutOfBound) {
        self.movePos = newPoint;
        self.move(dx, dy);
      }
    }
  };

  this.container.onmousedown = function(e) {
    if(e.which == 3) return false;
    if (self.enableDrag) {
      self.container.onmousemove = mouseMove;
      self.movePos = self._getRelativePosition(e, self.container);
      self.container.style.cursor = "move";
      if (e.preventDefault)
        e.preventDefault();
      else
        e.returnValue = false;

      // QNha - 2013-12-12
      // ResetBoundaryValue();
      // FindBoundaryValue(g_container.eRoot);
      svgContentBoundary = self._getBoundary(g_container.eRoot);

      return false;
    }

  };
  this.container.onmouseup = function(e) {
    if (self.enableDrag) {
      // console.log("onmouseup");
      self.container.onmousemove = null;
      self.movePos = {
        x : 0,
        y : 0
      };
      self.container.style.cursor = "default";

    }
  };
  // ------------------------
  // QNha - 2013-12-12
  this.container.ondblclick = function(e) {
    QMouse.isDoubleClick = true; // use in zoom() function
    if (self.enableDblClick && e.target.tagName === "svg") {
      QMouse.X = e.clientX;
      QMouse.Y = e.clientY;
      // $("#output1").html(QMouse.X + " - " + QMouse.Y);

      $("#zoom-control-up img").click(); // Zoom here
    }
    QMouse.isDoubleClick = false;
  };

  // check if svg is out of boundary or not
  function IsContainerOutOfPaperBound(dx, dy, svgContentBoundaryInput) {

    // container size of SVG in Chrome is difference from FIREFOX
    // console.log(svgContentBoundaryInput);
    // console.log(self.getZoomRatio());
    /*
     * console.log(this.container.canvas.offsetWidth+" : width");
     * console.log(this.container.canvas.offsetHeight+" : height");
     */
    /*
     * // QNha - 2013-12-12 var containerSVG =
     * $("#div-svgid").children(":first"); var paperCtn = $("#div-svgid");
     *
     *  // Container Position var containerLeftPos =
     * $(containerSVG).position().left; var containerTopPos =
     * $(containerSVG).position().top;
     *
     * var paperWidth = $(paperCtn).width() * self.getZoomRatio(); var
     * paperHeight = $(paperCtn).height() * self.getZoomRatio();
     *
     * var contentWidth = svgContentBoundaryInput.boundaryMaxx -
     * svgContentBoundaryInput.boundaryMinx; var contentHeight =
     * svgContentBoundaryInput.boundaryMaxy -
     * svgContentBoundaryInput.boundaryMiny;
     *
     *
     * var deltaX = (containerLeftPos + dx) * self.getZoomRatio(); var deltaY =
     * (containerTopPos + dy) * self.getZoomRatio(); var alphaX = 400 *
     * self.getZoomRatio(); // boundary padding horizontal var alphaY = 200 *
     * self.getZoomRatio(); // boundary padding vertical
     * //$("#output1").html("Bound: " + containerLeftPos + " - " +
     * containerTopPos + " : " + alphaX + " - " + alphaY);
     *
     * if ((alphaX - contentWidth) > deltaX || (paperWidth - alphaX) < deltaX)
     * return true;
     *  // check Top: need to + headerHeight var headerHeight =
     * $("#header").height(); var footerHeight = $("#footer").height(); if
     * ((alphaY - contentHeight + headerHeight) > deltaY || (paperHeight -
     * alphaY - footerHeight) < deltaY) return true; return false;
     */
    return false;
  }

  // ------------------------
};
// zooming
PanZoom.prototype.zoom = function(level) {
  var self = this;
  console.log("zoom");
  if (level != this.zoomLevelCurent) {

    if (QMouse.isDoubleClick) {
      // Already set in doubleClickEventHanler
      // QMouse.X = e.clientX;
      // QMouse.Y = e.clientY;
    } else if (QMouse.isMouseWheel) {
      // Already set in mouseWheelHanler/QMouse
      // QMouse.X = e.clientX;
      // QMouse.Y = e.clientY;
    } else {
      var paperCtn = $("#div-svgid");
      QMouse.X = $(paperCtn).width() / 2;
      QMouse.Y = $(paperCtn).height() / 2;
    }

    var mouseOldPositionOnWorld;
    var mouseNewPositionOnWorld;

    // $("#output1").html(QMouse.X + " - " + QMouse.Y);

    mouseOldPositionOnWorld = QMouse.getPositionByZoomRatio(QMouse.X,
        QMouse.Y,
        self.getZoomRatio());

    // $("#output1").html(QMouse.Y + " - " + (QMouse.wheelDelta * 35));

    // -----------Original code------------------
    this.zoomLevelCurent = level;
    this.nW = this.paper.width * this.getZoomRatio();
    this.nH = this.paper.height * this.getZoomRatio();
    this.repaint();
    // -----------Original code------------------

    if (ClientFunction.map_setting.firstTime) {
      // TODO
      // var position = self._initPosition();
      // mouseNewPositionOnWorld = QMouse.getPositionByZoomRatio(QMouse.X,
      // QMouse.Y, self.getZoomRatio());
      // var dx = mouseNewPositionOnWorld.x - position.x/2;
      // var dy = mouseNewPositionOnWorld.y - position.y/2;
      // self.move(dx/self.getZoomRatio(), dy/self.getZoomRatio());
      // $("#output2").html("Init " + position.x + " - " + position.y);
    } else {
//      if (ClientFunction.is_project_init_complete) { taidnguyen
        mouseNewPositionOnWorld = QMouse.getPositionByZoomRatio(QMouse.X,
            QMouse.Y, self.getZoomRatio());
        // $("#output2").html(mouseOldPositionOnWorld.x + " - " +
        // mouseOldPositionOnWorld.y + "/"
        // + mouseNewPositionOnWorld.x + " - " + mouseNewPositionOnWorld.y);
        var dx = mouseNewPositionOnWorld.x - mouseOldPositionOnWorld.x;
        var dy = mouseNewPositionOnWorld.y - mouseOldPositionOnWorld.y;
        // $("#output2").html(dx/self.getZoomRatio() + " - " +
        // dy/self.getZoomRatio());
        self.move(dx / self.getZoomRatio(), dy / self.getZoomRatio());
//      }
    }
  }

  // if ($zoom.isCallFitToScreen)
  // $zoom.isCallFitToScreen = false;
};

// store data before move node
PanZoom.prototype.startMoving = function() {
  this.orgX = this.curPos.x;
  this.orgY = this.curPos.y;

  this.movePos = {
    x : 0,
    y : 0
  };
};
// do move node
PanZoom.prototype.move = function(dx, dy) {

  this.curPos.x -= dx * this.getZoomRatio();
  this.curPos.y -= dy * this.getZoomRatio();

  // $("#output2").html("svgMove: " + this.curPos.x + " - " + this.curPos.y + "
  // or " + dx + " - " + dy + " -Z- " + this.getZoomRatio());
  this.repaint();

  // TODO: update call many times ==>> low performance
  // 2013-12-30: Move to $("#nav-save-map").click(function() {}); in
  // "project_client.js"
  // gfunc_project_update_map_x_y(- this.curPos.x/ this.getZoomRatio(), -
  // this.curPos.y/ this.getZoomRatio());
};
// process for moving root node: we move entire map by panning map feature ()
PanZoom.prototype.rootMoving = function(dx, dy) {
  this.move(dx, dy);
};

// Notice: Please see "ENode.prototype.draw()" comment in "view.js".
// Repaint visual container.
// TODO: change this funtion name, shouldn't use "repaint"
PanZoom.prototype.repaint = function() {

  var viewBoxX = this.curPos.x;
  var viewBoxY = this.curPos.y;
  var viewBoxWidth = this.nW;
  var viewBoxHeight = this.nH;
  var paper = this.paper;
  var self = this;
  pan("none");
  // move map to [direction]
  function pan(direction) {
    var start = null;// = Date.now();
    // var progress;

    function step(timestamp) {
      if (start === null)
        start = timestamp;

      var progress = timestamp - start;
      var x = viewBoxX, y = viewBoxY;

      if (direction == 'up') {
        y = viewBoxY - progress * 0.7;
      } else if (direction == 'down') {
        y = viewBoxY + progress * 0.7;
      } else if (direction == 'right') {
        x = viewBoxX + progress * 0.7;
      } else if (direction == 'left') {
        x = viewBoxX - progress * 0.7;
      }

      // Now we set the view box at the modified x and y coordinates

      self.viewBox.x = x;
      self.viewBox.y = y;
      paper.setViewBox(x, y, viewBoxWidth, viewBoxHeight);
      if (progress < 400) {
        window.requestAnimFrame(step);
      } else {
        viewBoxX = x;
        viewBoxY = y;
      }
    }
    window.requestAnimFrame(step);
  }

};

// -- helper ---
// get zoom ratio
PanZoom.prototype.getZoomRatio = function() {
  // return (this.zoomLevelDefault - this.zoomLevelCurent) * this.zoomScaleRatio
  // + 1;

  if ($variables.get('ZOOM_LEVEL_DEFAULT') < this.zoomLevelCurent)
    return (this.zoomLevelDefault - this.zoomLevelCurent)
        * $variables.get('ZOOM_SCALE_RATIO_BELOW_ORIGINAL_SIZE') + 1;
  else
    return (this.zoomLevelDefault - this.zoomLevelCurent)
        * $variables.get('ZOOM_SCALE_RATIO_ABOVE_ORIGINAL_SIZE') + 1;
  // return Math.pow(ZOOM_SCALE_RATIO_ABOVE_ORIGINAL_SIZE,
  // (this.zoomLevelDefault - this.zoomLevelCurent)) + 1;

};
// get position of this mouse position on container
PanZoom.prototype._getRelativePosition = function(e, obj) {
  var x, y, pos;
  if (e.pageX || e.pageY) {
    x = e.pageX;
    y = e.pageY;
  } else {
    x = e.clientX + document.body.scrollLeft
        + document.documentElement.scrollLeft;
    y = e.clientY + document.body.scrollTop
        + document.documentElement.scrollTop;
  }

  pos = this._findPos(obj);
  x -= pos[0];
  y -= pos[1];

  return {
    x : x,
    y : y
  };
};
// find position of object on container
PanZoom.prototype._findPos = function(obj) {
  var posX = obj.offsetLeft, posY = obj.offsetTop, posArray;
  while (obj.offsetParent) {
    if (obj == document.getElementsByTagName('body')[0]) {
      break;
    } else {
      posX = posX + obj.offsetParent.offsetLeft;
      posY = posY + obj.offsetParent.offsetTop;
      obj = obj.offsetParent;
    }
  }
  posArray = [ posX, posY ];
  return posArray;
};

// get boundary of all node
PanZoom.prototype._getBoundary = function(eNode) {

  var boundaryMinx = 99999;
  var boundaryMiny = 99999;
  var boundaryMaxx = -99999;
  var boundaryMaxy = -99999;

  ResetBoundaryValue();
  FindBoundaryValue(eNode);

  return {
    boundaryMinx : boundaryMinx,
    boundaryMiny : boundaryMiny,
    boundaryMaxx : boundaryMaxx,
    boundaryMaxy : boundaryMaxy
  };

  function ResetBoundaryValue() {
    boundaryMinx = 99999;
    boundaryMiny = 99999;
    boundaryMaxx = -99999;
    boundaryMaxy = -99999;
  }

  // find boundingbox coordinate of svg content
  function FindBoundaryValue(eNode) {
    boundaryMinx = Math.min(boundaryMinx, eNode.x);
    boundaryMiny = Math.min(boundaryMiny, eNode.y);
    boundaryMaxx = Math.max(boundaryMaxx, eNode.x
        + $node.getWidth(eNode.level));
    boundaryMaxy = Math.max(boundaryMaxy, eNode.y
        + $node.getHeight(eNode.level));

    if (null !== eNode.eChildren)
      for (var i = 0; i < eNode.eChildren.length; i++) {
        FindBoundaryValue(eNode.eChildren[i]);
      }
  }
};

// get boundary of visible node
PanZoom.prototype._getBoundaryVisibleNode = function(eNode) {

  var boundaryMinx = 99999;
  var boundaryMiny = 99999;
  var boundaryMaxx = -99999;
  var boundaryMaxy = -99999;

  ResetBoundaryValue();
  FindBoundaryValue(eNode);

  return {
    boundaryMinx : boundaryMinx,
    boundaryMiny : boundaryMiny,
    boundaryMaxx : boundaryMaxx,
    boundaryMaxy : boundaryMaxy
  };

  function ResetBoundaryValue() {
    boundaryMinx = 99999;
    boundaryMiny = 99999;
    boundaryMaxx = -99999;
    boundaryMaxy = -99999;
  }

  // find boundingbox coordinate of svg content
  function FindBoundaryValue(eNode) {
    boundaryMinx = Math.min(boundaryMinx, eNode.x);
    boundaryMiny = Math.min(boundaryMiny, eNode.y);
    boundaryMaxx = Math.max(boundaryMaxx, eNode.x
        + $node.getWidth(eNode.level));
    boundaryMaxy = Math.max(boundaryMaxy, eNode.y
        + $node.getHeight(eNode.level));

    if (null !== eNode.eChildren)
      for (var i = 0; i < eNode.eChildren.length; i++) {
        if (eNode.eChildren[i].isVisible)
          FindBoundaryValue(eNode.eChildren[i]);
      }
  }

};

// PanZoom.prototype._initPosition = function() {

// //return {x: 0, y: 0};
// var containerTemp = g_container.__getENodeRoot();
// var svgContentBoundary = this._getBoundary(containerTemp);

// var paperCtn = $("#div-svgid");
// var paperWidth = $(paperCtn).width();
// var paperHeight = $(paperCtn).height();
// return {
// x: paperWidth - (svgContentBoundary.boundaryMaxx -
// svgContentBoundary.boundaryMinx),
// y: paperHeight - (svgContentBoundary.boundaryMaxy -
// svgContentBoundary.boundaryMiny)
// };
// };

// Auto move center of map to center of screen
PanZoom.prototype.autoToCenter = function() {
  // this.repaint();
  var self = this;

  var paperCtn = $("#div-svgid");
  var paperWidth = $(paperCtn).width();
  var paperHeight = $(paperCtn).height();
  var svgContentBoundary = this._getBoundaryVisibleNode(g_container.eRoot);

  var ratio = $zoom.getZoomRatio($variables.get('ZOOM_LEVEL_DEFAULT'), self.zoomLevelCurent,
      self.zoomScaleRatio);
  var pos = {
    x : paperWidth
        - (svgContentBoundary.boundaryMaxx - svgContentBoundary.boundaryMinx)
        / ratio,
    y : paperHeight
        - (svgContentBoundary.boundaryMaxy - svgContentBoundary.boundaryMiny)
        / ratio
  };

  // Show Boundary
  // var b1x = svgContentBoundary.boundaryMinx;
  // var b1y = svgContentBoundary.boundaryMiny;
  // var b2x = svgContentBoundary.boundaryMaxx;
  // var b2y = svgContentBoundary.boundaryMiny;
  // $("#output1").html("Bound: " + b1x + " - " + b1y);

  // Show SVG pó: Important for further processing
  // var containerSVG = $("#div-svgid").children(":first");
  // var containerLeftPos = $(containerSVG).position().left;
  // var containerTopPos = $(containerSVG).position().top;
  // $("#output1").html("Bound: " + containerLeftPos + " - " + containerTopPos);

  this.curPos.x = -pos.x * ratio / 2 + svgContentBoundary.boundaryMinx
      + $variables.get('SVG_PADDING') * ratio;
  this.curPos.y = -pos.y * ratio / 2 + svgContentBoundary.boundaryMiny
      + $variables.get('SVG_PADDING') * ratio;

  this.repaint();
};
