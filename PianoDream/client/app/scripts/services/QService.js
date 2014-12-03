webApp.service('QService', function(ConfValue, MapValue, UtilsFactory) {
  /*----------------------------
 *------------SERVICE---------
 *---------------------------*/
  //#region QService.js - service for saving/loading json data
  function QService()  {
    this.isLoad = false;
    this.maxLevel = 0;
    this.maxLevelCount = 0;
    this.treeRoot = null;
  }

  // generate map with input data
  QService.prototype.generateMap = function (data, type)  {
    this.type = type;
    this.root = data;
    this.maxLevel = this._getRootMaxLevel();
    this.maxLevelCount = this._getRootMaxLevelCount();
    this._actionReload();
    return this.treeRoot;
  };

  // do generate map by data stored in this QService class
  QService.prototype._actionReload = function() {
    this.container = null;
    switch (this.type) {
      case 1:
        this.treeRoot = this._getTreeCircle();
        break;
      case 2:
        this.treeRoot = this._getTreeSimple();
        break;
      case 3:
        this.treeRoot = this._getTreeSeperation();
        break;
      case 4:
        this.treeRoot = this._getHorizontalTree();
        break;
      default:
        break;
    }
  };

  // Unused: load test data from JSON file
  QService.prototype.loadJson = function (callback)  {
    this.isLoad = true;
    var self = this;

    d3.json(this.file, function(error, root) {
      //caculate min/max level
      self.root = root;
      self.maxLevel = self._getRootMaxLevel();
      self.maxLevelCount = self._getRootMaxLevelCount();

      callback(error);
    });
  };


  /**
   * caculate tree circle
   * @param root
   * @returns
   */
  QService.prototype._getTreeCircle = function()  {
    var radius = ConfValue.RATIO_W * this.maxLevel * 1.2;
    var map_h = radius * 2;
    var map_w = map_h;
    MapValue.CANVAS_W = Math.max(map_w, MapValue.CANVAS_W);
    MapValue.CANVAS_H = Math.max(map_h, MapValue.CANVAS_H);
    //console.log("_getTreeCircle");
    console.log("radius: " + radius);
    // TODO: Note: BEGIN D3 Generator
    var tree = d3.layout.tree().size([ 360,  radius]).separation(
      function(a, b) {
        return (a.parent == b.parent ? 1 : 2) / a.depth;
      }
    );

    var nodes = tree.nodes(this.root);
    var treeRoot = nodes[0];

    // END D3 Generator

    // After D3 processed:
    // we have: every PageNode:
    //    x: Degree
    //     y: Radius from ROOT node

    caculateTree(treeRoot);
    return treeRoot;

    function caculateTree(node)  {
      var rad = (node.x) * Math.PI / 180;

      var y = node.y;
      var w = y * Math.cos(rad);
      var h = y * Math.sin(rad);


      node.x = MapValue.CANVAS_W / 2 + w;
      node.y = MapValue.CANVAS_H / 2 - h;

      // caculate children
      if (node.children) {
        node.children.forEach(function(child) {
          caculateTree(child);
        });
      }
    }
  };
  // auto gen horizontal map
  QService.prototype._getHorizontalTree = function() {
    var map_h = ConfValue.RATIO_H * this.maxLevelCount;
    var map_w = 180 * this.maxLevel + ConfValue.NODE_W;
    var tree = null, nodes = null, treeRoot = null;
    MapValue.CANVAS_W = Math.max(map_w, MapValue.CANVAS_W);
    MapValue.CANVAS_H = Math.max(map_h, MapValue.CANVAS_H);
    // gen tree
    console.log(this.root);
    tree = d3.layout.qTree().width(map_w).curMap(ConfValue.HORIZONTAL);
    nodes = tree.nodes(this.root);
    treeRoot = nodes[0];
    return treeRoot;
  }
  /**
   * caculate child nodes of tree simple
   * @param root
   * @returns
   */
  QService.prototype._getTreeSimple = function()  {
    //console.log("_getTreeSimple_2");
    var map_h = ConfValue.RATIO_H * this.maxLevelCount;
    var map_w = 180 * this.maxLevel + ConfValue.NODE_W;
    MapValue.CANVAS_W = Math.max(map_w, MapValue.CANVAS_W);
    MapValue.CANVAS_H = Math.max(map_h, MapValue.CANVAS_H);

    // TODO: Note: BEGIN D3 Generator
    var tree = d3.layout.qTree().width(map_w);
    var nodes = tree.nodes(this.root);

    var treeRoot = nodes[0];

    caculateTree(treeRoot);
    return treeRoot;

    function caculateTree(node)  {
      var tmp = node.x;
      node.x = node.depth * (UtilsFactory.getWidth(0)+ UtilsFactory.getWidth(5)/2);
      node.y = tmp * ConfValue.NODE_HEIGHT_PADDING_RATIO;

      //console.log("caculateTree: " + node.title + " _x: " + node.x + " _y: " + node.y);

      // caculate children
      if (node.children) {
        node.children.forEach(function(child) {
          caculateTree(child);
        });
      }
    }
    return nodes[0];
  };

  /**
   * caculate tree by seperation child nodes
   * will be improved more
   * @param root
   * @returns
   */
  /**
   * @returns
   */
  QService.prototype._getTreeSeperation = function()  {
    var map_h = ConfValue.RATIO_H * this.maxLevelCount;
    var map_w = 180 * this.maxLevel + ConfValue.NODE_W;
    var tree = null, nodes = null, treeRoot = null;
    var SEPARATION_UNIT = 80;
    MapValue.CANVAS_W = Math.max(map_w, MapValue.CANVAS_W);
    MapValue.CANVAS_H = Math.max(map_h, MapValue.CANVAS_H);
    // gen tree
    console.log(this.root);
    //TODO
//    angular.element(curMap = 4);
    //
    tree = d3.layout.qTree().width(map_w).nodeSeparation(25);
    nodes = tree.nodes(this.root);
    treeRoot = nodes[0];
    separateTree(treeRoot);
    return treeRoot;
    //
    function separateTree(root) {
      var twoBranches = separateTree(root);
      var rightBranch = twoBranches[0];
      var leftBranch = twoBranches[1];
      var deltaX = -root.x;
      var deltaY = -root.y;
      rightBranch.sort(function(current, previous) {
        return current[3].x > previous[3].x;
      })
      mergeBranch(rightBranch);
      rotateBranches(rightBranch, 90);
      centerBranch(rightBranch);
      if(leftBranch != null) {
        leftBranch.sort(function(current, previous) {
          return current[3].x > previous[3].x;
        })
        mergeBranch(leftBranch);
        rotateBranches(leftBranch, -90);
        centerBranch(leftBranch);
      }

      //****************
      function isEmpty(lst){
        return lst.length === 0;
      }
      function min(lst) {
        return Math.min.apply(null, lst);
      }
      function max(lst) {
        return Math.max.apply(null, lst);
      }

      function centerBranch(branch) {
        var len = branch.length;
        if(len%2 == 1) {
          var center = Math.floor(len/2);
          var node = branch[center][3];
          var dy = node.y;
          translateBranches(branch, 0, -dy);
        } else {
          var second = Math.floor(len/2);
          var first = second - 1;
          var dy = (branch[first][3].y + branch[second][3].y)/2;
          translateBranches(branch, 0, -dy);
        }
      }
      function translateBranches(branches, dx, dy) {
        for(var i=0; i < branches.length; i++) {
          translateBranch(branches[i][3], dx, dy);
        }
      }
      function translateBranch(branch, dx, dy){
        translate(branch, dx, dy);
        for(var i=0; i < branch.children.length; i++) {
          translateBranch(branch.children[i], dx, dy);
        }
      }
      function search(tree) {
        var left = tree.x;
        var right = tree.x;
        var curLevel = tree.level;
        var leftMost = [];
        var rightMost = [];
        var queue = [];
        var vector = {x: 0, y: 0};
        queue.push(tree);
        while(!isEmpty(queue)) {
            var elem = queue.shift(1); // dequeue
            for(var i = 0; i < elem.children.length; i++) {
                queue.push(elem.children[i]);
            }
            if(elem.level != curLevel) {
                curLevel = elem.level;
                leftMost.push(left);
                rightMost.push(right);
                left = elem.x;
            } else {
                right = elem.x;
            }
        }
        leftMost.push(left);
        rightMost.push(right);
        return [leftMost, rightMost];
      }
      function rotateBranches(branches, degree) {
        for(var i = 0; i < branches.length; i++) {
          var branch = branches[i][3];
          rotateBranch(branch, degree);
        }
      }
      function rotateBranch(branch, degree){
        translate(branch, deltaX, deltaY);
        rotate(branch, degree);
        translate(branch, -deltaX, -deltaY);
        for(var i = 0; i < branch.children.length; i++) {
          rotateBranch(branch.children[i], degree);
        }
      }
      //
      function translate(node, dx, dy) {
        node.x = node.x + dx;
        node.y = node.y + dy;
      }
      // rotate 90o Clock-wise
      function rotate(node, degree) {
        var piDegree = degree/ 180 * Math.PI;
        var x = node.x;
        var y = node.y;
        node.x = x * Math.cos(piDegree) + y * Math.sin(piDegree);
        node.y = -x * Math.sin(piDegree) + y * Math.cos(piDegree);
      }
      function findTreeWidth(leftMost, rightMost) {
        return Math.abs(max(rightMost) - min(leftMost));
      }
      function findMergeTreeWidth(leftMost, rightMost, step) {
        return Math.abs(max(rightMost) - min(leftMost) - step);
      }
      function mergeTree(secondTree, step) {
        secondTree.x = secondTree.x - step;
        for(var i = 0; i < secondTree.children.length; i++) {
          mergeTree(secondTree.children[i], step);
        }
      }
      function mergeBranch(branch) {
        var tempRoot = {x: 0, children:[branch[0][3]]};
        for(var i= 0; i < (branch.length - 1); i++) {
          var first = branch[i];
          var second = branch[i+1];
          var step = moveStep(first[1], second[0], SEPARATION_UNIT);
          mergeTree(second[3], step);
          tempRoot.children.push(second[3]);
          var lrMost = search(tempRoot);
          lrMost[0].shift(1);
          lrMost[1].shift(1);
          second[0] = lrMost[0];
          second[1] = lrMost[1];
        }
      }
      function moveStep(rightMost, leftMost, separationUnit) {
        var minLength = Math.min(rightMost.length, leftMost.length);
        var step = Math.abs(leftMost[0] - rightMost[0]);
        for(var i = 0; i < minLength; i++) {
            var tmp = Math.abs(leftMost[i] - rightMost[i]);
            if(tmp < step) step = tmp;
        }
        return (step - separationUnit);
      }
      //
      function devideBranches(branches) {
        var lefts = [];
        var leftWidth = 0;
        var leftSteps = 0;
        var rigths = [];
        var rightWidth = 0;
        var rightSteps = 0;
        var stack = branches;
        var elem = {};
        elem = stack.pop();
        lefts.push(elem);
        leftWidth = elem[2];
        //
        elem = stack.pop();
        if(isEmpty(stack)) return[lefts, null]
        rigths.push(elem);
        rightWidth = elem[2];
        while(!isEmpty(stack)) {
          var elem = stack.pop();
          var step = 0;
          if(rightWidth > leftWidth) {
            var len = lefts.length;
            lefts.push(elem);
            step = moveStep(lefts[len-1][1], lefts[len][0], SEPARATION_UNIT);
            leftSteps += step;
            leftWidth = findMergeTreeWidth(lefts[0][0], lefts[len][1], leftSteps);
            console.log(leftWidth)
          } else {
            var len = rigths.length;
            rigths.push(elem);
            step = moveStep(rigths[len-1][1], rigths[len][0], SEPARATION_UNIT);
            rightSteps += step;
            rightWidth = findMergeTreeWidth(rigths[0][0], rigths[len][1], rightSteps);
            console.log(rightWidth);
          }
        }
        return [lefts, rigths];
      }
      //[[left, rigth, width, tree]]
      function separateTree(tree) {
        var branches = [];
        for(var i = 0; i < tree.children.length; i++) {
          var lrMost = search(tree.children[i]);
          var width = findTreeWidth(lrMost[0], lrMost[1]);
          var branche = lrMost.concat([width, tree.children[i]]);
          branches.push(branche);
        }
        branches.sort(function(current, previous) {
          return current[3].x < previous[3].x;
        })
        return devideBranches(branches);
      }
    }
  };
  // get max level of all children
  QService.prototype._getRootMaxLevel = function()  {
    return this._getLevelMax(this.root);
  };
  QService.prototype._getLevelMax = function(node)  {
    var max = node.level;
    var self = this;
    node.children.forEach(function(child)  {
      max = Math.max(max, self._getLevelMax(child));
    });
    return max;
  };

  // Get max level of "child count of each level"
  QService.prototype._getRootMaxLevelCount = function()  {
    var arrLevelCount = new Array();
    for (var i=0; i<=this.maxLevel; i++)  {
      arrLevelCount[i] = 0;
    }
    this._getMaxLevelCount(this.root, arrLevelCount);
    var maxCount = Math.max.apply(null, arrLevelCount);
    return maxCount;
  };
  QService.prototype._getMaxLevelCount = function(node, arrLevelCount)  {
    arrLevelCount[node.level] ++;
    var self = this;
    node.children.forEach(function(child)  {
      self._getMaxLevelCount(child, arrLevelCount);
    });
  };
  this.initialized = function() {
    return new QService();
  }

})
