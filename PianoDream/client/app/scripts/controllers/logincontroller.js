webApp.controller('LoginController', function($scope, $location, $cookies, LoginService, MapValue){
  $scope.username = "nephelepro@gmail.com";
  $scope.password = "admin123";
  $scope.domain = "nephelepro@gmail.com";
  $scope.error = null;
  $scope.rememberMe = false;
  //
  angular.element(hideLoading());
  // remember user
  $scope.performLoginAction = login;
  $scope.detectEnterKey = pressEnter;
  //
  function login(userInfo) {
    var userInfo = userInfo || {
      username: $scope.username || '',
      password: $scope.password || '',
      domain: $scope.domain || ''
    };
    LoginService.getToken(userInfo).then(function(result) {
      var data = result.data;
      var token = result.headers('X-qMap-Authentication');
      data['token'] = token;
      if(typeof data.isSuccess === "undefined") {
        storeUserInfo(data, token, MapValue);
        $location.path('/home');
      } else {
        showError();
      }
    }, function(err){
      showError();
    })
  }
  //
  function showError(){
    $scope.error = 'has-error';
  }
  //
  function storeUserInfo(userSettings, token, MapValue) {
    //save to cookie
    if($scope.rememberMe) {
      $cookies.remember = 1;
    }
    $cookies.token = token;
    MapValue.userSettings = userSettings;

  }
  //
  function pressEnter(isEnter) {
    if(isEnter) {
      Login();
    }
  }
})
