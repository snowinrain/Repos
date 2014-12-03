webApp.controller('HomeController', function($scope, $cookies, $location, $routeParams, MapService, MapValue){
  var token = 'bmVwaGVsZXxuZXBoZWxlcHJvQGdtYWlsLmNvbToxNDM5ODgzMTgzNzUxOjgyMDY1MjM2YWNhY2Q2MjhhMGRhNWFlOWQ0ZWUzY2Qx';
  $cookies.token = token;
  $scope.mainTemplate = 'empty_template.html';
  if (typeof token === 'undefined') {
    $location.path('/');
  } else {
    validateToken($cookies.token);
  }
  function validateToken(token){
    MapService.evaluateToken(token).then(function(result) {
      MapValue.userSettings = result;
      $scope.mainTemplate = 'home_content_template.html';
    })
  }
})
