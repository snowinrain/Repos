webApp.factory('UpdateUIFactory', function(ConfValue){
  return {
    updateUI: function(rootScope, event, value){
      rootScope.$broadcast(event, value);
    }
  }
})
