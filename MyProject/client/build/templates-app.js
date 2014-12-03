angular.module('templates-app', ['main/main.tpl.html']);

angular.module("main/main.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("main/main.tpl.html",
    "<nav class=\"navbar navbar-inverse navbar-fixed-top\" role=\"navigation\">\n" +
    "      <div class=\"container\">\n" +
    "        <div class=\"navbar-header\">\n" +
    "          <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#navbar\" aria-expanded=\"false\" aria-controls=\"navbar\">\n" +
    "            <span class=\"sr-only\">Toggle navigation</span>\n" +
    "            <span class=\"icon-bar\"></span>\n" +
    "            <span class=\"icon-bar\"></span>\n" +
    "            <span class=\"icon-bar\"></span>\n" +
    "          </button>\n" +
    "          <a class=\"navbar-brand\" href=\"#\">My Project</a>\n" +
    "        </div>\n" +
    "        <div id=\"navbar\" class=\"collapse navbar-collapse\">\n" +
    "          <ul class=\"nav navbar-nav\">\n" +
    "            <li class=\"active\"><a href=\"#\">Home</a></li>\n" +
    "            <!-- <li><a href=\"#about\">About</a></li> -->\n" +
    "          </ul>\n" +
    "        </div><!--/.nav-collapse -->\n" +
    "      </div>\n" +
    "    </nav>\n" +
    "\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "      <div class=\"starter-template\">\n" +
    "        <h1>PATIENT MANAGEMENT</h1>\n" +
    "        <div class=\"\">Add Patient</div>\n" +
    "        \n" +
    "        <div id=\"grid\"></div>\n" +
    "\n" +
    "        <label>Birthday: <input kendo-date-picker /></label>\n" +
    "      \n" +
    "\n" +
    "    </div><!-- /.container -->");
}]);
