// generating tree
d3.layout.qTree = (function (){
  var UNIT_WIDTH = 10,
      NODE_SEPARATION = 10,
      SUBTREE_SEPARATION = 20,
      NODE_BORDER = 2,
      MAP_WIDTH = 1855,
      HEIGHT_SEPARATION = 200,
      SEPARATION_UNIT = 1,
      MLayout = {},
      MAlgorithm = {},
      MAP_TYPE = {
        CIRCLE: 1,
        SIMPLE: 2,
        TWO_TREE: 3,
        HORIZONTAL_TREE: 4
      },
      MAX_LEVEL_HAVE_DIFFERENT_SIZE = 3,
      NODE_W = 120,
      NODE_H = 35,
      curMap = 2;
  // function for layout
  MLayout = (function (){
    return tmp = {
      getWidthUnitSeparation: function (level, distance) {
        var wH = 0,
            sep = 0;
        if (curMap === MAP_TYPE.HORIZONTAL_TREE) {
          wH = getWidth(level);
        } else {
          wH = getHeight(level)
        }
        sep = distance + wH + 2 * NODE_BORDER;
        return sep / MAP_WIDTH * UNIT_WIDTH;
      },
      getMapHeight: function(deepest) {
        return HEIGHT_SEPARATION * deepest;
      },
      treeSeparation: function(a, b) {
        return a.parent == b.parent ? 1 : 2;
      },
      treeLeft: function(node) {
        var children = node.children;
        return children && children.length ? children[0] : node._tree.thread;
      },
      treeRight: function(node) {
        var children = node.children, n;
        return children && (n = children.length) ? children[n - 1] : node._tree.thread;
      },
      treeRightmost: function(a, b) {
        return a.x - b.x;
      },
      treeLeftmost: function(a, b) {
        return b.x - a.x;
      },
      treeDeepest: function(a, b) {
        return a.depth - b.depth;
      },
      treeSearch: function(node, compare) {
        var children = node.children;
        if (children && (n = children.length)) {
          var child, n, i = -1;
          while (++i < n) {
            if (compare(child = arguments.callee(children[i], compare), node) > 0) {
              node = child;
            }
          }
        }
        return node;
      },
      treeVisitAfter: function(node, callback) {
        function visit(node, previousSibling) {
          var children = node.children;
          if (children && (n = children.length)) {
            var child, previousChild = null, i = -1, n;
            while (++i < n) {
              child = children[i];
              visit(child, previousChild);
              previousChild = child;
            }
          }
          callback(node, previousSibling);
        }
        visit(node, null);
      },
      treeShift: function(node) {
        var shift = 0, change = 0, children = node.children, i = children.length, child;
        while (--i >= 0) {
          child = children[i]._tree;
          child.prelim += shift;
          child.mod += shift;
          shift += child.shift + (change += child.change);
        }
      },
      treeMove: function(ancestor, node, shift) {
        ancestor = ancestor._tree;
        node = node._tree;
        var change = shift / (node.number - ancestor.number);
        ancestor.change += change;
        node.change -= change;
        node.shift += shift;
        node.prelim += shift;
        node.mod += shift;
      },
      treeAncestor: function(vim, node, ancestor) {
        return vim._tree.ancestor.parent == node.parent ? vim._tree.ancestor : ancestor;
      },
      hierarchyRebind: function(object, hierarchy) {
        d3.rebind(object, hierarchy, "sort", "children", "value");
        object.nodes = object;
        object.links = tmp.hierarchyLinks;
        return object;
      },
      hierarchyLinks: function(nodes) {
        return d3.merge(nodes.map(function(parent) {
          return (parent.children || []).map(function(child) {
            return {
              source: parent,
              target: child
            };
          });
        }));
      },
      childrenByLevel: function(node) {
        var children = [];
        return (function (node) {
          var ch = node.children, len = ch.length, i = -1;
          if(typeof children[node.depth] === "undefined") {
            children[node.depth] = 1;
          } else {
            children[node.depth]++;
          }
          if(ch && len) {
            while(++i < len){
              arguments.callee(ch[i]);
            }
          }
          return children;
        }(node));
      }
    }
  }());
  // function for algorithm
  MAlgorithm = (function() {
    return tmp = {
      firstWalk: function(node, previousSibling) {
        var children = node.children, layout = node._tree;
        if (children && (n = children.length)) {
          var n, firstChild = children[0], previousChild, ancestor = firstChild, child, i = -1;
          while (++i < n) {
            child = children[i];
            arguments.callee(child, previousChild);
            ancestor = tmp.apportion(child, previousChild, ancestor);
            previousChild = child;
          }
          MLayout.treeShift(node);
          var midpoint = .5 * (firstChild._tree.prelim + child._tree.prelim);
          if (previousSibling) {
            layout.prelim = previousSibling._tree.prelim + MLayout.getWidthUnitSeparation(node.depth, NODE_SEPARATION);
            layout.mod = layout.prelim - midpoint;
          } else {
            layout.prelim = midpoint;
          }
        } else {
          if (previousSibling) {
            layout.prelim = previousSibling._tree.prelim + MLayout.getWidthUnitSeparation(node.depth, NODE_SEPARATION);
          }
        }
      },
      secondWalk: function(node, x) {
        node.x = node._tree.prelim + x;
        var children = node.children;
        if (children && (n = children.length)) {
          var i = -1, n;
          x += node._tree.mod;
          while (++i < n) {
            arguments.callee(children[i], x);
          }
        }
      },
      apportion: function(node, previousSibling, ancestor) {
        if (previousSibling) {
          var vip = node,
              vop = node,
              vim = previousSibling,
              vom = node.parent.children[0],
              sip = vip._tree.mod,
              sop = vop._tree.mod,
              sim = vim._tree.mod,
              som = vom._tree.mod,
              shift;
          while (vim = MLayout.treeRight(vim), vip = MLayout.treeLeft(vip), vim && vip) {
            vom = MLayout.treeLeft(vom);
            vop = MLayout.treeRight(vop);
            vop._tree.ancestor = node;
            //taid
            shift = vim._tree.prelim + sim - vip._tree.prelim - sip + MLayout.getWidthUnitSeparation(vim.depth, SUBTREE_SEPARATION);
            if (shift > 0) {
              MLayout.treeMove(MLayout.treeAncestor(vim, node, ancestor), node, shift);
              sip += shift;
              sop += shift;
            }
            sim += vim._tree.mod;
            sip += vip._tree.mod;
            som += vom._tree.mod;
            sop += vop._tree.mod;
          }
          if (vim && !MLayout.treeRight(vop)) {
            vop._tree.thread = vim;
            vop._tree.mod += sim - sop;
          }
          if (vip && !MLayout.treeLeft(vom)) {
            vom._tree.thread = vip;
            vom._tree.mod += sip - som;
            ancestor = node;
          }
        }
        return ancestor;
      }
    }
  }())
  //
  return function() {
    var hierarchy = d3.layout.hierarchy().sort(null).value(null),
        separation = MLayout.treeSeparation,
        size = [ 1, 1 ],
        nodeSize = false,
        maxElem = 0;
    function tree(d, i) {
      var nodes = hierarchy.call(this, d, i),
          root = nodes[0];
      MLayout.treeVisitAfter(root, function(node, previousSibling) {
        node._tree = {
          ancestor: node,
          prelim: 0,
          mod: 0,
          change: 0,
          shift: 0,
          number: previousSibling ? previousSibling._tree.number + 1 : 0
        };
      });
      MAlgorithm.firstWalk(root);
      MAlgorithm.secondWalk(root, -root._tree.prelim);
      var left = MLayout.treeSearch(root, MLayout.treeLeftmost),
          right = MLayout.treeSearch(root, MLayout.treeRightmost),
          deep = MLayout.treeSearch(root, MLayout.treeDeepest),
          x0 = left.x - separation(left, right) / 2,
          x1 = right.x + separation(right, left) / 2,
          y1 = deep.depth || 1,
          childs = MLayout.childrenByLevel(root),
          totals = 0;
      maxElem = maxElem || childs.reduce(function(x, y){if(x >= y) {return x} else {return y}}, 0);
      totals = childs.reduce(function(x, y){return x + y},0);
      MLayout.treeVisitAfter(root,function(node) {
        node.x = (node.x - x0) / UNIT_WIDTH * MAP_WIDTH;
        node.y = node.depth / y1 * MLayout.getMapHeight(y1+1) * (1 + maxElem / totals);
        delete node._tree;
      });
      return nodes;
    }
    tree.separation = function(x) {
      return tree;
    };
    tree.width = function(x) {
      MAP_WIDTH = x;
      return tree;
    };
    tree.curMap = function(current) {
      curMap = current;
      return tree;
    }
    tree.heightLevel = function (x) {
      HEIGHT_SEPARATION = x;
    };
    tree.nodeSeparation = function(x) {
      NODE_SEPARATION = x;
      return tree;
    }
    // if x = 0: height is not depend on max number of nodess
    tree.setHeightFactor = function (x) {
      maxElem = x;
      return tree;
    };
    return MLayout.hierarchyRebind(tree, hierarchy);
  };
  function getWidth (level) {
    if (level > MAX_LEVEL_HAVE_DIFFERENT_SIZE) {
      return NODE_W;
    }
    return NODE_W * (1 + 1/(1 + level));
  };
  function getHeight(level) {
    if (level > MAX_LEVEL_HAVE_DIFFERENT_SIZE)
      return NODE_H;
    return NODE_H * (1 + 1/(1 + level));
  };
}());
