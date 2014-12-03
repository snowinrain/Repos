webApp.service('LoginService', function($http){
   this.getToken = function(uinfo) {
    return $http.post(API_HOST+'user/login', uinfo).then(function(result) {
      return result;
    }, function(err){

    	return err.data;

		// // TODO: fake code
	 //    var userInfo ={
	 //      userId: "nephelepro@gmail.com",
	 //      displayName: "Nephele Pro",
	 //      email: "nephelepro@gmail.com"

	 //    };
		// return userInfo;
    })

  }
})


