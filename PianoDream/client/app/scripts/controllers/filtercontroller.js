webApp.controller('FilterController', function($scope, $rootScope, $cookies, $location, $moment, UpdateUIFactory,ConfValue, MapValue, SessionProvider, QSessionService, InitMapFactory, MapService){
//
  var LIFE_TIME = 1,
      YEAR = 2,
      WEEK = 3,
      MONTH = 4,
      CUSTOM = 5,
      FORMAT = "DD-MM-YYYY";
  var firstS = true;
  var firstE = true;
  var allTesters = [];
  var initialFilter = {
    filterName: 'all conditions',
    filterType: 1,
    sessionType: {
      script: true,
      automate: true,
      regression: true,
      exploratory: true
    }
  };
  $scope._ = {};
  $scope._.sumSession = function(sessions) {
    var num = 0;
    for(var index in sessions) {
      sessions[index] ? num++ : num
    }
    if(num === 0) return 'No session';
    if(num === 4) return 'All sessions';
    if(num > 0 && num < 4) return 'Sessions';
  }
  $scope._.initFilter = angular.copy(initialFilter);
  $scope._.filters = [];
  $scope._.curFilter = $scope._.initFilter;
  $scope._.choosenFilter = 'All conditions';
  $scope._.testerAndGroup = {};
  $scope.deleteFilterId = null;
  //
  $scope.date = {
    stDate: null,
    endDate: null
  }
  $scope.testerImage = "tester-all";
  $scope.session = {};
  $scope.lifeTime =[
    {name: "Lifetime", val: LIFE_TIME},
    {name: "Year", val: YEAR},
    {name: "Week", val: WEEK},
    {name: "Month", val: MONTH},
    {name: "Custom", val: CUSTOM}
  ];
  $scope.life =$scope.lifeTime[0];
  $rootScope.getTesters = getTesters;
  //
  $scope.updateLifeTime = function(id) {
    console.log(id);
    if (id) {
      var filter = $scope._.filters.filter(function(x) {
        return id === x.id;
      });
      console.log(filter)
      if(filter.length != 0) {
        var f = filter[0];
        $scope._.curFilter = angular.copy(f);
        $scope.date.stDate = f.date.stDate;
        $scope.date.endDate = f.date.endDate;
        $scope.testers = f.testers;
        $scope._.choosenFilter = f.filterName;
        updateSessions();
        UpdateUIFactory.updateUI($rootScope, 'EVT_CHANGE_SESSION_ANIMATION', {st: $scope.date.stDate, ed: $scope.date.endDate});
        UpdateUIFactory.updateUI($rootScope, 'EVT_SELECTED_TESTERS', {testers: f.testers});
      }
      return;
    }
    switch($scope.life.val) {
        case LIFE_TIME:
          var curFilter = angular.copy(initialFilter);
          $scope.date.stDate = $scope.session.findAppStartDate();
          $scope.date.endDate = $scope.session.findAppEndDate();
          $scope.testers = angular.copy(allTesters);
          $scope._.curFilter = curFilter;
          updateSessions();
          UpdateUIFactory.updateUI($rootScope, 'EVT_CHANGE_SESSION_ANIMATION', {st: $scope.date.stDate, ed: $scope.date.endDate});
          UpdateUIFactory.updateUI($rootScope, 'EVT_SELECTED_TESTERS', {testers: allTesters});
          break;
        case YEAR:
          var curFilter = angular.copy(initialFilter);
          curFilter.filterName = 'Year';
          $scope.date.stDate = moment().subtract('days', 365).valueOf();
          $scope.date.endDate = Date.now();
          $scope._.curFilter = curFilter;
          updateSessions();
          UpdateUIFactory.updateUI($rootScope, 'EVT_CHANGE_SESSION_ANIMATION', {st: $scope.date.stDate, ed: $scope.date.endDate});
          UpdateUIFactory.updateUI($rootScope, 'EVT_SELECTED_TESTERS', {testers: allTesters});
          break;
        case WEEK:
          var curFilter = angular.copy(initialFilter);
          curFilter.filterName = 'Week';
          $scope.date.stDate = moment().subtract('days', 7).valueOf();
          $scope.date.endDate = Date.now();
          $scope._.curFilter = curFilter;
          updateSessions();
          UpdateUIFactory.updateUI($rootScope, 'EVT_CHANGE_SESSION_ANIMATION', {st: $scope.date.stDate, ed: $scope.date.endDate});
          UpdateUIFactory.updateUI($rootScope, 'EVT_SELECTED_TESTERS', {testers: allTesters});
          break;
        case MONTH:
          var curFilter = angular.copy(initialFilter);
          curFilter.filterName = 'Month';
          $scope.date.stDate = moment().subtract('days', 30).valueOf();
          $scope.date.endDate = Date.now();
          $scope.curFilter = curFilter;
          updateSessions();
          UpdateUIFactory.updateUI($rootScope, 'EVT_CHANGE_SESSION_ANIMATION', {st: $scope.date.stDate, ed: $scope.date.endDate});
          UpdateUIFactory.updateUI($rootScope, 'EVT_SELECTED_TESTERS', {testers: allTesters});
          break;
        default:
          break;
    }
  }
  //
  $scope.$watch('date.stDate', function(newValue, oldValue){
    if (newValue != oldValue) {
    if(firstS){
      firstS = false;
      return;
    }
    UpdateUIFactory.updateUI($rootScope, 'EVT_CHANGE_SESSION_ANIMATION', {st: $scope.date.stDate, ed: $scope.date.endDate});
    updateSessions();
    }
  })
  $scope.$watch('date.endDate', function(newValue, oldValue){
    if(newValue != oldValue) {
    if(firstE){
      firstE = false;
      return;
    }
    UpdateUIFactory.updateUI($rootScope, 'EVT_CHANGE_SESSION_ANIMATION', {st: $scope.date.stDate, ed: $scope.date.endDate});
    updateSessions();
    }
  })
  $scope.handleTimelife = function(val) {
    $scope.session.analysis($scope.date.stDate, $scope.date.stDate + val*24*60*60*1000, $scope.testers);
    MapValue.container.applySession(QSessionService.initialized(SessionProvider.sessionData));
  }
  //
  function updateSessions(){
    if (angular.element.isEmptyObject(MapValue.container)) return;
    $scope.session.analysis($scope.date.stDate, $scope.date.endDate, $scope.testers);
    MapValue.container.applySession(QSessionService.initialized(SessionProvider.sessionData));
  }
  //
  //
  $rootScope.runSession = function(){
    console.log('----------> load session');
    SessionProvider.findAll(MapValue.cookie).then(function(session){
      console.log(this);
      if(session.data === '') return;
      var ses = session.analysis();
      $scope.session = session;
      $scope.date.stDate = parseInt(ses.findAppStartDate());
      $scope.date.endDate = parseInt(ses.findAppEndDate());
      //update to view
      UpdateUIFactory.updateUI($rootScope, 'EVT_CHANGE_SESSION_ANIMATION', {st: $scope.date.stDate, ed: $scope.date.endDate});
      //get testers
      allTesters = angular.copy(ses.findAppTesters());
      $scope.testers = ses.findFilterTesters();
      //
      $rootScope.getTesters(function postAction() {
         UpdateUIFactory.updateUI($rootScope, 'EVT_ALL_TESTERS', {testers: allTesters});
      })
    })
  }
  $scope.removeItem = function(val){
    // var groupOrTester = $scope._.testerAndGroup[val];
    // if(groupOrTester.type === 1) {
    //   for(var i = 0; i < groupOrTester.members.length;i++) {
    //     $scope.testers.splice($scope.testers.indexOf(groupOrTester.members[i]), 1);
    //   }
    // } else {
      $scope.testers.splice($scope.testers.indexOf(val), 1);
    // }
    updateSessions();
  }
  //
  $scope.addItem = function(add) {
    if(typeof add === 'undefined') return;
    var newItems = angular.copy(add);
    if(angular.isArray(newItems)) {
      // newItems = convertGroupToMembers(newItems, true);
      console.log(newItems);
      $scope.testers = $scope.testers.concat(newItems);
      $scope.testers = $scope.testers.unique();
      console.log($scope.testers)
    } else {
      // newItems = convertGroupToMembers(newItems, false);
      $scope.testers = $scope.testers.concat(newItems);
      $scope.testers = $scope.testers.unique();
    }
    console.log('======================');
    console.log($scope.testers);
    updateSessions();
  };
  //
  $rootScope.deleteFilter = function(filterId) {
    var index = $scope._.filters.reduce(function(previousValue, currentValue, index, array){
      if(currentValue.id == filterId) return index;
    })
    // call remove api
    MapService.deleteFilter($cookies.token, filterId).then(function(){
      $scope._.filters.splice(index, 1);
    });
  }
  //
  function convertGroupToMembers(list, isArray) {
    var groups = [];
    if(isArray){
        for(var i = 0; i< list.length;i++) {
          if($scope._.testerAndGroup[list[i]].type == 1){
            groups.push(list[i]);
          }
        }
        for(var i = 0; i < groups.length;i++) {
          list.splice(list.indexOf(groups[i]),1);
          list = list.concat($scope._.testerAndGroup[groups[i]].members);
        }
    } else {
      if($scope._.testerAndGroup[list].type === 1) {
        list = $scope._.testerAndGroup[list].members;
      } else {
        list = [list];
      }
    }
    return list;
  }
  // get list of testers and groups
  function getTesters(postAction) {
    var sample = {
      groups: [{
        name: 'qautomate',
        members: ['adnguyen', 'hngoc', 'tnguyen'],
        type: 1
      }],
      testers: [{
        name: 'hadnguyen',
        branch: 'HVH',
        type: 0
      },
      {
        name: 'hoatngoc',
        branch: 'HVT',
        type: 0
      },
      {
        name: 'David Bund',
        branch: 'HVT',
        type: 0
      },
      {
        name: 'John Smith',
        branch: 'HVT',
        type: 0
      },
      {
        name: 'Tim Robbins',
        branch: 'HVT',
        type: 0
      },
      {
        name: 'tamnguyen',
        branch: 'CH',
        type: 0
      }]
    };

    // MapService.getTesters().then(function(result){
    //   $scope._.testerAndGroup = hashConverter(sample);
    //   UpdateUIFactory.updateUI($rootScope, 'EVT_ADD_TESTERS_OPTION', {testers: sample.testers});
    //   UpdateUIFactory.updateUI($rootScope, 'EVT_ADD_GROUPS_OPTION', {groups: sample.groups});
    //   postAction();
    // })
    UpdateUIFactory.updateUI($rootScope, 'EVT_ADD_TESTERS_OPTION', {testers: $scope.testers});
    postAction();
  }
  // convert testers to hash
  function hashConverter(testers) {
    var result = {};
    for(var i = 0; i< testers.groups.length; i++) {
      result[testers.groups[i].name] = testers.groups[i];
    }
    for(var i = 0; i< testers.testers.length; i++) {
      result[testers.testers[i].name] = testers.testers[i];
    }
    return result;
  }
  Array.prototype.unique = function() {
    var o = {}, i, l = this.length, r = [];
    for(i=0; i<l;i+=1) o[this[i]] = this[i];
    for(i in o) r.push(o[i]);
    return r;
  };
})
