var webApp = angular.module('qmap',['ngRoute','angular-momentjs','ui.bootstrap', 'ngCookies', 'ngResource']);
webApp.config(function($routeProvider, $httpProvider) {
  $routeProvider.when('/home', {
    controller: 'HomeController',
    templateUrl: 'home_template.html'
  })
  .otherwise({
    redirectTo : '/home'
  })
})
webApp.value('ConfValue',{
  CIRCLE: 1,
  SIMPLE: 2,
  BRANCH: 3,
  HORIZONTAL: 4,
  MAX_LEVEL_HAVE_DIFFERENT_SIZE: 3,
  NODE_W: 120,
  NODE_H: 35,
  MIN_LEVEL_NODE: 0,
  SVG_ID: 'div-svgid',
  DEFAULT: {
    showBugs : false,
    showSuggestions : false,
    showNotes : false,
    showQuestions : false
  },
  NODE_LINK_DEFAULT_COLOR: {
    RED: 255,
    GREEN: 255,
    BLUE: 255
  },
  DEFAULT_EXPAND_COLLAPSE_ANIMATE: 500,
  DEFAULT_COLLAPSE_ANIMATE_TYPE: 'backIn',
  DEFAULT_EXPAND_ANIMATE_TYPE: 'backOut',
  ZOOM_LEVEL_MAX: 31,
  ZOOM_LEVEL_MIN: 1,
  ZOOM_LEVEL_DEFAULT: 16,
  ZOOM_LEVEL_BEGIN: 16,
  ZOOM_SCALE_RATIO_BELOW_ORIGINAL_SIZE: 0.05,
  ZOOM_SCALE_RATIO_ABOVE_ORIGINAL_SIZE: 0.5,
  TOTAL_TIME_SESSION_ANIMATE: 1000,
  SVG_PADDING: 5,
  RATIO_W: 150,
  RATIO_H: 85,
  NODE_TREE_W: 180,
  NODE_HEIGHT_PADDING_RATIO: 1.3
})
webApp.value('MapValue', {
  mMap: {},
  cMap: {},
  pMap: {},
  container: {},
  gContainer: {},
  isInitialized: false,
  IS_NODE_EXPAND: false,
  IS_FIRST_FILL_SESSION: true,
  CUR_LEVEL: 5,
  CUR_MAP_TYPE: 2,
  rootNodeTemporary: {},
  xRootCenterTemporary: {},
  gPaper:{},
  maxVisitCount: 0,
  jsconf: {},
  CANVAS_W:0,
  CANVAS_H:0,
  mMapo: null,
  dHistory: null,
  cache: {},
  cookie: {},
  userSettings: {},
  listTitles: [],
  curProject: {},
  NODE_COLOR: {
    red: 103,
    green: 153,
    blue: 15
  }
})
