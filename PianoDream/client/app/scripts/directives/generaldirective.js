/*webApp.directive('qmapDatePicker', function($parse){
  return {
    restrict: "A",
    scope: {
      qmapDate: "=",
      qmapChange: "&"
    },
    link: function(scope, element, attr){
      element.
      datepicker({
        dateFormat : "dd-mm-yy",
        showOtherMonths : true,
        selectOtherMonths : true,
        onSelect: function(dateStr){
          var splDate = dateStr.split('-'),
              miliDate = new Date(parseInt(splDate[2]), parseInt(splDate[1]) - 1, parseInt(splDate[0])).getTime();
          scope.$apply(function(){
            scope.qmapDate = miliDate;
          })
          scope.$apply(function(){
            scope.qmapChange();
          })

        }
      }).
      datepicker('setDate', new Date());

      scope.$watch('qmapDate', function(val){
        element.datepicker('setDate', new Date(val))
      });


    }
  }
});*/
//
var slideToEnd = false;
webApp.directive('bug', function(){
  return {
    restrict: "A",
    scope: {
      bug: "=ngModel"
    },
    link: function(scope, element, attr){
      element.click(function(){
        if (element.is(':checked')) {
          scope.$apply(function(){
            scope.bug = true;
          })
        } else {
          scope.$apply(function(){
            scope.bug = false;
          })
        }
      })
    }
  }
})
//
webApp.directive('restore', function(){
  return {
    restrict: "EA",
    scope: {
      action: '&'
    },
    link: function(scope, elem, attr) {
      elem.click(function() {
        if(parseInt(elem.attr('val')) == 1) return;
        $('#btn-restore-modal').click();
      })
      $('#btn-restore').click(function(){
        scope.$apply(function() {
          console.log("LOL_FIRST_TIME")
          scope.action();
        })
      })
    }
  }
})
//
webApp.directive('slider', function() {
  return {
    restrict: 'AE',
    scope: {
      action: '&'
    },
    link: function(scope, elem, attr) {
      $("#zoom-control-slider").on("slidechange", function(event, ui) {
          scope.action({zlevel: ui.value});
      });
      scope.$on('EVT_ZOOM', function(event, level) {
        $("#zoom-control-slider").slider('value', level);
      })
    }
  }
})
//
webApp.directive('level', function() {
  return {
    restrict: 'AE',
    scope: {
      action: '&'
    },
    link: function(scope, elem, attr) {
        $("#nav-level-slider").on("slidechange", function(event, ui) {
          scope.action({clevel: ui.value});
        })
    }
   }
})
//
webApp.directive('timelife', function() {
  return {
    restrict: 'AE',
    scope: {
      action: '&'
    },
    link: function(scope, elem, attr) {
      $("#nav-animate-slider").on('slidechange', function(event, ui) {
        if(slideToEnd) {
          slideToEnd = false;
          return;
        }
        scope.action({val: ui.value});
      })
    }
  }
})
//
webApp.directive('maxVisit', function() {
  return{
    restrict: 'A',
    link: function(scope, elem, attr){
       scope.$on('EVT_MAX_VISIT', function(event, mess){
         elem.html(mess);
       });
    }
  }
})
//
webApp.directive('animate', function() {
  return {
    restrict: 'AE',
    link: function(scope, elem, attr) {
      var isAnimateFillSession = false,
          animateSlider = $("#nav-animate-slider");
      scope.$on('EVT_CHANGE_SESSION_ANIMATION', function(event, mess){
        var days = (mess.ed - mess.st)/(1000*60*60*24);
        slideToEnd =  true;
        animateSlider.slider("option", "max", Math.ceil(days));
        animateSlider.slider("option", "value", Math.ceil(days));
      });
    }
  }
})
//
webApp.directive('deleteFilterConfirm', function() {
  return {
    restrict: 'AE',
    scope: {
      action: '&'
    },
    link: function(scope, elem, attr) {
      $('#btn-delete-filter').click(function() {
        var fid = $('#btn-delete-filter').attr('fid');
        scope.action({fid: fid});
      })
    }
  }
})
//
webApp.directive('selectTesters', function(){
  return {
    restrict: 'AE',
    scope: {
      removeAction: '&',
      addAction: '&'
    },
    link: function(scope, elem, attr) {
      var TESTER = 0;
      var GROUP = 1;
      var sl = selectize[0].selectize;
      var added = false;
      scope.$on('EVT_ALL_TESTERS', function(event, mess){
        if (typeof mess.testers === "undefined") return;
        for(var i=0; i<mess.testers.length; i++) {
          added = false;
          sl.addOption({type: TESTER, text: mess.testers[i], value: mess.testers[i]});
          sl.addItem(mess.testers[i]);
          added = true;
        }
        scope.addAction({add: mess.testers});
      });
      scope.$on('EVT_SELECTED_TESTERS', function(event, mess) {
        if (typeof mess.testers === "undefined") return;
        sl.clear();
        for(var i=0; i< mess.testers.length; i++) {
          added = false;
          sl.addItem(mess.testers[i]);
          added = true;
        }
        scope.addAction({add: mess.testers});
      })
     scope.$on('EVT_ADD_TESTERS_OPTION', function(event, mess) {
      if(typeof mess.testers === "undefined") return;
      for(var i = 0; i< mess.testers.length; i++) {
        sl.addOption({type: TESTER, text: mess.testers[i].name, value: mess.testers[i].name});
      }
     })
     //
     scope.$on('EVT_ADD_GROUPS_OPTION', function(event, mess) {
      if(typeof mess.groups === "undefined") return;
      for(var i = 0; i< mess.groups.length; i++) {
        sl.addOption({type: GROUP, text: mess.groups[i].name, value: mess.groups[i].name});
      }
     })
     //
     sl.on('item_add', function(value){
      if(added) {
        scope.addAction({add: value})
      }
     })
     sl.on('item_remove', function(value){
       scope.removeAction({val: value});
     });
    }
  }
})



