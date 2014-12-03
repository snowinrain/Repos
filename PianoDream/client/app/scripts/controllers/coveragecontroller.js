webApp.controller('CoverageController', function($scope, ConfValue, MapValue) {
  $scope.bug = false;
  $scope.sug = false;
  $scope.note = false;
  $scope.question = false;
  $scope.perspectiveView = 0;
  $scope.nodeColor = 0;
  $scope.curColorLine = "images/green_line.png";
  $scope.curColor = {red: 103, green: 153, blue: 15};
  $scope.curColorByTypes = [];
  var colors = [];
  var GREEN = 0,
      ORANGE = 1,
      RED = 2,
      PURPLE = 3,
      VIOLET = 4,
      CYAN = 5;
  colors[GREEN] = {img:"images/green_line.png", color:{red: 103, green: 153, blue: 15}};
  colors[ORANGE] = {img:"images/orange_line.png", color:{red: 218, green: 145, blue: 4}};
  colors[RED] = {img:"images/red_line.png", color:{red: 255, green: 17, blue: 6}};
  colors[PURPLE] = {img:"images/puble_line.png", color:{red: 179, green: 50, blue: 239}};
  colors[VIOLET] = {img:"images/violet_line.png", color:{red: 78, green: 82, blue: 255}};
  colors[CYAN] = {img:"images/blue_line.png", color:{red: 38, green: 148, blue: 181}};
  $scope.curColorByTypes[0] = {colors: colors[GREEN], node: 0};
  $scope.curColorByTypes[1] = {colors: colors[RED], node: 2};
  //
  $scope.$watch('bug', function(newVal, oldVal){
    if(oldVal != newVal) {
      ConfValue.DEFAULT.showBugs = $scope.bug;
      MapValue.container.toggleShowBugs();
    }
  });
  //
  $scope.$watch('sug', function(newVal, oldVal){
    if(oldVal != newVal) {
      ConfValue.DEFAULT.showSuggestions = $scope.sug;
      MapValue.container.toggleShowSuggestions();
    }
  })
  //
  $scope.$watch('question', function(newVal, oldVal) {
    if(oldVal != newVal) {
      ConfValue.DEFAULT.showQuestions = $scope.question;
      MapValue.container.toggleShowQuestions();
    }
  })
  //
  $scope.$watch('note', function(newVal, oldVal) {
    if(oldVal != newVal) {
      ConfValue.DEFAULT.showNotes = $scope.note;
      MapValue.container.toggleShowNotes();
    }
  })
  //
  $scope.$watch('nodeColor', function(newValue, oldValue){
    if(oldValue != newValue) {
      var value = parseInt(newValue);
      $scope.curColorLine = colors[value].img;
      $scope.curColor = colors[value].color;
      $scope.curColorByTypes[$scope.perspectiveView].colors = colors[value];
      $scope.curColorByTypes[$scope.perspectiveView].node = value;
      MapValue.container.applyColor(colors[value].color);
      MapValue.NODE_COLOR = colors[value].color;
    }
  })
  //
  $scope.$watch('perspectiveView', function(newValue, oldValue){
    if(newValue !== oldValue) {
      // default is visit count
      MapValue.container.applyColor($scope.curColorByTypes[newValue].colors);
      MapValue.NODE_COLOR = $scope.curColorByTypes[newValue].colors.color;
      $scope.nodeColor = $scope.curColorByTypes[$scope.perspectiveView].node;
    }
  })
})

