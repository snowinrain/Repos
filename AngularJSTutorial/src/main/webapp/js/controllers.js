app.controller("EmployeeController",function($scope, $http, $state, $filter, Employee) {

	$scope.$state = $state;

	$scope.totalPages = 0;
	$scope.headers = [
	                  {
	                    title: 'Fist Name',
	                    value: 'firstName'
	                  },
	                  {
	                    title: 'Last Name',
	                    value: 'lastName'
	                  },
	                  {
	                    title: 'Email',
	                    value: 'email'
	                  },
	                  {
	                    title: 'Gender',
	                    value: 'gender'
	                  },
	                  {
	                    title: 'DOB',
	                    value: 'birthDate'
	                  }];

	//default criteria that will be sent to the server
	$scope.filterCriteria = {
	   pageSize: 2,
	   pageNumber: 0,
	   sortDir: 0,
	   sortedBy: 'firstName'
	};

	//The function that is responsible of fetching the result from the server and setting the grid to the new result
	$scope.fetchResult = function () {
		$scope.employees = Employee.paging({
		 		pageSize:$scope.filterCriteria.pageSize,
		 		pageNum:$scope.filterCriteria.pageNumber,
		 		sortBy:$scope.filterCriteria.sortedBy,
		 		direction:$scope.filterCriteria.sortDir
	 		});

	};

	function init() {
		// Get List of Employees
		$scope.submitted = false;
		$scope.fetchResult();
	}

	//called when navigate to another page in the pagination
	$scope.selectPage = function (page) {
	  $scope.filterCriteria.pageNumber = page;
	  $scope.fetchResult();
	};

	//call back function that we passed to our custom directive sortBy, will be called when clicking on any field to sort
	$scope.onSort = function (sortedBy, sortDir) {
	  $scope.filterCriteria.sortDir = sortDir;
	  $scope.filterCriteria.sortedBy = sortedBy;
	  $scope.filterCriteria.pageNumber = 0;
	  $scope.fetchResult().then(function () {
	    //The request fires correctly but sometimes the ui doesn't update, that's a fix
	    $scope.filterCriteria.pageNumber = 0;
	  });
	};

	//manually select a page to trigger an ajax request to populate the grid on page load
	$scope.selectPage(0);

	$scope.$watch('emp.birthDate', function (newValue) {
	    $scope.emp.birthDate = $filter('date')(newValue, 'yyyy-MM-dd'); // Or whatever format your real model should use
	});

	$scope.$watch('filterCriteria.pageSize', function (newValue) {
	    $scope.filterCriteria.pageSize = newValue;
	    $scope.fetchResult();
	    $scope.selectPage(0);
	});

	$scope.deleteEmp = function(emp) {
		var employee = new Employee({id:emp.id});
		employee.$delete({}, function() {
			init();
	    });
	}

	$scope.selectedEmp = function(emp) {
		$scope.emp = emp;
	}

	$scope.navToAddEmp = function() {
		$scope.emp = [];
	}


	$scope.addOrEditEmployee = function(isValid) {
		$scope.submitted = true;
		// check to make sure the form is completely valid
		if (isValid) {
			var emp = new Employee($scope.emp);
			emp.$save({}, function() {
				$state.transitionTo('list');
					init();
		        });
			}
		};


});