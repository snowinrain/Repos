webApp.controller("TestFilterController", function($scope, $rootScope, $moment, $cookies, MapValue, MapService){
  angular.element(initAnimate());
  $rootScope.getFilter = getFilter;
  $scope.today = function() {
    $scope.stDate = new Date();
    $scope.endDate = new Date();
  };
  $scope.today();
  $scope.openStartPicker = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.opened = true;
    angular.element(disableMonth());
  };
  $scope.openEndPicker = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.opened = true;
    angular.element(disableMonth());
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1,
    showWeeks: false,
    formatDayTitle: 'MMMM'
  };
  $scope.$watch('date.stDate', function(newValue, oldValue){
    if(newValue != oldValue) {
     $scope.stDate = new Date(newValue);
    }
  })
  $scope.$watch('date.endDate', function(newValue, oldValue){
    if(newValue != oldValue) {
     $scope.endDate = new Date(newValue);
    }
  })
  $scope.$watch('stDate', function(newValue, oldValue){
    if(newValue != oldValue) {
      var date = $moment(newValue).valueOf();
      $scope.date.stDate = date;
    }
  })
  $scope.$watch('endDate', function(newValue, oldValue){
    if(newValue != oldValue) {
      var date = $moment(newValue).valueOf();
      $scope.date.endDate = date;
    }
  })
  $scope.format = 'dd MMM, yyyy';
  // remove testers option
  $scope.saveFilter = function() {
    var filter = {
      date: {
        stDate: angular.copy($scope.date.stDate),
        endDate: angular.copy($scope.date.endDate)
      },
      testers: angular.element('#testers')[0].selectize.items || [],
      sessionType: {
        script: angular.copy($scope._.curFilter.sessionType.script) || false,
        automate: angular.copy($scope._.curFilter.sessionType.automate) || false,
        exploratory: angular.copy($scope._.curFilter.sessionType.exploratory) || false,
        regression: angular.copy($scope._.curFilter.sessionType.regression) || false
      },
      filterType: parseInt($scope._.curFilter.filterType) || 0,
      filterName: angular.copy($scope._.curFilter.filterName) || '',
      category: 0
    }
    if ($scope._.curFilter.filterName === '') return;
    var transformedFilter = convertFilterToJson(filter, MapValue.userSettings.userId);
    MapService.saveFilter(transformedFilter).then(function(id){
      filter.id = id;
      $scope._.filters.push(filter);
      $scope._.choosenFilter = filter.filterName;
    });
  }
  //
  $scope.showTesterInfo = function(selectedItem) {
    var item = selectedItem.split('||||');
    var type = item[1];
    $scope.selectedTester = item[0];
    console.log(type)
  }
  //
  function convertFilterToJson(filter, userId) {
    var sessionType = [];
    var timeLife = {};
    for(key in filter.sessionType) {
      if(filter.sessionType[key]) {
        sessionType.push(key);
      }
    }
    timeLife = {
      dateStart: filter.date.stDate,
      dateEnd: filter.date.endDate,
      category: filter.category
    }
    return {
      name: filter.filterName,
      userId: userId,
      filterType: filter.filterType,
      tester: JSON.stringify(filter.testers),
      sessionType: JSON.stringify(sessionType),
      timeline: JSON.stringify(timeLife),
      deleted: false,
      description: ''
    }
  }
  //
  function getFilter() {
    MapService.getFilter(MapValue.userSettings.userId).then(function(result) {
      var filters = [];
      for(var i=0; i< result.length; i++) {
        filters.push(convertJsonToFilter(result[i]));
      }
      $scope._.filters = filters;
      $scope._.curFilter = $scope._.initFilter;
    })
  }
  //
  function convertJsonToFilter(filter) {
    var fi,
        sessionType = ["script", "automate", "exploratory", "regression"],
        types = {};
    filter.sessionType = JSON.parse(filter.sessionType);
    filter.tester = JSON.parse(filter.tester);
    filter.timeline = JSON.parse(filter.timeline);
    for(var i =0; i < filter.sessionType.length; i++) {
      var key = filter.sessionType[i];
      if(sessionType.indexOf(key) != -1) {
        types[key] = true;
      } else {
        types[key] = false;
      }
    }
    fi = {
      id: filter.id,
      date: {
        stDate: filter.timeline.dateStart,
        endDate: filter.timeline.dateEnd
      },
      testers: filter.tester,
      sessionType: types,
      filterType: filter.filterType,
      filterName: filter.name,
      category: filter.timeline.category
    }
    return fi;
  }

})
