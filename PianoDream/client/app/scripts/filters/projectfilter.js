webApp.filter('ProjectFilter',function(){
  var max = 2;
  return function(projects, pid){
    var r = projects.filter(function(x){
      return x.id != pid;
    })
    return r.slice(0, 10);
  }
})
webApp.filter('FilterTeam',function(){
  return function(filters){
    return filters.filter(function(x){
      return x.filterType === 1;
    })
  }
})
webApp.filter('FilterPersonal',function(){
  return function(filters){
    return filters.filter(function(x){
      return x.filterType === 0;
    })
  }
})
webApp.filter('Truncate', function() {
  var len = 10;
  return function(list) {
    return list.slice(0, len);
  }
})
webApp.filter('SubString', function() {
  var len = 20;
  return function(str) {
    if(typeof str === "undefined") return;
    if(str.length >= len) return str.substr(0, len)+'...'
    return str;
  }
})
