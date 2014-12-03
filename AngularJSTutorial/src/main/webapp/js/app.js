var app = angular.module('MyTutorialApp', [ 'ui.router', 'ngResource', 'ui.bootstrap.datetimepicker']);

app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/list');

	$stateProvider.state('list', {
        url: '/list',
        templateUrl: 'template/list.jsp'
    })
    .state('add', {
    	url: '/add',
    	templateUrl: 'template/add.jsp'
    })
	.state('edit', {
    	url: '/edit',
    	templateUrl: 'template/add.jsp'
    });
});

app.filter('range', function() {
	  return function(input, total) {
		    total = parseInt(total);
		    for (var i=0; i<total; i++)
		      input.push(i);
		    return input;
		  };
		});

app.factory("Employee", function ($resource) {
    return $resource("/AngularJSTutorial/employee/:id", {id: "@id"},
    	{
	        update: {
	            method: 'PUT'
	        },
	        paging: {
	        	method: 'GET'
		    }
    	}
    );
});

app.directive('sortBy', function () {
  return {
	    templateUrl: 'template/sort-by.jsp',
	    restrict: 'E',
	    transclude: true,
	    replace: true,
	    scope: {
	      sortdir: '=',
	      sortedby: '=',
	      sortvalue: '@',
	      onsort: '='
	    },
	    link: function (scope, element, attrs) {
	      scope.sort = function () {
	        if (scope.sortedby == scope.sortvalue)
	          scope.sortdir = scope.sortdir == 0 ? 1 : 0;
	        else {
	          scope.sortedby = scope.sortvalue;
	          scope.sortdir = 0;
	        }
	        scope.onsort(scope.sortedby, scope.sortdir);
	      }
	    }
	  };
});