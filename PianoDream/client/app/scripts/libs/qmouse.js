var QMouse = {};
QMouse = (function () {
  QMouse = {
      X: 0,
      Y: 0,
      isDoubleClick: false,
      isMouseWheel: false,
      wheelDelta: 0,
      initialized: (function() {
        /** Initialization code.
         * If you use your own event management code, change it as required.
         */
        if (document.addEventListener) {
        /** DOMMouseScroll is for mozilla. */
          document.addEventListener('DOMMouseScroll', wheel, false);
        }
        /** IE/Opera. */
        //window.onmousewheel = document.onmousewheel = wheel; // will scroll twice on Chrome because we catch both Windows and Document event
          document.onmousewheel = wheel;


        /** Event handler for mouse wheel event.
         */
          function wheel(event){
            var delta = 0;
            if (!event) /* For IE. */
              event = window.event;
            if (event.wheelDelta) { /* IE/Opera. */
              delta = event.wheelDelta/120;
            } else if (event.detail) { /** Mozilla case. */
                    /** In Mozilla, sign of delta is different than in IE.
                     * Also, delta is multiple of 3.
                     */
              delta = -event.detail/3;
            }
                /** If delta is nonzero, handle it.
                 * Basically, delta is now positive if wheel was scrolled up,
                 * and negative, if wheel was scrolled down.
                 */
            if (delta) {
              handleWheel(delta, event);
            }
                /** Prevent default actions caused by mouse wheel.
                 * That might be ugly, but we handle scrolls somehow
                 * anyway, so don't bother here..
                 */
            if (event.preventDefault) {
              event.preventDefault();
            }
            event.returnValue = false;
          }

        // Handler for Wheel Event
        function handleWheel(delta, event) {

          QMouse.isMouseWheel = true;

          // Update Mouse Position
          QMouse.X = event.offsetX | event.layerX;
          QMouse.Y = event.offsetY | event.layerY;

          QMouse.wheelDelta = delta;
          if (0 < delta)
            $('#zoom-control-up img').click();

          if (0 > delta)
            $('#zoom-control-down img').click();

          QMouse.isMouseWheel = false;
          QMouse.wheelDelta = 0;
        }
      }()),
      getPositionByZoomRatio: function(x, y, zoomRatio){
        return {
            x: x * zoomRatio,
            y: y * zoomRatio
          };
      },
      convertGlobalToLocal: function(global,zoomRatio,viewBox) {
        return {
          x : global.x * zoomRatio + viewBox.X,
          y : global.y * zoomRatio + viewBox.Y
        };
      },
      setPositionByZoomRatio: function(x, y) {
        this.X = x;
        this.Y = y;
      }
  }
  return QMouse;
}())
