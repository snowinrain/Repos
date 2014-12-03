<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
	<h2 class="sub-header">Employees List</h2>
	<div class="table-responsive">
		<table class="table table-striped">
			<thead>
				<tr>
					<th ng-repeat="header in headers">
				        <sort-by onsort="onSort" sortdir="filterCriteria.sortDir" sortedby="filterCriteria.sortedBy" sortvalue="{{header.value}}">{{ header.title }}</sort-by>
				      </th>
				</tr>
			</thead>
			<tbody>
				<tr ng-repeat='emp in employees.content'>
					<td>{{emp.firstName}}</td>
					<td>{{emp.lastName}}</td>
					<td>{{emp.email}}</td>
					<td>{{emp.gender ? 'Male' : 'Female'}}</td>
					<td>{{emp.birthDate | date:'yyyy-MM-dd'}}</td>
					<td><a ng-click="selectedEmp(emp)" href="#/edit">Edit</a> <a
						ng-click="deleteEmp(emp)" href="#/list">Delete</a></td>
				</tr>
			</tbody>
		</table>
		Page Size: <input type="text" class="form-control" ng-model="filterCriteria.pageSize" required/>
		<ul class="pagination pagination-sm">
            <li ng-class="{active:0}">
            	<a href="#" ng-click="selectPage(0)">First</a>
            </li>
            <li ng-repeat="n in [] | range:employees.totalPages">
            	<a href="#" ng-click="selectPage(n)" ng-bind="n + 1"></a>
            </li>
            <li>
            	<a href="#" ng-click="selectPage(employees.totalPages - 1)">Last</a>
            </li>
        </ul>
	</div>
</div>
