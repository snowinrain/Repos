<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
	<h2 class="sub-header" ng-if="$state.includes('add')">Add Employee</h2>
	<h2 class="sub-header"  ng-if="$state.includes('edit')">Edit Employee</h2>
	<form role="form" name="addForm" ng-submit="addOrEditEmployee(addForm.$valid)" novalidate>

		<div class="form-group" ng-class="{ 'has-error' : addForm.fName.$invalid && (!addForm.fName.$pristine || submitted) }">
			<label for="fName">First Name</label>
			<input type="text" class="form-control" name="fName" id="fName" placeholder="First Name" ng-model="emp.firstName" required/>
			<p ng-show="addForm.fName.$invalid && (!addForm.fName.$pristine || submitted)" class="help-block">First Name is required !</p>
		</div>

		<div class="form-group" ng-class="{ 'has-error' : addForm.lName.$invalid && (!addForm.lName.$pristine || submitted) }">
			<label for="lName">Last Name</label>
			<input type="text" class="form-control" name="lName" id="lName" placeholder="Last Name" ng-model="emp.lastName" required/>
			<p ng-show="addForm.lName.$invalid && (!addForm.lName.$pristine || submitted)" class="help-block">Last Name is required !</p>
		</div>

		<div class="form-group" ng-class="{ 'has-error' : addForm.email.$invalid && (!addForm.email.$pristine || submitted) }">
			<label for="email">Email</label>
			<input type="email"	class="form-control" name="email" id="email" placeholder="Email" ng-model="emp.email" required/>
			<p ng-show="addForm.email.$invalid && (!addForm.email.$pristine || submitted)" class="help-block">Enter a valid email !</p>
		</div>

		<div class="form-group">
			<label>Gender</label>
			<div class="radio">
			  <label>
			    <input type="radio" name="gender" id="male" value="true" ng-model="emp.gender" ng-checked="emp.gender">
			    Male
			  </label>
			</div>
			<div class="radio">
			  <label>
			    <input type="radio" name="gender" id="female" value="false" ng-model="emp.gender" ng-checked="!emp.gender">
			    Female
			  </label>
			</div>
		</div>

		<div class="form-group" ng-class="{ 'has-error' : addForm.DOB.$invalid && (!addForm.DOB.$pristine || submitted) }">
			<label for="DOB">Birth Date</label>
			<div class="dropdown">
		      <a class="dropdown-toggle" id="dropdown2" role="button" data-toggle="dropdown" >
		        <div class="input-group">
		        	<input type="date" class="form-control" name="DOB" id="DOB" data-ng-model="emp.birthDate" required />
		        		<span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span>
		        </div>
		      </a>
		      <ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">
		        <datetimepicker data-ng-model="emp.birthDate" data-datetimepicker-config="{ dropdownSelector: '#dropdown2', startView:'day', minView:'day' }"/>
		      </ul>
		    </div>
			<p ng-show="addForm.DOB.$invalid && (!addForm.DOB.$pristine || submitted)" class="help-block">Birth Date is required !</p>
		</div>

		<button type="submit" class="btn btn-primary">Submit</button>


	</form>
</div>
