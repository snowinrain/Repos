webApp.service('ZoomService', function(MapValue){
  this.handleZoom = function(value) {
    if (MapValue.container) {
      MapValue.container.zoomLevel(value);
    }
  }
})
