//$(document).ready(function(){
var first = true;

function showLoading() {
  $('.loading-overlay').show();
  $('#project-container').append('<div class="overlay" style="width: 100%; height: 100%; background-color:#3A3A3A; position: fixed; top:0px; left:0px"></div>');
  $(".view").prepend('<div class="other-overlay" style="width:100%; height: 100%; position:absolute; top: 0; left: 0; z-index: 40"></div>');
}
function showLoadingModal() {
  $('.loading-overlay').show();
  $('#project-container').append('<div class="overlay" style="width: 100%; height: 100%; background-color:#3A3A3A; position: fixed; top:0px; left:0px"></div>');
}
function hideLoadingModal() {
  $('.loading-overlay').hide();
  $('.overlay').fadeOut('slow');
}
function removeDrillDown() {
    $("#nav-drilldown-group-item").html("");
    $("#bt-drilldown-home").css("display", "none");
    $("#nav-restore-map-img").attr("src", "images/restore-map.png");
    $("#nav-restore-map").attr('val', 0);
}

function hideLoading() {
  $('.loading-overlay').hide();
  $('.overlay').fadeOut('slow');
  $('.other-overlay').remove();
}
function showTesterInfo(name, type) {
  $('#show-tester').val(name+'||||'+type);
  $('#show-tester').trigger('input');
  $('#show-tester').click();
}
function createXMIND(fileName, content, styles, attachments, manifest) {
  var zip = new JSZip();
  for(index in attachments) {
    var img = attachments[index];
    var imgData = img.substr(img.indexOf(',') + 1);
    zip.folder('attachments').file(index+'.png', imgData, {base64: true});
  }
  zip.folder('META-INF').file('manifest.xml', manifest);
  zip.file("content.xml", content);
  zip.file("styles.xml", styles);
  content = zip.generate({type:"blob"});
  saveAs(content, fileName+'.xmind');
}
function showFilterConfirm() {
  $('#btn-delete-filter-modal').click();
}
function deleteFilter(evt, self) {
  evt.stopPropagation();
  var id = $(self).attr('value');
  $('#btn-delete-filter').attr('fid', id);
  $('#btn-delete-filter-modal').click();
}
function initAnimate() {
    // Added 2014-06-17
    // Added 2014-06-17
    if (!first) return;
    $('.dropdown-part-name').on('click', function(e) {
        e.stopPropagation();
    });
    $('.dropdown-menu .dropdown-part li').on('click', function(e) {
        var x = e.target;
        $('#current-filter-input').val($(e.target).text().trim());
    });
    // delete filter
    $('.delete-filter').click(function(evt) {
      console.log('delete filter');
      evt.stopPropagation();
    })
    // Show hide marker
    $('.marker-list-item-label').on('click', function(e) {
        e.stopPropagation();
    });
    $('.map-type-list-item-label').on('click', function(e) {
        e.stopPropagation();
    });
    // Change color
    $('.color-list-item-label').on('click', function(e) {
        e.stopPropagation();
    });
    //
    $('.filter-name').click(function() {
      $(this).select();
    })
    //  $('.project-list li.project-list-item').on('click', function(e) {
    //    var x = e.target;
    //    $('#project-name').text($(e.target).text().trim());
    //  });
    $('#nav-project-list .project-list .project-list-holder').on('click', function(e) {
        e.stopPropagation();
    });
    //save filter animate
    $('#save-filter').click(function() {
      $(this).hide();
      $('.save-filter-bar').removeClass('hide');
    })
    //
    $('#save-filter-name ').click(function(){
      $('.save-filter-bar').addClass('hide');
      $('#save-filter').show();
    })
    $('#cancel-filter-name').click(function() {
      $('.save-filter-bar').addClass('hide');
      $('#save-filter').show();
    })
    // Define plugin for click item on selectize item
    Selectize.define('click_item', function(options) {
      self = this;
      this.setupTemplates = (function(){
        var origin = self.setupTemplates;
        return function(){
          var field_label = self.settings.labelField
          origin.apply(this, arguments);
          self.settings.render['item'] = function(data, escape) {
            var className = '',
                style = '';
            if(data.type) {
              style = "background-color: red";
              className = "group-item";
            } else {
              className = "tester-item";
            }
            console.log(className);
            return '<div class="item '+className+'" style="'+style+'"><span onclick="showTesterInfo(\''+escape(data[field_label])+'\','+data.type+')">' + escape(data[field_label]) + '</span></div>';
          }
          self.settings.render['option'] = function(data, escape) {
            var className = '',
                style = '';
            if(data.type) {
              style = "background-color: red";
              className = "group-item-option";
            } else {
              className = "tester-item-option";
            }
            console.log(className);
            return '<div class="option" class="'+ className +'" style="'+style+'">' + escape(data[field_label]) + '</div>';
          }
        }
      }())
    })
    //choose testers
    selectize = $('#testers').selectize({
        plugins: ['remove_button', 'click_item'],
        delimiter: ',',
        persist: true
    });
    $("#export-pdf").click(function()
    {
        //exportToPNG();
    });


    //-----------------------------------------------
    var navUser = "#nav-user",
        userNav = "#user-nav",
        value = "";
    $(navUser).click(function(e) {
        value = $(userNav).css("display");
        if (value == "none") {
            $(userNav).show();
        } else {
            $(userNav).hide();
        }
        $(userNav).css('left', offsetLeft($('#logo')[0]));
        e.stopPropagation();
    });
    autoHide(userNav, navUser);
    //
    $('#nav-filter').on('click', function(e) {
        var element = $("#filter-nav");
        var value = element.css("display");
        if (value == "none") {
            var headerWidth = $("#header").width();
            element.css({
                left: Math.min(this.offsetLeft, headerWidth - element.width()) + 'px'
            });
            element.show();
        } else {
            element.hide();
        }
        e.stopPropagation();
    });
    autoHide("#marker-nav", "#nav-marker");
    autoHide("#filter-nav", "#nav-filter");
    $('#loading-screen').hide();
    //
    function offsetLeft(obj) {
        if (obj.offsetParent) {
            return obj.offsetLeft + offsetLeft(obj.offsetParent);
        } else {
            return obj.offsetLeft;
        }
    }
    //
    function autoHide(idName, parentIdName) {
        $('body').click(function(e) {
            var divIdName = idName;
            if (e.target.id == idName || $(e.target).parents(divIdName).size()) {} else {
                if (parentIdName != e.target.id) {
                    $(divIdName).hide();
                }
            }
        });
    }
    $('.filter-toggle').click(function() {
        $('.right-bar').toggle();
    })
    // show and hide tester image
    $('#filter-nav').click(function() {
        updateImageTester();
    });
    // image for tester
    function updateImageTester() {
        var numTest = $('#filter-nav').find('input[type="checkbox"]:checked').length;
        switch (numTest) {
            case 0:
                $('#nav-marker-tester').find('img').attr('src', 'images/tester.png')
                break;
            case 1:
                $('#nav-marker-tester').find('img').attr('src', 'images/tester-check.png')
                break;
            default:
                $('#nav-marker-tester').find('img').attr('src', 'images/tester-all.png')
                break;
        }
    }
    //more marker
    $("#nav-marker-more").click(function(e) {
        var element = $("#marker-nav");
        var value = element.css("display");
        if (value == "none") {
            var headerWidth = $("#header").width();
            element.css({
                left: Math.min(this.offsetLeft, headerWidth - element.width()) + 'px'
            });
            element.show();
        } else {
            element.hide();
        };
        e.stopPropagation();
    });
    //
    var zoomSlider = $("#zoom-control-slider");
    zoomSlider.slider({
        orientation: "horizontal",
        range: "min",
        min: 1,
        max: 31,
        value: 16,
        animate: true
    });
    // zoom slider
    $("#zoom-control-up img").click(function() {
        var value = zoomSlider.slider("value") + 1;
        zoomSlider.slider("value", value);
    });
    $("#zoom-control-down img").click(function() {
        var value = zoomSlider.slider("value") - 1;
        zoomSlider.slider("value", value);
    });
    //
    //  $('.map-layouts-list-dropdown li').click(function() {
    //    $('.map-layouts-list-dropdown li i').attr('style', '');
    //    $(this).find('i').attr('style', 'color: greenyellow')
    //  })
    // level slider
    var levelSlider = $("#nav-level-slider");
    levelSlider.slider({
        range: "min",
        min: 1,
        max: 6,
        value: 6,
        animate: true
    });
    $("#nav-level-left").click(function() {
        var value = levelSlider.slider("value") - 1;
        levelSlider.slider("value", value);
    });
    $("#nav-level-right").click(function() {
        var value = levelSlider.slider("value") + 1;
        levelSlider.slider("value", value);
    });
    //
    $('#bt-drilldown-home').click(function() {
        removeDrillDown();
    })
    // save map
    $('#nav-save-map').click(function() {
        $("#nav-save-text").text("Saving..");
        setTimeout(function() {
            $("#nav-save-text").text("Save Complete").addClass("blink");
        }, 1000);
        setTimeout(function() {
            $("#nav-save-text").removeClass("blink").text("");
        }, 4000);
    })
    // for animate slider
    var btnStartFillSession = $("#nav-animate-button-start"),
        btnStartIcon = $("#nav-animate-button-start img"),
        isAnimateFillSession = false,
        days = 0,
        val = 5,
        animateSlider = $("#nav-animate-slider"),
        min = $("#textfield-animate-start-date").val(),
        max = $("#textfield-animate-end-date").val();
    animateSlider.slider({
        range: "min",
        min: 0,
        max: 5,
        value: 5,
        animate: "fast"
    });
    // TODO: Notice: Start Animating date-filter slider
    btnStartFillSession.click(function() {
        if (isAnimateFillSession == true) {
            stopInterval();
            return;
        }
        btnStartIcon.attr("src", "images/ic_animate_pause.png");
        isAnimateFillSession = true;
        days = animateSlider.slider("option", "max");
        val = animateSlider.slider("value");
        if (val == days) {
            val = 0;
            animateSlider.slider("option", "animate", false);
            animateSlider.slider("value", 0);
        }
        var interval = 1000 / (days * 5);
        // Start Animating date-filter slider
        var myVar = setInterval(myTimer, interval);

        function myTimer() {
            animateSlider.slider("option", "animate", true);
            // Adding "ClientUIControls.isAnimateFillSession" 2014-05-06
            if (val > days || isAnimateFillSession == false) {
                stopInterval();
            } else {
                animateSlider.slider("value", val);
                val++;
            }
        }
        // Stop Interval
        function stopInterval() {
            clearInterval(myVar);
            isAnimateFillSession = false;
            btnStartIcon.attr("src", "images/ic_animate_start.png");
        }
    })
    //
    function parseDate(str) {
        return moment(str, 'DD-MM-YYYY');
    }

    function dayDiff(first, second) {
        var dFirst = parseDate(first);
        var dSecond = parseDate(second);
        return (dSecond - dFirst) / (1000 * 60 * 60 * 24);
    }
    //  $('#screen-finder-input').click(showListTitles);
    //  $('#screen-finder-input').keyup(showListTitles)
    //  function showListTitles() {
    //    var len = 10;
    //    var itemList = $('.item-title-name');
    //    if(itemList.length > 10) {
    //
    //    }
    //  }
    $('#project-finder-input').keyup(function(e) {
        if (e.keyCode == 13) {
            $('.project-list-item').eq(0).click();
        }
    });
}
// Datepicker
// Disable Month select button
function disableMonth() {
    $(".home-date-picker ul.dropdown-menu.ng-valid.ng-valid-date table thead .btn[id^='datepicker-']").prop("disabled", true);
}


//---------- For ExportToPNG ---------------------
function exportToPNG_new() {

    var svg = document.getElementById("div-svgid").innerHTML;

    //Create the canvas element
    var canvas = document.createElement('canvas');
    canvas.id = "canvas";
    document.body.appendChild(canvas);

    //Load the canvas element with our svg
    canvg(document.getElementById('canvas'), svg);

    //Save the svg to png
    var result = Canvas2Image.saveAsPNG(canvas);

    //console.log("SVG: " + svg);
    //console.log("Result save: " + result);

    //Clear the canvas
    canvas.width = canvas.width;
}


function exportToPNG_1() {

    var svgTag = $("#div-svgid > svg");
    //console.log(svgTag.html());
    var width = svgTag.attr('width');
    var height = svgTag.attr('height');
    //var width = svgTag.width();
    //var height = svgTag.height();
    //var width = 640;
    //var height = 480;

    //var svgCanvas = document.getElementById('test');
    var svgCanvas = document.createElement('canvas');
    svgCanvas.width = width;
    svgCanvas.height = height;
    var canvasContext = svgCanvas.getContext("2d");

    //canvasContext.drawSvg('<svg> <defs>  <radialGradient r="0.5" cy="0.5" cx="0.5" id="svg_2">   <stop stop-color="#ff0000" offset="0"/>   <stop stop-color="#ffff00" offset="1"/>  </radialGradient> </defs> <g>  <title>Layer 1</title>  <rect fill="url(#svg_2)" height="78" width="136" y="107" x="109"/> </g></svg>', 0 , 0 , 640, 480);
    canvasContext.drawSvg('<svg >' + svgTag.html() + '</svg>', 0 , 0 , width, height);
    //var htmlCont = svgTag.html();
    //canvasContext.drawSvg(htmlCont, 0 , 0 , width, height);

    var img = svgCanvas.toDataURL("image/png");
    //var img = 'data:image/png;base64,' + btoa(svgTag.html())

    // var ctx = document.createElement('canvas');
    // ctx.width = ctx.height = 500;
    // ctx.getContext("2d").drawSvg('<svg><rect x="0" y="0" width="100" height="100" fill="red" /><rect x="0" y="100" width="100" height="100" fill="black" /><rect x="100" y="0" width="100" height="100" fill="yellow" /><rect x="100" y="100" width="100" height="100" fill="green" /></svg>', 0 , 0 , 500, 500);

    // var img1 = ctx.toDataURL("image/png");

    var a = document.getElementById("export-pdf-link");
    a.download = "qMap.png";
    a.href = img;

    $("#svgdataurl").attr("src", img);

    console.log(img);

    // var html = d3.select("#div-svgid > svg").attr("version", 1.1)
    // .attr("xmlns", "http://www.w3.org/2000/svg").node().parentNode.innerHTML;

    // var imgsrc = 'data:image/svg+xml;base64,' + btoa(html);
    // var canvas = document.querySelector("canvas"),
    //     context = canvas.getContext("2d");
    // var image = new Image;
    // image.src = imgsrc;
    // image.onload = function() {
    //     context.drawImage(image, 0, 0);
    //     var canvasdata = canvas.toDataURL("image/png");
    //     var pngimg = '<img src="' + canvasdata + '">';
    //     $("#pngdataurl").html(pngimg);

    // };


};



// not work with large SVG
function exportToPNG_2(boundary) {

    var svgTag = $("#div-svgid > svg");
    //console.log(svgTag.html());

    //var width = svgTag.attr('width');
    //var height = svgTag.attr('height');
    var width = boundary.boundaryMaxx - boundary.boundaryMinx;
    var height = boundary.boundaryMaxy - boundary.boundaryMiny;

    // Test value
    //width = 640;
    //height = 480;
    //var svgCanvas = document.createElement('canvas');
    var svgCanvas = document.getElementById('canvas');
    svgCanvas.width = width;
    svgCanvas.height = height;
    var canvasContext = svgCanvas.getContext("2d");

    //canvasContext.drawSvg('<svg> <defs>  <radialGradient r="0.5" cy="0.5" cx="0.5" id="svg_2">   <stop stop-color="#ff0000" offset="0"/>   <stop stop-color="#ffff00" offset="1"/>  </radialGradient> </defs> <g>  <title>Layer 1</title>  <rect fill="url(#svg_2)" height="78" width="136" y="107" x="109"/> </g></svg>', 0 , 0 , 640, 480);
    canvasContext.drawSvg('<svg >' + svgTag.html() + '</svg>', 0 , 0 , width, height);
    //var htmlCont = svgTag.html();
    //canvasContext.drawSvg(htmlCont, 0 , 0 , width, height);

    var img = svgCanvas.toDataURL("image/png");

    var a = document.getElementById("export-pdf-link");
    a.download = "qMap.png";
    a.href = img;

    $("#svgdataurl").attr("src", img);

    console.log(img);

};

// Load svg file, but couldn't load svg xml
function exportToPNG_3(boundary) {

    var svgTag = $("#div-svgid");
    var width = boundary.boundaryMaxx - boundary.boundaryMinx;
    var height = boundary.boundaryMaxy - boundary.boundaryMiny;

    var svgCanvas = document.getElementById('canvas');
    svgCanvas.width = width*2;
    svgCanvas.height = height*2;
    var canvasContext = svgCanvas.getContext("2d");

    var img = new Image;
    img.onload = function(){
        canvasContext.drawImage(img,0,0);
    };
    img.src = 'tiger.svg';

    // var svg = document.getElementsByTagName('svg')[0];
    // var svg_xml = (new XMLSerializer).serializeToString(svg);
    // img.src = svg_xml;
    // console.log(svg_xml);

};

// 4. xlink:href not working with Raphael
function exportToPNG(boundary, svgScale) {

    // var svgTag = document.getElementById('canvas');
    // var svgTag = $("#div-svgid > svg").clone();
    // svgTag.html(svgTag.html().replace(/ href/g, " xlink:href"));
    // console.log(svgTag.html());
    // saveSvgAsPng(svgTag[0], 'test.png');
    //------------------------

    //var canvas = $("#div-svgid > svg")[0];
    var divSVG = $("#div-svgid");

    // Convert all WhiteStroke Link to BlackStroke Link
    var htmlContent = divSVG.html().replace(/ stroke=\"#FFFFFF\"/g, " stroke='#000000'");
    //console.log(htmlContent);
    //$("#svgtxt").val(htmlContent);
    //$("#pngdataurl").html($("#svgtxt").val());
    $("#pngdataurl").html(htmlContent);

    var canvas = $('#pngdataurl svg')[0];
    try {
      // svgAsDataUri(canvas, svgScale, null, function(uri) {
      //   $("#svgdataurl").attr("src", uri);
      //   var a = document.getElementById("export-pdf-link");
      //   a.download = "qMap.png";
      //   a.href = uri;
      // });

        // svgAsDataUri(canvas, svgScale, null, function(uri) {
        //     //$("#svgdataurl").attr("src", uri);

        //     var canvas = document.querySelector("canvas"),
        //         context = canvas.getContext("2d");

        //     var image = new Image;
        //     image.src = uri;
        //     image.onload = function() {
        //         context.drawImage(image, 0, 0);
        //         var canvasdata = canvas.toDataURL("image/png");
        //         var pngimg = '<img src="' + canvasdata + '">';
        //         $("#pngdataurl").html(pngimg);

        //         var a = document.getElementById("export-pdf-link");
        //         a.download = "qMap.png";
        //         a.href = uri;
        //     };
        // });
        var scaleFactor = 1;
        //saveSvgAsPng(canvas, 'qmap.png', boundary, svgScale, scaleFactor);
        var filename = "qMap_" + CommonUtil.getDateString() + "_" + CommonUtil.getTimeString() + ".png";
        SVGExporter.saveSvgAsPng(canvas, filename, boundary, svgScale, scaleFactor);
    } catch(err) {
      console.log(err.message);
    }
};

// use CANVG to convert ->> Issue: without CSS -->> Ok 1
function exportToPNG_5(boundary) {

    //var svgTag = $("#div-svgid > svg");
    var width = boundary.boundaryMaxx - boundary.boundaryMinx;
    var height = boundary.boundaryMaxy - boundary.boundaryMiny;

    var svgCanvas = document.getElementById('canvas');
    svgCanvas.width = width;
    svgCanvas.height = height;
    var canvasContext = svgCanvas.getContext("2d");

    var svg = document.getElementsByTagName('svg')[0];
    // this test code make failed
    //svg.innerHTML = svg.innerHTML + '<style type="text/css"><![CDATA[#div-svgid rect {cursor: pointer;left: 5px;stroke: #FFFFFF;stroke-width: 0.5;top: 5px;}.node-rect.node-level-0 {stroke-width: 4 !important;}.node-rect, .node-text {cursor: pointer;}]]></style>';

    //var svgTag = $("#div-svgid > svg");
    //svgTag.attr("viewBox", ""); //-- Not help
    //var svg_xml = (new XMLSerializer).serializeToString(svgTag[0]);

    var svg_xml = (new XMLSerializer).serializeToString(svg);

    canvg(svgCanvas, svg_xml, {
        ignoreMouse: true,
        ignoreAnimation: true,
        renderCallback: function ()
        {
            //save canvas as image
            //Canvas2Image.saveAsPNG(svgCanvas);
            console.log(svgCanvas);
        }
    });

    //$("#svgdataurl").attr("src", img);
    //console.log(img);

};

// use CANVG and third party lib: SVGENIE, to convert ->> Issue: without CSS -->> Ok 2
function exportToPNG_6(boundary) {

    var svg = document.getElementsByTagName('svg')[0];
    //-----------------------------
    var svgTag = $("#div-svgid > svg");//.clone();


    //svgTag.append('<style type="text/css">'
    // + 'rect {cursor: pointer;left: 5px;stroke: #FFFFFF;stroke-width: 0.5;top: 5px;}'
    // + '</style>');
    //console.log(svgTag.html());
    //-----------------------------
    svgenie.save(svgTag[0], { name:"this.png" } );

    return;

    // var width = boundary.boundaryMaxx - boundary.boundaryMinx;
    // var height = boundary.boundaryMaxy - boundary.boundaryMiny;

    // var svgCanvas = document.getElementById('canvas');
    // svgCanvas.width = width;
    // svgCanvas.height = height;
    // var canvasContext = svgCanvas.getContext("2d");


    // var svg = document.getElementsByTagName('svg')[0];

    // var svgTag = $("#div-svgid > svg").clone();
    // svgTag.html(svgTag.html() + '<style type="text/css"><![CDATA[#div-svgid rect {cursor: pointer;left: 5px;stroke: #FFFFFF;stroke-width: 0.5;top: 5px;}.node-rect.node-level-0 {stroke-width: 4 !important;}.node-rect, .node-text {cursor: pointer;}]]></style>');
    // console.log(svgTag.html());

    // //var svg_xml = (new XMLSerializer).serializeToString(svg);
    // var svg_xml = (new XMLSerializer).serializeToString(svgTag[0]);

    // canvg(svgCanvas, svg_xml, {
    //     ignoreMouse: true,
    //     ignoreAnimation: true,
    //     renderCallback: function ()
    //     {
    //         //save canvas as image
    //         //Canvas2Image.saveAsPNG(svgCanvas);
    //         console.log(svgCanvas);
    //     }
    // });
};
//---------- For ExportToPNG ---------------------

//---------- For ExportToPDF ---------------------
function exportToPDF(boundary, svgScale) {
    var divSVG = $("#div-svgid");

    // Convert all WhiteStroke Link to BlackStroke Link
    var htmlContent = divSVG.html().replace(/ stroke=\"#FFFFFF\"/g, " stroke='#000000'");
    $("#pngdataurl").html(htmlContent);

    var canvas = $('#pngdataurl svg')[0];
    try {
        var scaleFactor = 1;
        //saveSvgAsPdf(canvas, 'qMap.pdf', boundary, svgScale, scaleFactor);
        var filename = "qMap_" + CommonUtil.getDateString() + "_" + CommonUtil.getTimeString() + ".pdf";
        SVGExporter.saveSvgAsPdf(canvas, filename, boundary, svgScale, scaleFactor);
    } catch(err) {
      console.log(err.message);
    }
};
