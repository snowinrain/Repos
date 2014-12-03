<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="">
<meta name="author" content="">
<link rel="icon" href="../../favicon.ico">

<title>AngularJS Tutorial</title>

<script type="text/javascript" src="<c:url value="/js/angular.js"/>"></script>
<script type="text/javascript" src="<c:url value="/js/angular-ui-router.min.js"/>"></script>
<script type="text/javascript" src="<c:url value="/js/angular-resource.min.js"/>"></script>
<script type="text/javascript" src="<c:url value="/js/app.js"/>"></script>
<script type="text/javascript" src="<c:url value="/js/controllers.js"/>"></script>
<!-- Bootstrap core CSS -->
<link href="<c:url value="/css/bootstrap.min.css"/>" rel="stylesheet">

<!-- Custom styles for this template -->
<link href="<c:url value="/css/dashboard.css"/>" rel="stylesheet">
<link href="<c:url value="/css/datetimepicker.css"/>" rel="stylesheet">

<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->


</head>

<body ng-app='MyTutorialApp'>

	<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
		<div class="container-fluid">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle" data-toggle="collapse"
					data-target=".navbar-collapse">
					<span class="sr-only">Toggle navigation</span> <span
						class="icon-bar"></span> <span class="icon-bar"></span> <span
						class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="#">AngularJS Tutorial</a>
			</div>
			<div class="navbar-collapse collapse">
				<ul class="nav navbar-nav navbar-right">
					<li><a href="#">Nhan Le</a></li>
					<li><a href="#">Log Out</a></li>
				</ul>
				<form class="navbar-form navbar-right">
					<input type="text" class="form-control" placeholder="Search...">
				</form>
			</div>
		</div>
	</div>

	<div class="container-fluid" ng-controller="EmployeeController">
		<div class="row">
			<div class="col-sm-3 col-md-2 sidebar">
				<ul class="nav nav-sidebar">
					<li ng-class="{active: $state.includes('list')}"><a href="#">List Employee</a></li>
					<li ng-class="{active: $state.includes('add')}"><a href="#/add" ng-click="navToAddEmp()">Add Employee</a></li>
				</ul>
			</div>
			<div ui-view></div>
		</div>
	</div>


	<!-- Bootstrap core JavaScript
    ================================================== -->
	<!-- Placed at the end of the document so the pages load faster -->
	<script type="text/javascript" src="<c:url value="/js/moment.js"/>"></script>
	<script src="<c:url value="/js/jquery.min.js"/>"></script>
	<script src="<c:url value="/js/bootstrap.min.js"/>"></script>
	<script type="text/javascript" src="<c:url value="/js/datetimepicker.js"/>"></script>
</body>
</html>
