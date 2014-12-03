webApp.controller('UserProjectController', function($scope, $rootScope, $location, $cookies, $route, MapService, MapValue){
  $scope.max = 2;
  $scope.isShow = false;
  $scope.projects = [];
  $rootScope.curProject = {};

  // TODO: the below line is fake, use the commented code
  //scope.displayName = MapValue.userSettings.displayName;
  $scope.displayName = "Nephele Pro";

  angular.element(showLoadingModal());


  MapService.getLocalProjects(null, null).then(function(localProjects){
    $scope.projects = localProjects;
    $rootScope.curProject = ensureProjectId($cookies, localProjects);
    console.log('run main flow when having cookie');
    $rootScope.runMainFlow();
    MapService.checkProjectUser($rootScope.curProject.id).then(function(data){
      if (data == "false") {
        createUserProject($rootScope.curProject.id);
      }
    })
  })

  //
  $scope.changeProject = function(project){
    angular.element(showLoadingModal());
    $cookies.pid = project.id;
    $rootScope.curProject = project;
    $rootScope.runMainFlow();
  }
  //
  $scope.performLogout = function() {
    destroyUserInformation();
    $location.path('/');
  }
  //
  function destroyUserInformation() {
    delete $cookies.username;
    delete $cookies.password;
    delete $cookies.domain;
    delete $cookies.token;
  }
  //
  function createUserProject(pid) {
    var userP = {
      userId: MapValue.userSettings.userId,
      role: 'admin',
      description: '',
      status: 'new',
      token: MapValue.userSettings.token
    }
    console.log(userP);
    MapService.createUserProject(pid, userP).then(function(result){
      console.log(result.data);
    })
    console.log('create user project');
  }
  //
  function ensureProjectId($cookie, localProjects){
    var curProject = null;
    if($cookies.pid) {
      var savedProject = localProjects.filter(function(x){return x.id == $cookies.pid});
      if(savedProject.length !== 0) {
        curProject = savedProject[0];
      }
    } else {
      curProject = localProjects[0];
      $cookie.pid = localProjects[0].id
    }
    return curProject;
  }
})

