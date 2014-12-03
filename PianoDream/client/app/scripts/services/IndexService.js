webApp.service('IndexService', function($http){
  // get all project
  this.getProjects = function(from, to){
    return $http.get(API_HOST+'page/projects/'+from+'/'+to).then(function(result){
      return result.data;
    })
  }
})
